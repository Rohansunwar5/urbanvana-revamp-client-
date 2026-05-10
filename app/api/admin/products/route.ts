import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { createProductSchema } from '@/lib/validators/catalog.schema';
import productService from '@/lib/services/catalog/product.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const { searchParams } = new URL(request.url);
  const result = await productService.adminListProducts({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    search: searchParams.get('search') ?? undefined,
  });
  return ok(result, 'Products fetched');
});

export const POST = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const body = createProductSchema.parse(await request.json());
  const result = await productService.createProduct(body);
  return ok(result, 'Product created', 201);
});
