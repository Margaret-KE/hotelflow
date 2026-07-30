import { z } from "zod";

export const loginSchema = {
  body: z.object({
    email: z.email({
      message: "A valid email address is required",
    }),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  }),
};