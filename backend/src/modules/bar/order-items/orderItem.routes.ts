import { Router } from "express";

import authenticate from "../../../middleware/authenticate";
import authorize from "../../../middleware/authorize";
import validate from "../../../middleware/validate";

import * as orderItemController from "./orderItem.controller";

import {
  createBarOrderItemSchema,
  updateBarOrderItemSchema,
  barOrderItemIdSchema,
  barOrderIdSchema,
} from "./orderItem.validation";

const router = Router();

router.use(authenticate);

router.get(
  "/order/:orderId",
  authorize("bar.read"),
  validate(barOrderIdSchema),
  orderItemController.getAllOrderItems
);

router.get(
  "/:id",
  authorize("bar.read"),
  validate(barOrderItemIdSchema),
  orderItemController.getOrderItem
);

router.post(
  "/",
  authorize("bar.create"),
  validate(createBarOrderItemSchema),
  orderItemController.createNewOrderItem
);

router.put(
  "/:id",
  authorize("bar.update"),
  validate(updateBarOrderItemSchema),
  orderItemController.updateQuantity
);

router.patch(
  "/:id/cancel",
  authorize("bar.update"),
  validate(barOrderItemIdSchema),
  orderItemController.cancelOrderItem
);

export default router;