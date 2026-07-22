import { Router } from "express";

import authenticate from "../../../middleware/authenticate";
import authorize from "../../../middleware/authorize";
import validate from "../../../middleware/validate";

import * as controller from "./menuItem.controller";

import {
  createMenuItemSchema,
  updateMenuItemSchema,
  menuItemIdSchema,
} from "./menuItem.validation";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("restaurant.read"),
  controller.getAllMenuItems
);

router.get(
  "/:id",
  authenticate,
  authorize("restaurant.read"),
  validate(menuItemIdSchema),
  controller.getMenuItem
);

router.post(
  "/",
  authenticate,
  authorize("restaurant.create"),
  validate(createMenuItemSchema),
  controller.createNewMenuItem
);

router.put(
  "/:id",
  authenticate,
  authorize("restaurant.update"),
  validate(menuItemIdSchema),
  validate(updateMenuItemSchema),
  controller.updateExistingMenuItem
);

router.delete(
  "/:id",
  authenticate,
  authorize("restaurant.update"),
  validate(menuItemIdSchema),
  controller.removeMenuItem
);

export default router;