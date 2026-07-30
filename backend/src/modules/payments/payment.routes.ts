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
  validate({
    body: createPaymentSchema.body,
  }),
  receivePayment
);

router.get(
  "/summary/:id",
  authorize("payments.read"),
  validate({
    params: paymentIdSchema.params,
  }),
  getPaymentSummary
);

export default router;