import { z } from 'zod';

export const addItemSchema = z.object({
  variantId: z.string().min(1, 'variantId is required'),
  qty: z.number().int().min(1, 'qty must be at least 1').max(10, 'Maximum 10 units per item'),
});

export const updateItemQtySchema = z.object({
  qty: z.number().int().min(1, 'qty must be between 1 and 10').max(10, 'qty must be between 1 and 10'),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'code is required'),
});
