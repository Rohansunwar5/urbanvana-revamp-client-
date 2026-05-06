import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import adminAuthService from '@/lib/services/admin.auth.service';

export const GET = apiHandler(async (request) => {
  const admin = await requireAdminAuth(request);
  const result = await adminAuthService.profile(admin._id);
  return ok(result, 'Admin profile fetched');
});
