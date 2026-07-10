import { Request, Response } from "express";

import asyncHandler from "../../utils/asyncHandler";

import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "./room.service";

export const getAllRooms = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const rooms = await getRooms(tenantId, {
      status:
        typeof req.query.status === "string"
          ? req.query.status
          : undefined,

      roomTypeId:
        typeof req.query.roomTypeId === "string"
          ? req.query.roomTypeId
          : undefined,

      floor:
        typeof req.query.floor === "string"
          ? req.query.floor
          : undefined,
    });

    res.status(200).json({
      success: true,
      data: rooms,
    });
  }
);

export const getRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const room = await getRoomById(
      tenantId,
      req.params.id as string
    );

    res.status(200).json({
      success: true,
      data: room,
    });
  }
);

export const createNewRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const room = await createRoom(
      tenantId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  }
);

export const updateExistingRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const room = await updateRoom(
      tenantId,
      req.params.id as string,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  }
);

export const removeRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    await deleteRoom(
      tenantId,
      req.params.id as string
    );

    res.status(200).json({
      success: true,
      message: "Room deactivated successfully",
    });
  }
);