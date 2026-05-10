import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { getAuthUser } from '@/lib/utils/auth-helpers';
import { z } from 'zod';
import orderService from '@/lib/services/order.service';

const verifySchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const POST = apiHandler(async (request, context) => {
  const { orderId } = await context.params;
  const user = await getAuthUser(request);
  const body = verifySchema.parse(await request.json());
  const result = await orderService.verifyAndConfirmPayment(
    orderId as string,
    user?._id,
    body.razorpayOrderId,
    body.razorpayPaymentId,
    body.razorpaySignature,
  );
  return ok(result, 'Payment verified');
});
