import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import orderService from '@/lib/services/order.service';

export const POST = apiHandler(async (request) => {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';
  const payload = JSON.parse(rawBody) as Record<string, unknown>;
  const result = await orderService.processWebhook(rawBody, signature, payload);
  return ok(result, 'Webhook received');
});
