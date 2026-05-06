import config from '@/lib/config';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { InternalServerError } from '@/lib/errors/internal-server.error';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { UnauthorizedError } from '@/lib/errors/unauthorized.error';
import { UserRepository } from '@/lib/repository/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import { sha1 } from '@/lib/utils/hash.util';
import mailService from '@/lib/services/mail.service';
import { OAuth2Client } from 'google-auth-library';
import { encode, encryptionKey } from '@/lib/services/crypto.service';
import {
  encodedJWTCacheManager,
  otpDeleteAccountCacheManager,
  profileCacheManager,
} from '@/lib/services/cache/entities';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 16);
const numericNanoid = customAlphabet('0123456789', 6);
const googleAuthClient = new OAuth2Client(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  'postmessage',
);

class AuthService {
  constructor(private readonly _userRepository: UserRepository) {}

  async login(params: { email: string; password: string }) {
    const { email, password } = params;
    const user = await this._userRepository.getUserByEmailId(email);
    if (!user) throw new NotFoundError('User not found');
    if (!user.password) throw new BadRequestError('Reset password');

    const success = await bcrypt.compare(password, user.password);
    if (!success) throw new UnauthorizedError('Invalid Email or Password');

    const accessToken = await this._generateJWTToken(user._id);
    if (!accessToken) throw new InternalServerError('Failed to generate accessToken');
    return { accessToken };
  }

