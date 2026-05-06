import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { createCouponSchema } from '@/lib/validators/coupon.schema';
import couponService from '@/lib/services/coupon.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const result = await couponService.listCoupons();
  return ok(result, 'Coupons fetched');
});

export const POST = apiHandler(async (request) => {
  const admin = await requireAdminAuth(request);
  const body = createCouponSchema.parse(await request.json());
  const result = await couponService.createCoupon({
    ...body,
    startsAt: new Date(body.startsAt),
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    createdBy: admin._id,
  });
  return ok(result, 'Coupon created', 201);
});
