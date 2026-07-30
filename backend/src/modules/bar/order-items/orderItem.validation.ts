import { z } from "zod";

export const createBarOrderItemSchema = {
  body: z.object({
    orderId: z.string().uuid(),

    menuItemId: z.string().uuid(),

    quantity: z
      .number()
      .int()
      .positive(),
  }),
};

export const updateBarOrderItemSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),

  body: z.object({
    quantity: z
      .number()
      .int()
      .positive(),
  }),
};

export const barOrderItemIdSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const barOrderIdSchema = {
  params: z.object({
    orderId: z.string().uuid(),
  }),
};