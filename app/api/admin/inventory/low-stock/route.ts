import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import productVariantService from '@/lib/services/catalog/productVariant.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const result = await productVariantService.getLowStockVariants();
  return ok(result, 'Low stock variants fetched');
});
