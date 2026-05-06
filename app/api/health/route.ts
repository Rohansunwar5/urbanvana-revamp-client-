import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';

export const GET = apiHandler(async () => {
  return ok({ status: 'ok', timestamp: new Date().toISOString() }, 'Healthy');
});
