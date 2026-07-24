import { z } from "zod";

export const kitchenItemIdSchema = {
  params: z.object({
    id: z.uuid("Invalid kitchen item ID"),
  }),
};