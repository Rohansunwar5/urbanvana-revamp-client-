import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { customAlphabet } from 'nanoid';
import config from '@/lib/config';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 12);

export const r2 = new S3Client({
  endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.R2_ACCESS_KEY_ID,
    secretAccessKey: config.R2_SECRET_ACCESS_KEY,
  },
  region: 'auto',
});

export const uploadToR2 = async (
  buffer: Buffer,
  folder: string,
  contentType: string,
): Promise<string> => {
  const ext = contentType.split('/')[1] || 'webp';
  const key = `${folder}/${nanoid()}.${ext}`;

  await r2.send(new PutObjectCommand({
    Bucket: config.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  return `${config.R2_PUBLIC_URL}/${key}`;
};

export const deleteFromR2 = async (url: string): Promise<void> => {
  const key = url.replace(`${config.R2_PUBLIC_URL}/`, '');
  await r2.send(new DeleteObjectCommand({ Bucket: config.R2_BUCKET_NAME, Key: key }));
};
