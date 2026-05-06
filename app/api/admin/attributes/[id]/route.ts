import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { updateAttributeSchema } from '@/lib/validators/catalog.schema';
import attributeService from '@/lib/services/catalog/attribute.service';

export const PATCH = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const body = updateAttributeSchema.parse(await request.json());
  const result = await attributeService.updateAttribute(id as string, body);
  return ok(result, 'Attribute updated');
});
