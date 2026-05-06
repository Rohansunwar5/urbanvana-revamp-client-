import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import authService from '@/lib/services/auth.service';
import uploadService from '@/lib/services/upload.service';

export const PUT = apiHandler(async (request) => {
  const user = await requireAuth(request);
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) throw new BadRequestError('No file uploaded');

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = await uploadService.upload(buffer, file.type, 'profile-images', file.name);
  await authService.updateProfileImage(user._id, fileName);
  return ok({ fileName }, 'Profile image updated');
});
