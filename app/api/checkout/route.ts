import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { getAuthUser, getCartSession } from '@/lib/utils/auth-helpers';
import { checkoutSchema } from '@/lib/validators/checkout.schema';
import checkoutService from '@/lib/services/checkout.service';

export const POST = apiHandler(async (request) => {
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  const body = checkoutSchema.parse(await request.json());
  const result = await checkoutService.initiateCheckout(
    { userId: user?._id, sessionId },
    body,
  );
  return ok(result, 'Checkout initiated');
});
