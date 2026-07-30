import { Router } from "express";

import authenticate from "../../../middleware/authenticate";
import authorize from "../../../middleware/authorize";
import validate from "../../../middleware/validate";

import * as paymentController from "./payment.controller";

import {
  createPaymentSchema,
  orderIdSchema,
} from "./payment.validation";

const router = Router();

router.use(authenticate);

router.get(
  "/orders/:id/bill",
  authorize("bar.read"),
  validate(orderIdSchema),
  paymentController.getBarBillController
);

router.post(
  "/",
  authorize("payments.create"),
  validate(createPaymentSchema),
  paymentController.receiveBarPaymentController
);

export default router;