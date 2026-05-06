import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { addAddressSchema } from '@/lib/validators/address.schema';
import addressService from '@/lib/services/address.service';

export const GET = apiHandler(async (request) => {
  const user = await requireAuth(request);
  const result = await addressService.listAddresses(user._id);
  return ok(result, 'Addresses fetched');
});

export const POST = apiHandler(async (request) => {
  const user = await requireAuth(request);
  const body = addAddressSchema.parse(await request.json());
  const result = await addressService.addAddress(user._id, body);
  return ok(result, 'Address added', 201);
});
