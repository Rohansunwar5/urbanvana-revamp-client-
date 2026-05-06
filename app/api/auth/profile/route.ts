import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { updateProfileSchema } from '@/lib/validators/auth.schema';
import authService from '@/lib/services/auth.service';

export const GET = apiHandler(async (request) => {
  const user = await requireAuth(request);
  const result = await authService.profile(user._id);
  return ok(result, 'Profile fetched');
});

export const PATCH = apiHandler(async (request) => {
  const user = await requireAuth(request);
  const body = updateProfileSchema.parse(await request.json());
  const result = await authService.updateProfile({ ...body, _id: user._id });
  return ok(result, 'Profile updated');
});
