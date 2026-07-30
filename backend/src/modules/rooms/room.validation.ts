import { z } from "zod";

const roomStatus = z.enum([
  "AVAILABLE",
  "OCCUPIED",
  "RESERVED",
  "CLEANING",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
]);

export const createRoomSchema = {
  body: z.object({
    roomNumber: z
      .string()
      .trim()
      .min(1, "Room number is required"),

    roomTypeId: z
      .string()
      .uuid("Invalid room type ID"),

    floor: z
      .string()
      .trim()
      .optional(),

    notes: z
      .string()
      .trim()
      .optional(),
  }),
};

export const updateRoomSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),

  body: z.object({
    roomNumber: z
      .string()
      .trim()
      .min(1)
      .optional(),

    roomTypeId: z
      .string()
      .uuid()
      .optional(),

    floor: z
      .string()
      .trim()
      .optional(),

    status: roomStatus.optional(),

    notes: z
      .string()
      .trim()
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  }),
};

export const roomIdSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};