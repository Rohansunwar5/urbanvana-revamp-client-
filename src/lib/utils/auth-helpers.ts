import JWT from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import config from '@/lib/config';
import { UnauthorizedError } from '@/lib/errors/unauthorized.error';
import { encodedJWTCacheManager, adminJWTCacheManager } from '@/lib/services/cache/entities';
import { decode, encode, encryptionKey } from '@/lib/services/crypto.service';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 24);

interface IJWTPayload {
  _id: string;
}

function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const parts = authHeader.split(' ');
    return parts[1] ?? null;
  }
  // Fall back to HTTP-only cookie for browser requests
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }
  return null;
}

export async function getAuthUser(request: Request): Promise<{ _id: string } | null> {
  try {
    const token = extractBearerToken(request);
    if (!token) return null;

    const { _id } = JWT.verify(token, config.JWT_SECRET) as IJWTPayload;
    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const cachedJWT = await encodedJWTCacheManager.get({ userId: _id });

    if (!cachedJWT) {
      await encodedJWTCacheManager.set({ userId: _id }, await encode(token, key));
    } else {
      const decoded = await decode(cachedJWT, key);
      if (decoded !== token) return null;
    }

    return { _id };
  } catch {
    return null;
  }
}

export async function requireAuth(request: Request): Promise<{ _id: string }> {
  const user = await getAuthUser(request);
  if (!user) throw new UnauthorizedError('Authentication required');
  return user;
}

export async function getAdminUser(request: Request): Promise<{ _id: string } | null> {
  try {
    const token = extractBearerToken(request);
    if (!token) return null;

    const { _id } = JWT.verify(token, config.ADMIN_JWT_SECRET) as IJWTPayload;
    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const cached = await adminJWTCacheManager.get({ adminId: _id });

    if (!cached) {
      await adminJWTCacheManager.set({ adminId: _id }, await encode(token, key));
    } else {
      const decoded = await decode(cached, key);
      if (decoded !== token) return null;
    }

    return { _id };
  } catch {
    return null;
  }
}

export async function requireAdminAuth(request: Request): Promise<{ _id: string }> {
  const admin = await getAdminUser(request);
  if (!admin) throw new UnauthorizedError('Admin authentication required');
  return admin;
}

export function getCartSession(
  request: Request,
  user?: { _id: string } | null,
): string {
  if (user) return user._id;
  const sessionId = request.headers.get('x-session-id');
  return sessionId && sessionId.length >= 8 ? sessionId : nanoid();
}
