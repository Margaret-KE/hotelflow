import { z } from "zod";
import {
  BookingSource,
  ReservationStatus,
} from "@prisma/client";

const uuid = z.string().uuid("Invalid ID");

export const createReservationSchema = {
  body: z
    .object({
      guestId: uuid,

      roomId: uuid,

      checkInDate: z.coerce.date(),

      checkOutDate: z.coerce.date(),

      adults: z
        .number()
        .int()
        .positive()
        .default(1),

      children: z
        .number()
        .int()
        .min(0)
        .default(0),

      source: z
        .nativeEnum(BookingSource)
        .default(BookingSource.WALK_IN),

      notes: z
        .string()
        .max(500)
        .optional(),
    })
    .refine(
      (data) =>
        data.checkOutDate > data.checkInDate,
      {
        message:
          "Check-out date must be after check-in date",
        path: ["checkOutDate"],
      }
    ),
};

export const updateReservationSchema = {
  params: z.object({
    id: uuid,
  }),

  body: z.object({
    guestId: uuid.optional(),

    roomId: uuid.optional(),

    checkInDate: z.coerce.date().optional(),

    checkOutDate: z.coerce.date().optional(),

    adults: z
      .number()
      .int()
      .positive()
      .optional(),

    children: z
      .number()
      .int()
      .min(0)
      .optional(),

    status: z
      .nativeEnum(ReservationStatus)
      .optional(),

    source: z
      .nativeEnum(BookingSource)
      .optional(),

    notes: z
      .string()
      .max(500)
      .optional(),
  }),
};

export const reservationIdSchema = {
  params: z.object({
    id: uuid,
  }),
};