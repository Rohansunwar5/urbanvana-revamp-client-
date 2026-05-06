import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAdminAuth } from '@/lib/utils/auth-helpers';
import reviewService from '@/lib/services/review.service';

export const GET = apiHandler(async (request) => {
  await requireAdminAuth(request);
  const { searchParams } = new URL(request.url);
  const result = await reviewService.adminListReviews(
    Number(searchParams.get('page')) || 1,
    Number(searchParams.get('limit')) || 20,
  );
  return ok(result, 'Reviews fetched');
});
