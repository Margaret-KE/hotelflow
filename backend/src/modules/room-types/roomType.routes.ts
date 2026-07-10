import { Router } from "express";

import authenticate from "../../middleware/authenticate";
import validate from "../../middleware/validate";

import {
  getAllRoomTypes,
  getRoomType,
  createNewRoomType,
  updateExistingRoomType,
  removeRoomType,
} from "./roomType.controller";

import {
  createRoomTypeSchema,
  updateRoomTypeSchema,
  roomTypeIdSchema,
} from "./roomType.validation";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  getAllRoomTypes
);

router.get(
  "/:id",
  validate(roomTypeIdSchema),
  getRoomType
);

router.post(
  "/",
  validate(createRoomTypeSchema),
  createNewRoomType
);

router.put(
  "/:id",
  validate(updateRoomTypeSchema),
  updateExistingRoomType
);

router.delete(
  "/:id",
  validate(roomTypeIdSchema),
  removeRoomType
);

export default router;