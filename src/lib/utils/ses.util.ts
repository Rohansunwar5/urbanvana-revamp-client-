import { SESClient } from '@aws-sdk/client-ses';
import config from '@/lib/config';

export const ses = new SESClient({
  credentials: {
    accessKeyId: config.AWS_ACCESS_ID,
    secretAccessKey: config.AWS_SECRET,
  },
  region: config.AWS_REGION,
});
