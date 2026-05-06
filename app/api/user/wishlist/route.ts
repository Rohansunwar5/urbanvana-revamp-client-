import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { wishlistProductSchema } from '@/lib/validators/address.schema';
import wishlistService from '@/lib/services/wishlist.service';

export const GET = apiHandler(async (request) => {
  const user = await requireAuth(request);
  const result = await wishlistService.getWishlist(user._id);
  return ok(result, 'Wishlist fetched');
});

export const POST = apiHandler(async (request) => {
  const user = await requireAuth(request);
  const body = wishlistProductSchema.parse(await request.json());
  await wishlistService.addProduct(user._id, body.productId);
  return ok(null, 'Product added to wishlist');
});
