import { z } from "zod";

import {
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";

export const createPaymentSchema = {
  body: z.object({
    reservationId: z.string().uuid(),

    amount: z.number().positive(),

    method: z.nativeEnum(PaymentMethod),

    transactionReference: z.string().optional(),

    notes: z.string().optional(),
  }),
};

export const updatePaymentSchema = {
  body: z.object({
    status: z.nativeEnum(PaymentStatus).optional(),

    transactionReference: z.string().optional(),

    notes: z.string().optional(),
  }),
};

export const paymentIdSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};