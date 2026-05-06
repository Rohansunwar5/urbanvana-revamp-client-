import { z } from 'zod';

const indianPhone = z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number');
const pincode = z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode');

export const addAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: indianPhone,
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode,
  country: z.string().optional(),
});

export const updateAddressSchema = z.object({
  fullName: z.string().min(1).optional(),
  phone: indianPhone.optional(),
  line1: z.string().min(1).optional(),
  line2: z.string().optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  pincode: pincode.optional(),
  country: z.string().optional(),
});

export const wishlistProductSchema = z.object({
  productId: z.string().min(1, 'Valid productId is required'),
});
