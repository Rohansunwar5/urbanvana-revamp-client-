import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { authLimit } from '@/lib/utils/rate-limit';
import { loginSchema } from '@/lib/validators/auth.schema';
import authService from '@/lib/services/auth.service';

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await authLimit(ip);
  const body = loginSchema.parse(await request.json());
  const result = await authService.login(body);
  return ok(result, 'Login successful');
});
