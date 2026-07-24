import { z } from "zod";

export const createRestaurantOrderItemSchema = {
  body: z.object({
    orderId: z.uuid(),

    menuItemId: z.uuid(),

    quantity: z
      .number()
      .int()
      .positive(),
  }),
};

export const updateRestaurantOrderItemSchema = {
  params: z.object({
    id: z.uuid(),
  }),

  body: z.object({
    quantity: z
      .number()
      .int()
      .positive(),
  }),
};

export const restaurantOrderItemIdSchema = {
  params: z.object({
    id: z.uuid(),
  }),
};

export const restaurantOrderIdSchema = {
  params: z.object({
    orderId: z.uuid(),
  }),
};