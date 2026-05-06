import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { updateAttributeValueSchema } from '@/lib/validators/catalog.schema';
import attributeService from '@/lib/services/catalog/attribute.service';

export const PATCH = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id, valueId } = await context.params;
  const body = updateAttributeValueSchema.parse(await request.json());
  const result = await attributeService.updateValue(id as string, valueId as string, body);
  return ok(result, 'Attribute value updated');
});

export const DELETE = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id, valueId } = await context.params;
  const result = await attributeService.removeValue(id as string, valueId as string);
  return ok(result, 'Attribute value removed');
});
