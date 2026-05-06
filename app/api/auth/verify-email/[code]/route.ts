import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import authService from '@/lib/services/auth.service';

export const PATCH = apiHandler(async (_request, context) => {
  const { code } = await context.params;
  await authService.verifyEmail(code as string);
  return ok(null, 'Email verified successfully');
});
