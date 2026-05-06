import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import orderService from '@/lib/services/order.service';

export const POST = apiHandler(async (request, context) => {
  const user = await requireAuth(request);
  const { orderId } = await context.params;
  const result = await orderService.retryPayment(orderId as string, user._id);
  return ok(result, 'Retry payment initiated');
});
