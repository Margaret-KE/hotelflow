import { z } from "zod";

export const checkOutSchema = z.object({
  body: z.object({
    reservationId: z.uuid({
      message: "Reservation ID is required",
    }),
  }),
});