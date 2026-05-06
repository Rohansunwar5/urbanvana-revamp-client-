import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import authService from '@/lib/services/auth.service';

export const POST = apiHandler(async (request) => {
  const user = await requireAuth(request);
  await authService.resendVerificationLink(user._id);
  return ok(null, 'Verification link sent');
});
