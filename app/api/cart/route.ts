import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { getAuthUser, getCartSession } from '@/lib/utils/auth-helpers';
import cartService from '@/lib/services/cart.service';

export const GET = apiHandler(async (request) => {
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  const result = await cartService.getCart({ userId: user?._id, sessionId });
  return ok(result, 'Cart fetched');
});

export const DELETE = apiHandler(async (request) => {
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  await cartService.clearCart({ userId: user?._id, sessionId });
  return ok(null, 'Cart cleared');
});
