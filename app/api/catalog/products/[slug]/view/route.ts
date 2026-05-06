import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { getAuthUser, getCartSession } from '@/lib/utils/auth-helpers';
import recentlyViewedService from '@/lib/services/recently-viewed.service';

export const POST = apiHandler(async (request, context) => {
  const { slug } = await context.params;
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  await recentlyViewedService.trackView({ userId: user?._id, sessionId }, slug as string);
  return ok(null, 'View tracked');
});
