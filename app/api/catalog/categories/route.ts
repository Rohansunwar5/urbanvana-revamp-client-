import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import categoryService from '@/lib/services/catalog/category.service';

export const GET = apiHandler(async () => {
  const result = await categoryService.listCategories();
  return ok(result, 'Categories fetched');
});
