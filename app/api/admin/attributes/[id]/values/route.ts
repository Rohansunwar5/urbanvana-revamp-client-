import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { addAttributeValueSchema } from '@/lib/validators/catalog.schema';
import attributeService from '@/lib/services/catalog/attribute.service';

export const POST = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const body = addAttributeValueSchema.parse(await request.json());
  const result = await attributeService.addValue(id as string, { ...body, slug: body.slug ?? '' });
  return ok(result, 'Attribute value added', 201);
});
