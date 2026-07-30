import { z } from "zod";

export const createCategorySchema = {
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100),

    description: z
      .string()
      .trim()
      .max(255)
      .optional(),
  }),
};

export const updateCategorySchema = {
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .max(255)
      .optional(),
  }),
};

export const categoryIdSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};