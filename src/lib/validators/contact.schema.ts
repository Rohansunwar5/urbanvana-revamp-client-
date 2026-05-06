import { z } from 'zod';

export const contactLeadSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('A valid email is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  iss: z.string().min(1, 'iss is required'),
  isdCode: z.string().optional().default(''),
  phoneNumber: z.string().optional().default(''),
});
