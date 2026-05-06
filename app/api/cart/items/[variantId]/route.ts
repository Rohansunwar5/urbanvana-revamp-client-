import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { getAuthUser, getCartSession } from '@/lib/utils/auth-helpers';
import { updateItemQtySchema } from '@/lib/validators/cart.schema';
import cartService from '@/lib/services/cart.service';

export const PATCH = apiHandler(async (request, context) => {
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  const { variantId } = await context.params;
  const body = updateItemQtySchema.parse(await request.json());
  const result = await cartService.updateItemQty({ userId: user?._id, sessionId }, variantId as string, body.qty);
  return ok(result, 'Cart item updated');
});

export const DELETE = apiHandler(async (request, context) => {
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  const { variantId } = await context.params;
  const result = await cartService.removeItem({ userId: user?._id, sessionId }, variantId as string);
  return ok(result, 'Item removed from cart');
});
