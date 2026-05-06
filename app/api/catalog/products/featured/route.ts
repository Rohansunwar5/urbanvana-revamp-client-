import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import productService from '@/lib/services/catalog/product.service';

export const GET = apiHandler(async () => {
  const result = await productService.getFeaturedProducts();
  return ok(result, 'Featured products fetched');
});
