import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { updateVariantSchema } from '@/lib/validators/catalog.schema';
import productVariantService from '@/lib/services/catalog/productVariant.service';

export const PATCH = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const body = updateVariantSchema.parse(await request.json());
  const result = await productVariantService.updateVariant(id as string, body);
  return ok(result, 'Variant updated');
});

export const DELETE = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  await productVariantService.deleteVariant(id as string);
  return ok(null, 'Variant deleted');
});
