import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import uploadService from '@/lib/services/upload.service';

const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/av1',
]);

const MAX_VIDEO_BYTES = 10 * 1024 * 1024; // 10 MB

export const POST = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) throw new BadRequestError('No file uploaded');

  if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
    throw new BadRequestError('Unsupported video format. Allowed: MP4, WebM, MOV, AV1');
  }

  if (file.size > MAX_VIDEO_BYTES) {
    throw new BadRequestError('Video exceeds 10 MB limit');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const folder = formData.get('folder') as string | null ?? 'products-videos';
  const url = await uploadService.upload(buffer, file.type, folder);
  return ok({ url }, 'Video uploaded');
});
