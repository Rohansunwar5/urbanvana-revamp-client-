import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { authLimit } from '@/lib/utils/rate-limit';
import { signupSchema } from '@/lib/validators/auth.schema';
import authService from '@/lib/services/auth.service';

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await authLimit(ip);
  const body = signupSchema.parse(await request.json());
  const result = await authService.signup(body);
  return ok(result, 'Signup successful', 201);
});
