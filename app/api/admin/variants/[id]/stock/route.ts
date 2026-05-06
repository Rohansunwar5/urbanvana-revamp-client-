import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { adjustStockSchema } from '@/lib/validators/catalog.schema';
import productVariantService from '@/lib/services/catalog/productVariant.service';

export const PATCH = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const body = adjustStockSchema.parse(await request.json());
  const result = await productVariantService.adjustStock(id as string, body.delta);
  return ok(result, 'Stock adjusted');
});
