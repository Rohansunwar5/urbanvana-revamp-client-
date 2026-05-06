import { apiHandler } from '@/lib/utils/api-handler';
import { ok } from '@/lib/utils/response';
import { generalLimit } from '@/lib/utils/rate-limit';
import { contactLeadSchema } from '@/lib/validators/contact.schema';
import contactService from '@/lib/services/contact.service';

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  await generalLimit(ip);
  const body = contactLeadSchema.parse(await request.json());
  await contactService.lead(body);
  return ok(null, 'Message sent successfully');
});
