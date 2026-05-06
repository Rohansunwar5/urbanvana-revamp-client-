import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { OrderStatus } from '@/lib/models/order.model';
import orderService from '@/lib/services/order.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const { searchParams } = new URL(request.url);
  const result = await orderService.adminListOrders({
    status: (searchParams.get('status') as OrderStatus) || undefined,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
  });
  return ok(result, 'Orders fetched');
});
