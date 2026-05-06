import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import uploadService from '@/lib/services/upload.service';

export const POST = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) throw new BadRequestError('No file uploaded');

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadService.upload(buffer, file.type, 'admin-uploads', file.name);
  return ok({ url }, 'Image uploaded');
});
