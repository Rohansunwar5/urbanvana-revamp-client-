import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import attributeService from '@/lib/services/catalog/attribute.service';

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') ?? undefined;
  const result = await attributeService.listAttributes(category);
  return ok(result, 'Attributes fetched');
});
