import { z } from "zod";

import {
  RestaurantOrderStatus,
  RestaurantPaymentStatus,
} from "@prisma/client";

export const createRestaurantOrderSchema = {
  body: z.object({
    guestId: z.string().uuid().optional(),

    reservationId: z
      .string()
      .uuid()
      .optional(),

    notes: z.string().optional(),
  }),
};

export const updateRestaurantOrderSchema = {
  body: z.object({
    status: z
      .nativeEnum(RestaurantOrderStatus)
      .optional(),

    paymentStatus: z
      .nativeEnum(
        RestaurantPaymentStatus
      )
      .optional(),

    notes: z.string().optional(),
  }),
};

export const restaurantOrderIdSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};