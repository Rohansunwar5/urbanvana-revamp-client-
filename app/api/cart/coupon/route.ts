import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { getAuthUser, getCartSession } from '@/lib/utils/auth-helpers';
import { applyCouponSchema } from '@/lib/validators/cart.schema';
import cartService from '@/lib/services/cart.service';

export const POST = apiHandler(async (request) => {
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  const body = applyCouponSchema.parse(await request.json());
  const result = await cartService.applyCoupon({ userId: user?._id, sessionId }, body.code);
  return ok(result, 'Coupon applied');
});

export const DELETE = apiHandler(async (request) => {
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  const result = await cartService.removeCoupon({ userId: user?._id, sessionId });
  return ok(result, 'Coupon removed');
});
