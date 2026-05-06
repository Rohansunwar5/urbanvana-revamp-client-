import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import productService from '@/lib/services/catalog/product.service';

export const GET = apiHandler(async (_request, context) => {
  const { slug } = await context.params;
  const result = await productService.getProductBySlug(slug as string);
  return ok(result, 'Product fetched');
});
