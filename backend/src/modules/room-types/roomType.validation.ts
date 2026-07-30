import { z } from "zod";

export const createRoomTypeSchema = {
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Room type name is required")
      .max(100),

    description: z
      .string()
      .trim()
      .optional(),

    category: z.enum([
      "ROOM",
      "COTTAGE",
      "TENT",
      "CAMPING_SITE",
      "CONFERENCE_HALL",
    ]),

    capacity: z
      .number()
      .int()
      .positive(),

    basePrice: z
      .number()
      .positive(),

    isActive: z
      .boolean()
      .optional(),
  }),
};

export const updateRoomTypeSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),

  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    description: z
      .string()
      .trim()
      .optional(),

    category: z.enum([
      "ROOM",
      "COTTAGE",
      "TENT",
      "CAMPING_SITE",
      "CONFERENCE_HALL",
    ]).optional(),

    capacity: z
      .number()
      .int()
      .positive()
      .optional(),

    basePrice: z
      .number()
      .positive()
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  }),
};

export const roomTypeIdSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};