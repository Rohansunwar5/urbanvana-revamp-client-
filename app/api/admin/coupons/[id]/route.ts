import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { updateCouponSchema } from '@/lib/validators/coupon.schema';
import couponService from '@/lib/services/coupon.service';

export const GET = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const result = await couponService.getCouponById(id as string);
  return ok(result, 'Coupon fetched');
});

export const PATCH = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const body = updateCouponSchema.parse(await request.json());
  const updates = {
    ...body,
    startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
    expiresAt: body.expiresAt !== undefined ? (body.expiresAt ? new Date(body.expiresAt) : null) : undefined,
  };
  const result = await couponService.updateCoupon(id as string, updates);
  return ok(result, 'Coupon updated');
});

export const DELETE = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  await couponService.deactivateCoupon(id as string);
  return ok(null, 'Coupon deactivated');
});
