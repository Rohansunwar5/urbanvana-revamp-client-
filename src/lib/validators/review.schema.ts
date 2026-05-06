import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(1, 'Title is required').max(120, 'Title must be 120 characters or fewer'),
  body: z.string().max(2000, 'Review body must be 2000 characters or fewer').optional(),
});
