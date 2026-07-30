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
  authorize("bar.read"),
  controller.getAllMenuItems
);

router.get(
  "/:id",
  authenticate,
  authorize("bar.read"),
  validate({
    params: menuItemIdSchema,
  }),
  controller.getMenuItem
);

router.post(
  "/",
  authenticate,
  authorize("bar.create"),
  validate({
    body: createMenuItemSchema,
  }),
  controller.createNewMenuItem
);

router.put(
  "/:id",
  authenticate,
  authorize("bar.update"),
  validate({
    params: menuItemIdSchema,
    body: updateMenuItemSchema,
  }),
  controller.updateExistingMenuItem
);

router.delete(
  "/:id",
  authenticate,
  authorize("bar.delete"),
  validate({
    params: menuItemIdSchema,
  }),
  controller.removeMenuItem
);

export default router;