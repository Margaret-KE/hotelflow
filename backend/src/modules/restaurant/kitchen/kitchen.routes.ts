import { Router } from "express";

import authenticate from "../../../middleware/authenticate";
import authorize from "../../../middleware/authorize";
import validate from "../../../middleware/validate";

import * as kitchenController from "./kitchen.controller";

import {
  kitchenItemIdSchema,
} from "./kitchen.validation";

const router = Router();

router.use(authenticate);

router.get(
  "/orders",
  authorize("restaurant.kitchen.read"),
  kitchenController.getKitchenOrders
);

router.patch(
  "/items/:id/preparing",
  authorize("restaurant.kitchen.update"),
  validate(kitchenItemIdSchema),
  kitchenController.startPreparingOrderItem
);

router.patch(
  "/items/:id/ready",
  authorize("restaurant.kitchen.update"),
  validate(kitchenItemIdSchema),
  kitchenController.markOrderItemReady
);

router.patch(
  "/items/:id/served",
  authorize("restaurant.kitchen.update"),
  validate(kitchenItemIdSchema),
  kitchenController.markOrderItemServed
);

export default router;