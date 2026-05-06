import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(1, 'code is required'),
  type: z.enum(['flat', 'percent']),
  value: z.number().min(0, 'value must be a positive number'),
  startsAt: z.string().datetime({ message: 'startsAt must be a valid ISO date' }),
  expiresAt: z.string().datetime({ message: 'expiresAt must be a valid ISO date' }).nullable().optional(),
  minOrderValue: z.number().min(0).optional().default(0),
  maxDiscountAmount: z.number().min(0).optional().default(0),
  usageLimit: z.number().int().min(0).optional().default(0),
  perUserLimit: z.number().int().min(0).optional().default(0),
  applicableCategories: z.array(z.string()).optional().default([]),
  applicableProducts: z.array(z.string()).optional().default([]),
});

export const updateCouponSchema = z.object({
  code: z.string().min(1).optional(),
  type: z.enum(['flat', 'percent']).optional(),
  value: z.number().min(0).optional(),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  minOrderValue: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(0).optional(),
  perUserLimit: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  applicableCategories: z.array(z.string()).optional(),
  applicableProducts: z.array(z.string()).optional(),
});
