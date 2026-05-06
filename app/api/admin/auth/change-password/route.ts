import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { adminChangePasswordSchema } from '@/lib/validators/admin.auth.schema';
import adminAuthService from '@/lib/services/admin.auth.service';

export const PATCH = apiHandler(async (request) => {
  const admin = await requireAdminAuth(request);
  const body = adminChangePasswordSchema.parse(await request.json());
  await adminAuthService.changePassword(admin._id, body);
  return ok(null, 'Password changed successfully');
});
