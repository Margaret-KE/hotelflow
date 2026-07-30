import { z } from "zod";

export const createCategorySchema = {
  body: z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().optional(),
  }),
};

export const updateCategorySchema = {
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().optional(),
  }),
};

export const categoryIdSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};