import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import productService from '@/lib/services/catalog/product.service';

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;
  const result = await productService.searchProducts(q, page, limit);
  return ok(result, 'Search results');
});
