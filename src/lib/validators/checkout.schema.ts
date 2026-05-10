import { z } from 'zod';

const indianPhone = z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number');
const pincode = z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode');

export const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    phone: indianPhone,
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().default(''),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode,
    country: z.string().default('India'),
  }),
  customerEmail: z.string().email('A valid customer email is required'),
  paymentMethod: z.enum(['online', 'cod']).default('online'),
  guestInfo: z.object({
    name: z.string().min(1, 'Guest name is required'),
    email: z.string().email('A valid guest email is required'),
    phone: indianPhone,
  }).optional(),
});

export const adminUpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  note: z.string().optional(),
  trackingInfo: z.object({
    courier: z.string().nullish().transform(v => v ?? null),
    trackingId: z.string().nullish().transform(v => v ?? null),
    trackingUrl: z.string().nullish().transform(v => v ?? null),
  }).optional(),
});
