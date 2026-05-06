import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { strictLimit } from '@/lib/utils/rate-limit';
import authService from '@/lib/services/auth.service';

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const user = await requireAuth(request);
  await strictLimit(ip);
  await authService.generateAccountDeletionCode(user._id);
  return ok(null, 'Deletion code sent to your email');
});
