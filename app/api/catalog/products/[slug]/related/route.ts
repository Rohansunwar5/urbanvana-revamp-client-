import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import productService from '@/lib/services/catalog/product.service';

export const GET = apiHandler(async (request, context) => {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 6;
  const result = await productService.getRelatedProducts(slug as string, limit);
  return ok(result, 'Related products fetched');
});
