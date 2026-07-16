import { Router } from "express";

import authenticate from "../../middleware/authenticate";
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

router.get("/", getAllGuests);

router.get(
  "/:id",
  validate(guestIdSchema),
  getGuest
);

router.post(
  "/",
  validate(createGuestSchema),
  createNewGuest
);

router.put(
  "/:id",
  validate(updateGuestSchema),
  updateExistingGuest
);

router.delete(
  "/:id",
  validate(guestIdSchema),
  removeGuest
);

export default router;