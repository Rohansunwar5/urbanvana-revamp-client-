import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { createAttributeSchema } from '@/lib/validators/catalog.schema';
import attributeService from '@/lib/services/catalog/attribute.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const result = await attributeService.listAttributes();
  return ok(result, 'Attributes fetched');
});

export const POST = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const body = createAttributeSchema.parse(await request.json());
  const result = await attributeService.createAttribute(body);
  return ok(result, 'Attribute created', 201);
});
