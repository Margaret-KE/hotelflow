import { z } from "zod";

export const createMenuItemSchema = z.object({
  categoryId: z.string().uuid(),

  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  description: z
    .string()
    .optional(),

  price: z
    .number()
    .positive(),

  imageUrl: z
    .string()
    .url()
    .optional(),

  available: z
    .boolean()
    .optional(),
});

export const updateMenuItemSchema = z.object({
  categoryId: z
    .string()
    .uuid()
    .optional(),

  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  description: z
    .string()
    .optional(),

  price: z
    .number()
    .positive()
    .optional(),

  imageUrl: z
    .string()
    .url()
    .optional(),

  available: z
    .boolean()
    .optional(),
});

export const menuItemIdSchema = z.object({
  id: z.string().uuid(),
});