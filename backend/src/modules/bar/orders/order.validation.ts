import { z } from "zod";

import {
  BarOrderStatus,
  BarPaymentStatus,
} from "@prisma/client";

export const createBarOrderSchema = z.object({
  guestId: z.string().uuid().optional(),

  reservationId: z
    .string()
    .uuid()
    .optional(),

  notes: z.string().optional(),
});

export const updateBarOrderSchema = z.object({
  status: z
    .nativeEnum(BarOrderStatus)
    .optional(),

  paymentStatus: z
    .nativeEnum(
      BarPaymentStatus
    )
    .optional(),

  notes: z.string().optional(),
});

export const barOrderIdSchema = z.object({
  id: z.string().uuid(),
});