import { Types } from 'mongoose';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { s3 } from '@/lib/utils/s3.util';
import config from '@/lib/config';

class UploadService {
  async uploadToS3(
    buffer: Buffer,
    mimetype: string,
    bucketFolder: string,
    originalName: string,
    fileName?: string,
  ): Promise<{ fileName: string }> {
    if (!buffer) throw new BadRequestError('No image buffer provided');
    if (!mimetype) throw new BadRequestError('Invalid or unsupported mimetype');

    const splitted = originalName.split('.');
    const ext = splitted[splitted.length - 1];
    const name = fileName || String(new Types.ObjectId());
    const fileNameWithExt = `${name}.${ext}`;

    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: `${bucketFolder}/${fileNameWithExt}`,
      Body: buffer,
      ContentType: mimetype,
    };

    const response = await s3.upload(params).promise();
    if (!response) throw new BadRequestError('Failed to upload file');
    return { fileName: fileNameWithExt };
  }
}

export default new UploadService();
