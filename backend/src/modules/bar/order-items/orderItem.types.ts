import { z } from "zod";

import {
  createBarOrderItemSchema,
  updateBarOrderItemSchema,
} from "./orderItem.validation";

export type CreateBarOrderItemRequest = z.infer<
  typeof createBarOrderItemSchema.body
>;

export type UpdateBarOrderItemRequest = z.infer<
  typeof updateBarOrderItemSchema.body
>;