import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { createReviewSchema } from '@/lib/validators/review.schema';
import reviewService from '@/lib/services/review.service';

export const GET = apiHandler(async (request, context) => {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const result = await reviewService.listReviews(
    slug as string,
    Number(searchParams.get('page')) || 1,
    Number(searchParams.get('limit')) || 10,
  );
  return ok(result, 'Reviews fetched');
});

export const POST = apiHandler(async (request, context) => {
  const user = await requireAuth(request);
  const { slug } = await context.params;
  const body = createReviewSchema.parse(await request.json());
  const result = await reviewService.createReview(user._id, slug as string, body);
  return ok(result, 'Review created', 201);
});
