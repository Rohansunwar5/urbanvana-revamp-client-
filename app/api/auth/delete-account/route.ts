import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { strictLimit } from '@/lib/utils/rate-limit';
import { deleteAccountSchema } from '@/lib/validators/auth.schema';
import authService from '@/lib/services/auth.service';

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const user = await requireAuth(request);
  await strictLimit(ip);
  const body = deleteAccountSchema.parse(await request.json());
  await authService.deleteAccount(body.code, user._id);
  return ok(null, 'Account deleted');
});
