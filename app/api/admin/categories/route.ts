import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import { createCategorySchema } from '@/lib/validators/catalog.schema';
import categoryService from '@/lib/services/catalog/category.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const result = await categoryService.listCategoriesAdmin();
  return ok(result, 'Categories fetched');
});

export const POST = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const body = createCategorySchema.parse(await request.json());
  const result = await categoryService.createCategory(body);
  return ok(result, 'Category created', 201);
});
