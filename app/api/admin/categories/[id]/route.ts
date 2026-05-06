import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { updateCategorySchema } from '@/lib/validators/catalog.schema';
import categoryService from '@/lib/services/catalog/category.service';

export const PATCH = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  const body = updateCategorySchema.parse(await request.json());
  const result = await categoryService.updateCategory(id as string, body);
  return ok(result, 'Category updated');
});