  async signup(params: {
    firstName: string;
    lastName: string;
    isdCode?: string;
    phoneNumber?: string;
    email: string;
    password: string;
  }) {
    const { firstName, lastName, isdCode, phoneNumber, email, password } = params;
    const existing = await this._userRepository.getUserByEmailId(email);
    if (existing) throw new BadRequestError('Email address already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = nanoid();
    const user = await this._userRepository.onBoardUser({
      firstName,
      lastName,
      isdCode,
      phoneNumber,
      email,
      password: hashedPassword,
      verificationCode: sha1(verificationCode),
      img: { link: 'default-profile.png', source: 'bucket' },
    });
    if (!user) throw new InternalServerError('Failed to onboard user');

    mailService.sendEmail(
      email,
      'verification.ejs',
      { verificationCode },
      'Verify Your Email Address to Get Started! - WorkPlay Studio Pvt Ltd.',
    );

    const accessToken = await this._generateJWTToken(user._id);
    if (!accessToken) throw new InternalServerError('Failed to generate accessToken');
    return { accessToken };
  }

  async profile(userId: string) {
    const cached = await profileCacheManager.get({ userId });
    if (cached) return cached;
    const user = await this._userRepository.getUserById(userId);
    if (!user) throw new NotFoundError('User not found');
    await profileCacheManager.set({ userId }, user);
    return user;
  }

  async updateProfile(params: {
    firstName: string;
    lastName: string;
    isdCode?: string;
    phoneNumber?: string;
    _id: string;
    bio?: string;
    location?: string;
    company?: { name?: string; url?: string };
    socials?: {
      twitter?: string;
      github?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
  }) {
    const user = await this._userRepository.updateUser(params);
    if (!user) throw new NotFoundError('User not found');
    await profileCacheManager.remove({ userId: params._id });
    return user;
  }

  async resendVerificationLink(userId: string) {
    const existing = await this._userRepository.getUserById(userId);
    if (existing?.verified) throw new BadRequestError('Email already verified');

    const verificationCode = nanoid();
    const user = await this._userRepository.updateVerificationCode(userId, sha1(verificationCode));
    if (!user) throw new InternalServerError('Failed to generate verification code');

    mailService.sendEmail(
      user.email,
      'verification.ejs',
      { verificationCode },
      'Verify Your Email Address to Get Started! - WorkPlay Studio Pvt Ltd.',
    );
    return true;
  }

  async verifyEmail(code: string) {
    const user = await this._userRepository.verifyUser(code);
    if (!user) throw new BadRequestError('Invalid Code');
    const newCode = nanoid();
    await this._userRepository.updateVerificationCode(user.id, sha1(newCode));
    return true;
  }

  async generateResetPasswordLink(email: string) {
    const existing = await this._userRepository.getUserByEmailId(email);
    if (!existing) throw new NotFoundError('User not found');

    const verificationCode = nanoid();
    const user = await this._userRepository.updateVerificationCode(existing._id, sha1(verificationCode));
    if (!user) throw new InternalServerError('Failed to generate verification code');

    mailService.sendEmail(
      user.email,
      'reset-password.ejs',
      { verificationCode, firstName: user.firstName },
      'Reset Your Password: Regain Access to Your Account! - WorkPlay Studio Pvt Ltd.',
    );
    return true;
  }

  async verifyResetPasswordCode(code: string) {
    const user = await this._userRepository.getUserWithVerificationCode(code);
    if (!user) throw new BadRequestError('Invalid code');
    return true;
  }

  async resetPassword(code: string, password: string) {
    const user = await this._userRepository.getUserWithVerificationCode(code);
    if (!user) throw new BadRequestError('Invalid code');

    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await this._userRepository.resetPassword(code, hashedPassword);
    if (!updated) throw new InternalServerError('Failed to reset password');

    const newCode = nanoid();
    await this._userRepository.updateVerificationCode(user.id, sha1(newCode));

    mailService.sendEmail(
      user.email,
      'reset-password-success.ejs',
      { firstName: user.firstName },
      'Password Reset Successful: Login Now! - WorkPlay Studio Pvt Ltd.',
    );
    return true;
  }

  async sso(code: string) {
    try {
      const { tokens } = await googleAuthClient.getToken(code);
      if (!tokens.id_token) throw new BadRequestError('Code Invalid or Expired');

      const ticket = await googleAuthClient.verifyIdToken({ idToken: tokens.id_token });
      const payload = ticket.getPayload();
      if (!payload) throw new BadRequestError('Code Invalid or Expired');

      const { family_name, given_name, email, picture } = payload as {
        family_name: string;
        given_name: string;
        email: string;
        picture: string;
      };

      const userId = await this._ssoLogin({
        family_name,
        given_name,
        email,
        img: { link: picture, source: 'oauth' },
      });
      if (!userId) throw new UnauthorizedError('Code Invalid or Expired');

      const accessToken = await this._generateJWTToken(userId);
      if (!accessToken) throw new InternalServerError('Failed to generate accessToken');
      return { accessToken };
    } catch {
      throw new BadRequestError('Code Invalid or Expired');
    }
  }

  async updateProfileImage(userId: string, fileName: string) {
    const updated = await this._userRepository.updateUserProfileImage(userId, fileName);
    if (!updated) throw new InternalServerError('Failed to update profile image');
    return true;
  }

  async generateAccountDeletionCode(userId: string) {
    const user = await this._userRepository.getUserById(userId);
    if (!user) throw new NotFoundError('User not found');

    const code = numericNanoid();
    await otpDeleteAccountCacheManager.set({ userId }, { code });

    mailService.sendEmail(
      user.email,
      'delete-account.ejs',
      { firstName: user.firstName, code },
      "Here's Your Account Deletion Secure Code",
    );
    return true;
  }

  async deleteAccount(code: string, userId: string) {
    const stored = await otpDeleteAccountCacheManager.get({ userId });
    if (stored?.code !== code) throw new BadRequestError('Invalid OTP');

    const updated = await this._userRepository.deleteAccount(userId);
    if (!updated) throw new InternalServerError('Failed to delete account');

    await this._generateJWTToken(userId);
    return true;
  }

  private async _generateJWTToken(userId: string): Promise<string> {
    const token = jwt.sign({ _id: userId.toString() }, config.JWT_SECRET, { expiresIn: '24h' });
    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const encrypted = await encode(token, key);
    await encodedJWTCacheManager.set({ userId }, encrypted);
    return token;
  }

  private async _ssoLogin(params: {
    family_name: string;
    given_name: string;
    email: string;
    img: { link: string; source: string };
  }): Promise<string> {
    const { family_name, given_name, email, img } = params;
    const existing = await this._userRepository.getUserByEmailId(email);

    if (!existing) {
      const verificationCode = nanoid();
      const user = await this._userRepository.onBoardUser({
        firstName: given_name,
        lastName: family_name,
        email,
        verificationCode: sha1(verificationCode),
        verified: true,
        img,
      });
      if (!user) throw new InternalServerError('Failed to onboard user');
      return user._id;
    }

    if (!existing.verified) {
      await this._userRepository.verifyUserId(existing._id);
    }
    return existing._id;
  }
}

export default new AuthService(new UserRepository());
