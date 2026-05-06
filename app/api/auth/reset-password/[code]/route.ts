import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { strictLimit } from '@/lib/utils/rate-limit';
import { resetPasswordSchema } from '@/lib/validators/auth.schema';
import authService from '@/lib/services/auth.service';

export const GET = apiHandler(async (request, context) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await strictLimit(ip);
  const { code } = await context.params;
  await authService.verifyResetPasswordCode(code as string);
  return ok(null, 'Code is valid');
});

export const PATCH = apiHandler(async (request, context) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await strictLimit(ip);
  const { code } = await context.params;
  const body = resetPasswordSchema.parse(await request.json());
  await authService.resetPassword(code as string, body.password);
  return ok(null, 'Password reset successful');
});
