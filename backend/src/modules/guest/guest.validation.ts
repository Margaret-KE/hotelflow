import { z } from "zod";

const phoneRegex = /^\+?[0-9]{10,15}$/;

export const createGuestSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),

    email: z
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),

    phone: z
      .string()
      .regex(phoneRegex, "Invalid phone number"),

    idType: z
      .enum([
        "NATIONAL_ID",
        "PASSPORT",
        "DRIVERS_LICENSE",
      ])
      .optional(),

    idNumber: z.string().optional(),

    nationality: z.string().optional(),

    gender: z
      .enum([
        "MALE",
        "FEMALE",
        "OTHER",
      ])
      .optional(),

    dateOfBirth: z.string().optional(),

    address: z.string().optional(),

    city: z.string().optional(),

    country: z.string().optional(),

    emergencyName: z.string().optional(),

    emergencyPhone: z.string().optional(),

    company: z.string().optional(),

    notes: z.string().optional(),

    vip: z.boolean().optional(),

    blacklisted: z.boolean().optional(),
  }),
});

export const updateGuestSchema = z.object({
  body: createGuestSchema.shape.body.partial(),
});

export const guestIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid guest ID"),
  }),
});