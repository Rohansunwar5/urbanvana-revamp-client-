import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { strictLimit } from '@/lib/utils/rate-limit';
import { generateResetPasswordSchema } from '@/lib/validators/auth.schema';
import authService from '@/lib/services/auth.service';

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await strictLimit(ip);
  const body = generateResetPasswordSchema.parse(await request.json());
  await authService.generateResetPasswordLink(body.email);
  return ok(null, 'Reset password link sent');
});
