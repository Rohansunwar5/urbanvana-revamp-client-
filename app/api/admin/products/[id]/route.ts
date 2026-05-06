import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { updateProductSchema } from '@/lib/validators/catalog.schema';
import productService from '@/lib/services/catalog/product.service';

// GET uses [id] as a slug for admin detail view
export const GET = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const result = await productService.getProductBySlugAdmin(id as string);
  return ok(result, 'Product fetched');
});

export const PATCH = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const body = updateProductSchema.parse(await request.json());
  const result = await productService.updateProduct(id as string, body);
  return ok(result, 'Product updated');
});

export const DELETE = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  await productService.softDeleteProduct(id as string);
  return ok(null, 'Product deleted');
});
