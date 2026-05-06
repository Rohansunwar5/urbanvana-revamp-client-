import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { updateAddressSchema } from '@/lib/validators/address.schema';
import addressService from '@/lib/services/address.service';

export const PATCH = apiHandler(async (request, context) => {
  const user = await requireAuth(request);
  const { id } = await context.params;
  const body = updateAddressSchema.parse(await request.json());
  const result = await addressService.updateAddress(user._id, id as string, body);
  return ok(result, 'Address updated');
});

export const DELETE = apiHandler(async (request, context) => {
  const user = await requireAuth(request);
  const { id } = await context.params;
  await addressService.deleteAddress(user._id, id as string);
  return ok(null, 'Address deleted');
});
