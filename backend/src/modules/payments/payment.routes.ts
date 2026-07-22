import { Router } from "express";

import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";
import validate from "../../middleware/validate";

import {
  receivePayment,
  getPaymentSummary,
} from "./payment.controller";

import {
  createPaymentSchema,
  paymentIdSchema,
} from "./payment.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("payments.create"),
  validate(createPaymentSchema),
  receivePayment
);

router.get(
  "/summary/:id",
  authorize("payments.read"),
  validate(paymentIdSchema),
  getPaymentSummary
);

export default router;