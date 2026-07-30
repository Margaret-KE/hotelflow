import { z } from "zod";

export const checkInSchema = {
  body: z.object({
    reservationId: z.uuid({
      message: "Reservation ID is required",
    }),
  }),
};