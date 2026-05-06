import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import orderService from '@/lib/services/order.service';

export const GET = apiHandler(async (request) => {
  const user = await requireAuth(request);
  const { searchParams } = new URL(request.url);
  const result = await orderService.getUserOrders(
    user._id,
    Number(searchParams.get('page')) || 1,
    Number(searchParams.get('limit')) || 10,
  );
  return ok(result, 'Orders fetched');
});
