import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth, getCartSession } from '@/lib/utils/auth-helpers';
import cartService from '@/lib/services/cart.service';

export const POST = apiHandler(async (request) => {
  const user = await requireAuth(request);
  const sessionId = getCartSession(request, user);
  const result = await cartService.mergeGuestCart(user._id, sessionId);
  return ok(result, 'Cart merged');
});
