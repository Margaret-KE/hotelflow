import { Router } from "express";

import authenticate from "../../../middleware/authenticate";
import authorize from "../../../middleware/authorize";
import validate from "../../../middleware/validate";

import * as orderItemController from "./orderItem.controller";

import {
  createRestaurantOrderItemSchema,
  updateRestaurantOrderItemSchema,
  restaurantOrderItemIdSchema,
  restaurantOrderIdSchema,
} from "./orderItem.validation";

const router = Router();

router.use(authenticate);

router.get(
  "/order/:orderId",
  authorize("restaurant.read"),
  validate(restaurantOrderIdSchema),
  orderItemController.getAllOrderItems
);

router.get(
  "/:id",
  authorize("restaurant.read"),
  validate(restaurantOrderItemIdSchema),
  orderItemController.getOrderItem
);

router.post(
  "/",
  authorize("restaurant.create"),
  validate(createRestaurantOrderItemSchema),
  orderItemController.createNewOrderItem
);

router.put(
  "/:id",
  authorize("restaurant.update"),
  validate(updateRestaurantOrderItemSchema),
  orderItemController.updateQuantity
);

router.patch(
  "/:id/cancel",
  authorize("restaurant.update"),
  validate(restaurantOrderItemIdSchema),
  orderItemController.cancelOrderItem
);

export default router;