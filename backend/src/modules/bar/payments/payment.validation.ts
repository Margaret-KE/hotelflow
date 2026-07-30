import { z } from "zod";

export const createPaymentSchema = {
  body: z.object({
    orderId: z.string().uuid("Invalid order ID"),

    amount: z
      .number()
      .positive(
        "Payment amount must be greater than zero"
      ),

    method: z.enum([
      "CASH",
      "MPESA",
      "CARD",
      "BANK_TRANSFER",
    ]),

    reference: z.string().optional(),

    transactionId: z.string().optional(),

    receiptNumber: z.string().optional(),

    notes: z.string().optional(),
  }),
};

export const paymentIdSchema = {
  params: z.object({
    id: z.string().uuid("Invalid payment ID"),
  }),
};

export const orderIdSchema = {
  params: z.object({
    id: z.string().uuid("Invalid order ID"),
  }),
};