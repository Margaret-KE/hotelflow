import { z } from "zod";

export const checkInSchema = z.object({
  body: z.object({
    reservationId: z.uuid({
      message: "Reservation ID is required",
    }),
  }),
});