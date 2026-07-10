import { Request, Response } from "express";

import asyncHandler from "../../utils/asyncHandler";

import {
  getRoomTypes,
  getRoomTypeById,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "./roomType.service";

export const getAllRoomTypes = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const roomTypes = await getRoomTypes(tenantId);

    res.status(200).json({
      success: true,
      data: roomTypes,
    });
  }
);

export const getRoomType = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const roomType = await getRoomTypeById(tenantId, id);

    res.status(200).json({
      success: true,
      data: roomType,
    });
  }
);

export const createNewRoomType = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const roomType = await createRoomType(
      tenantId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Room type created successfully",
      data: roomType,
    });
  }
);

export const updateExistingRoomType = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const roomType = await updateRoomType(
      tenantId,
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Room type updated successfully",
      data: roomType,
    });
  }
);

export const removeRoomType = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await deleteRoomType(tenantId, id);

    res.status(200).json({
      success: true,
      message: "Room type deactivated successfully",
    });
  }
);