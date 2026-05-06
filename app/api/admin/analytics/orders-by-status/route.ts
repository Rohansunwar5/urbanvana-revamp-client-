import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import storeAnalyticsService from '@/lib/services/store-analytics.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const result = await storeAnalyticsService.getOrdersByStatus();
  return ok(result, 'Orders by status fetched');
});
