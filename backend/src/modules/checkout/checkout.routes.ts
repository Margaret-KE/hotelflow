import { Router } from "express";

import authenticate from "../../middleware/authenticate";
import validate from "../../middleware/validate";

import { checkOutSchema } from "./checkout.validation";
import { checkOut } from "./checkout.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(checkOutSchema),
  checkOut
);

export default router;