import { z } from "zod";

import {
  createMenuItemSchema,
  updateMenuItemSchema,
  menuItemIdSchema,
} from "./menuItem.validation";

export type CreateMenuItemRequest = z.infer<
  typeof createMenuItemSchema.body
>;

export type UpdateMenuItemRequest = Partial<
  z.infer<typeof updateMenuItemSchema.body>
>;

export type MenuItemParams = z.infer<
  typeof menuItemIdSchema.params
>;