import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import productService from '@/lib/services/catalog/product.service';

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const query: Record<string, unknown> = {};
  searchParams.forEach((value, key) => { query[key] = value; });
  const result = await productService.listProducts(query);
  return ok(result, 'Products fetched');
});
