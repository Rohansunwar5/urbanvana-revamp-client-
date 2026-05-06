import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import storeAnalyticsService from '@/lib/services/store-analytics.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  if (!dateFrom || !dateTo) throw new BadRequestError('dateFrom and dateTo are required');
  const result = await storeAnalyticsService.getRevenue(dateFrom, dateTo);
  return ok(result, 'Revenue fetched');
});
