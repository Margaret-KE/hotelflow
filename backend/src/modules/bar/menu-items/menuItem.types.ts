import { z } from "zod";

import {
  createMenuItemSchema,
  updateMenuItemSchema,
  menuItemIdSchema,
} from "./menuItem.validation";

export type CreateMenuItemRequest = z.infer<
  typeof createMenuItemSchema
>;

export type UpdateMenuItemRequest = Partial<
  z.infer<typeof updateMenuItemSchema>
>;

export type MenuItemParams = z.infer<
  typeof menuItemIdSchema
>;