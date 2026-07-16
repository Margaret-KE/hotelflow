import { Router } from "express";

import authenticate from "../../middleware/authenticate";
import validate from "../../middleware/validate";

import {
  createReservationSchema,
  updateReservationSchema,
  reservationIdSchema,
} from "./reservation.validation";

import {
  getAllReservations,
  getReservation,
  createNewReservation,
  updateExistingReservation,
  cancelExistingReservation,
  removeReservation,
} from "./reservation.controller";

const router = Router();

router.use(authenticate);

router.get("/", getAllReservations);

router.get(
  "/:id",
  validate(reservationIdSchema),
  getReservation
);

router.post(
  "/",
  validate(createReservationSchema),
  createNewReservation
);

router.put(
  "/:id",
  validate(updateReservationSchema),
  updateExistingReservation
);

router.patch(
  "/:id/cancel",
  validate(reservationIdSchema),
  cancelExistingReservation
);

router.delete(
  "/:id",
  validate(reservationIdSchema),
  removeReservation
);

export default router;