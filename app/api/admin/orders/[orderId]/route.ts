import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import orderService from '@/lib/services/order.service';

export const GET = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { orderId } = await context.params;
  const result = await orderService.adminGetOrder(orderId as string);
  return ok(result, 'Order fetched');
});
