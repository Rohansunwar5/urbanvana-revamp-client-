import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { getAuthUser } from '@/lib/utils/auth-helpers';
import orderService from '@/lib/services/order.service';

export const GET = apiHandler(async (request, context) => {
  const { orderId } = await context.params;
  const user = await getAuthUser(request);
  const { searchParams } = new URL(request.url);
  const guestEmail = searchParams.get('email') ?? undefined;
  const result = await orderService.getOrder(orderId as string, user?._id, guestEmail);
  return ok(result, 'Order fetched');
});
