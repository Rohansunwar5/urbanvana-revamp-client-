import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import reviewService from '@/lib/services/review.service';

export const DELETE = apiHandler(async (request, context) => {
  await requireAdminAuth(request);
  const { id } = await context.params;
  await reviewService.adminDeleteReview(id as string);
  return ok(null, 'Review deleted');
});
