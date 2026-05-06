import { z } from 'zod';

export const createAttributeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  unit: z.string().optional(),
});

export const updateAttributeSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.string().optional(),
});

export const addAttributeValueSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  slug: z.string().optional(),
  meta: z.record(z.string()).optional(),
});

export const updateAttributeValueSchema = z.object({
  label: z.string().min(1).optional(),
  slug: z.string().optional(),
  meta: z.record(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  attributes: z.array(z.object({
    attributeId: z.string().min(1),
    displayOrder: z.number().int(),
  })).optional(),
  displayOrder: z.number().int().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  attributes: z.array(z.object({
    attributeId: z.string().min(1),
    displayOrder: z.number().int(),
  })).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  details: z.string().optional(),
  materials: z.string().optional(),
  shipping: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).optional(),
  badge: z.object({
    label: z.string().min(1, 'badge.label is required'),
    variant: z.enum(['primary', 'accent']),
  }).nullable().optional(),
  isFeatured: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  details: z.string().optional(),
  materials: z.string().optional(),
  shipping: z.string().optional(),
  images: z.array(z.string()).optional(),
  badge: z.object({
    label: z.string().min(1),
    variant: z.enum(['primary', 'accent']),
  }).nullable().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const createVariantSchema = z.object({
  sku: z.string().optional(),
  price: z.number().positive('price must be positive'),
  originalPrice: z.number().positive('originalPrice must be positive'),
  stock: z.number().int().min(0, 'stock must be >= 0'),
  images: z.array(z.string()).optional(),
  attributes: z.array(z.object({
    attributeId: z.string().min(1, 'Invalid attributeId'),
    valueId: z.string().min(1, 'Invalid valueId'),
  })).min(1, 'attributes must have at least one entry'),
});

export const bulkCreateVariantsSchema = z.object({
  attributes: z.array(z.object({
    attributeId: z.string().min(1, 'Invalid attributeId'),
    valueIds: z.array(z.string()).min(1, 'valueIds must be a non-empty array'),
  })).min(1, 'attributes must have at least one entry'),
  defaultPrice: z.number().positive('defaultPrice must be positive'),
  defaultOriginalPrice: z.number().positive('defaultOriginalPrice must be positive'),
  defaultStock: z.number().int().min(0, 'defaultStock must be >= 0'),
});

export const updateVariantSchema = z.object({
  price: z.number().positive().optional(),
  originalPrice: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
  sku: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const adjustStockSchema = z.object({
  delta: z.number({ required_error: 'delta is required' }),
});

export const flashSaleSchema = z.union([
  z.object({
    flashSalePrice: z.number().min(0),
    flashSaleEndsAt: z.string().datetime(),
  }),
  z.null(),
]);
