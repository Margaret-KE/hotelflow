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
  validate({
    params: reservationIdSchema.params,
  }),
  getReservation
);

router.post(
  "/",
  validate({
    body: createReservationSchema.body,
  }),
  createNewReservation
);

router.put(
  "/:id",
  validate({
    params: updateReservationSchema.params,
    body: updateReservationSchema.body,
  }),
  updateExistingReservation
);

router.patch(
  "/:id/cancel",
  validate({
    params: reservationIdSchema.params,
  }),
  cancelExistingReservation
);

router.delete(
  "/:id",
  validate({
    params: reservationIdSchema.params,
  }),
  removeReservation
);

export default router;