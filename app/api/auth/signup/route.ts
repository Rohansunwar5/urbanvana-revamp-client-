import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { authLimit } from '@/lib/utils/rate-limit';
import { signupSchema } from '@/lib/validators/auth.schema';
import authService from '@/lib/services/auth.service';

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24h — matches JWT expiry

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await authLimit(ip);
  const body = signupSchema.parse(await request.json());
  const { accessToken } = await authService.signup(body);
  const response = ok({ success: true }, 'Signup successful', 201);
  response.cookies.set('auth_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  return response;
});
