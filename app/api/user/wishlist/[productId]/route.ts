import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import wishlistService from '@/lib/services/wishlist.service';

export const DELETE = apiHandler(async (request, context) => {
  const user = await requireAuth(request);
  const { productId } = await context.params;
  await wishlistService.removeProduct(user._id, productId as string);
  return ok(null, 'Product removed from wishlist');
});
