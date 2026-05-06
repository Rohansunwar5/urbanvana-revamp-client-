import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { bulkCreateVariantsSchema } from '@/lib/validators/catalog.schema';
import productVariantService from '@/lib/services/catalog/productVariant.service';

export const POST = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const body = bulkCreateVariantsSchema.parse(await request.json());
  const result = await productVariantService.bulkCreateVariants(id as string, body);
  return ok(result, 'Variants bulk created', 201);
});
