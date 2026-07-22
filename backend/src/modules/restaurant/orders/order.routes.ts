import { Router } from "express";

import * as orderController from "./order.controller";

import authenticate from "../../../middleware/authenticate";
import authorize from "../../../middleware/authorize";
import validate from "../../../middleware/validate";

import {
  createRestaurantOrderSchema,
  updateRestaurantOrderSchema,
  restaurantOrderIdSchema,
} from "./order.validation";

const router = Router();

// All restaurant order routes require authentication
router.use(authenticate);

router.get(
  "/",
  authorize("restaurant.read"),
  orderController.getAllOrders
);

router.get(
  "/:id",
  authorize("restaurant.read"),
  validate(restaurantOrderIdSchema),
  orderController.getOrder
);

router.post(
  "/",
  authorize("restaurant.create"),
  validate(createRestaurantOrderSchema),
  orderController.createNewOrder
);

router.patch(
  "/:id/notes",
  authorize("restaurant.update"),
  validate(updateRestaurantOrderSchema),
  orderController.updateNotes
);

router.patch(
  "/:id/cancel",
  authorize("restaurant.update"),
  validate(restaurantOrderIdSchema),
  orderController.cancel
);

export default router;