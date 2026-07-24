import {
  createRestaurantOrderItemSchema,
  updateRestaurantOrderItemSchema,
} from "./orderItem.validation";

import { z } from "zod";

export type CreateRestaurantOrderItemRequest =
  z.infer<
    typeof createRestaurantOrderItemSchema.body
  >;

export type UpdateRestaurantOrderItemRequest =
  z.infer<
    typeof updateRestaurantOrderItemSchema.body
  >;