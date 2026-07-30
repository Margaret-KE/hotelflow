import { z } from "zod";

export const checkOutSchema = {
  body: z.object({
    reservationId: z.uuid({
      message: "Reservation ID is required",
    }),
  }),
};