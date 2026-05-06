import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import addressService from '@/lib/services/address.service';

export const PATCH = apiHandler(async (request, context) => {
  const user = await requireAuth(request);
  const { id } = await context.params;
  const result = await addressService.setDefault(user._id, id as string);
  return ok(result, 'Default address set');
});
