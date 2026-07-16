import { Router } from "express";

import validate from "../../middleware/validate";

import authenticate from "../../middleware/authenticate";

import {
  createRoomSchema,
  updateRoomSchema,
  roomIdSchema,
} from "./room.validation";

import {
  getAllRooms,
  getRoom,
  createNewRoom,
  updateExistingRoom,
  removeRoom,
} from "./room.controller";

const router = Router();

// Protect every route below
router.use(authenticate);

router.get("/", getAllRooms);

router.get(
  "/:id",
  validate(roomIdSchema),
  getRoom
);

router.post(
  "/",
  validate(createRoomSchema),
  createNewRoom
);

router.put(
  "/:id",
  validate(updateRoomSchema),
  updateExistingRoom
);

router.delete(
  "/:id",
  validate(roomIdSchema),
  removeRoom
);

export default router;