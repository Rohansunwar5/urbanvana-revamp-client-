import { BadRequestError } from '@/lib/errors/bad-request.error';
import { uploadToR2, deleteFromR2 } from '@/lib/utils/r2.util';

class UploadService {
  async upload(buffer: Buffer, mimetype: string, folder: string): Promise<string> {
    if (!buffer) throw new BadRequestError('No image buffer provided');
    if (!mimetype) throw new BadRequestError('Invalid or unsupported mimetype');
    return uploadToR2(buffer, folder, mimetype);
  }

  async delete(url: string): Promise<void> {
    return deleteFromR2(url);
  }
}

export default new UploadService();
