import { Router } from "express";

import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";
import validate from "../../middleware/validate";

import {
  createGuestSchema,
  updateGuestSchema,
  guestIdSchema,
} from "./guest.validation";

import {
  getAllGuests,
  getGuest,
  createNewGuest,
  updateExistingGuest,
  removeGuest,
} from "./guest.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("guests.read"),
  getAllGuests
);

router.get(
  "/:id",
  authorize("guests.read"),
  validate(guestIdSchema),
  getGuest
);

router.post(
  "/",
  authorize("guests.create"),
  validate(createGuestSchema),
  createNewGuest
);

router.put(
  "/:id",
  authorize("guests.update"),
  validate(updateGuestSchema),
  updateExistingGuest
);

router.delete(
  "/:id",
  authorize("guests.delete"),
  validate(guestIdSchema),
  removeGuest
);

export default router;