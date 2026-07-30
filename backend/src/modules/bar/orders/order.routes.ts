import { Router } from "express";

import * as orderController from "./order.controller";

import authenticate from "../../../middleware/authenticate";
import authorize from "../../../middleware/authorize";
import validate from "../../../middleware/validate";

import {
  createBarOrderSchema,
  updateBarOrderSchema,
  barOrderIdSchema,
} from "./order.validation";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("bar.read"),
  orderController.getAllOrders
);

router.get(
  "/:id",
  authorize("bar.read"),
  validate({
    params: barOrderIdSchema,
  }),
  orderController.getOrder
);

router.post(
  "/",
  authorize("bar.create"),
  validate({
    body: createBarOrderSchema,
  }),
  orderController.createNewOrder
);

router.patch(
  "/:id/notes",
  authorize("bar.update"),
  validate({
    params: barOrderIdSchema,
    body: updateBarOrderSchema,
  }),
  orderController.updateNotes
);

router.patch(
  "/:id/cancel",
  authorize("bar.update"),
  validate({
    params: barOrderIdSchema,
  }),
  orderController.cancel
);

export default router;