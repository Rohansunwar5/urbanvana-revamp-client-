import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { authLimit } from '@/lib/utils/rate-limit';
import { ssoSchema } from '@/lib/validators/auth.schema';
import authService from '@/lib/services/auth.service';

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await authLimit(ip);
  const body = ssoSchema.parse(await request.json());
  const result = await authService.sso(body.code);
  return ok(result, 'SSO login successful');
});
