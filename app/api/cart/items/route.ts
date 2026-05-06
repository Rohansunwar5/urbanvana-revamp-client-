import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { getAuthUser, getCartSession } from '@/lib/utils/auth-helpers';
import { addItemSchema } from '@/lib/validators/cart.schema';
import cartService from '@/lib/services/cart.service';

export const POST = apiHandler(async (request) => {
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  const body = addItemSchema.parse(await request.json());
  const result = await cartService.addItem({ userId: user?._id, sessionId }, body.variantId, body.qty);
  return ok(result, 'Item added to cart');
});
