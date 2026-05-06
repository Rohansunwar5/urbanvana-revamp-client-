import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { flashSaleSchema } from '@/lib/validators/catalog.schema';
import productVariantService from '@/lib/services/catalog/productVariant.service';

export const PATCH = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const rawBody = await request.json();
  const parsed = flashSaleSchema.parse(rawBody);
  const params = parsed
    ? { flashSalePrice: parsed.flashSalePrice, flashSaleEndsAt: new Date(parsed.flashSaleEndsAt) }
    : null;
  const result = await productVariantService.setFlashSale(id as string, params);
  return ok(result, 'Flash sale updated');
});
