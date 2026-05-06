import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { authLimit } from '@/lib/utils/rate-limit';
import { adminLoginSchema } from '@/lib/validators/admin.auth.schema';
import adminAuthService from '@/lib/services/admin.auth.service';

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await authLimit(ip);
  const body = adminLoginSchema.parse(await request.json());
  const result = await adminAuthService.login(body);
  return ok(result, 'Admin login successful');
});
