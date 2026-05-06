import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { getAuthUser, getCartSession } from '@/lib/utils/auth-helpers';
import recentlyViewedService from '@/lib/services/recently-viewed.service';

export const GET = apiHandler(async (request) => {
  const user = await getAuthUser(request);
  const sessionId = getCartSession(request, user);
  const result = await recentlyViewedService.getRecentlyViewed({ userId: user?._id, sessionId });
  return ok(result, 'Recently viewed fetched');
});
