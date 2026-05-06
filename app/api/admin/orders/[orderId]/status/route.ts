import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { adminUpdateOrderStatusSchema } from '@/lib/validators/checkout.schema';
import orderService from '@/lib/services/order.service';

export const PATCH = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { orderId } = await context.params;
  const body = adminUpdateOrderStatusSchema.parse(await request.json());
  const result = await orderService.adminUpdateStatus(
    orderId as string,
    body.status,
    body.note,
    body.trackingInfo,
  );
  return ok(result, 'Order status updated');
});
