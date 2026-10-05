// review.schema.ts
import { z } from 'zod';

// Schema for incoming review requests
export const ReviewCreateSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().optional().nullable(),
});

export type ReviewCreateInput = z.infer<typeof ReviewCreateSchema>;

// Full review schema (for database/internal use)
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  driverId: z.string().uuid(),
  clientId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  content: z.string().optional().nullable(),
  createdAt: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;