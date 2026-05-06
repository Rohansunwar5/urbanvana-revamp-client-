import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import storeAnalyticsService from '@/lib/services/store-analytics.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 10;
  const result = await storeAnalyticsService.getTopProducts(limit);
  return ok(result, 'Top products fetched');
});
