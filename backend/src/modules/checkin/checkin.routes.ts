import { Router } from "express";

import authenticate from "../../middleware/authenticate";
import validate from "../../middleware/validate";

import { checkInSchema } from "./checkin.validation";

import { checkIn } from "./checkin.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(checkInSchema),
  checkIn
);

export default router;