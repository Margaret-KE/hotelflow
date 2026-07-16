import { Request, Response } from "express";

import asyncHandler from "../../utils/asyncHandler";

import {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
} from "./guest.service";

export const getAllGuests = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const guests = await getGuests(tenantId);

    res.status(200).json({
      success: true,
      data: guests,
    });
  }
);

export const getGuest = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const guestId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const guest = await getGuestById(
      tenantId,
      guestId
    );

    res.status(200).json({
      success: true,
      data: guest,
    });
  }
);

export const createNewGuest = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const guest = await createGuest(
      tenantId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Guest created successfully",
      data: guest,
    });
  }
);

export const updateExistingGuest = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

     const guestId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const guest = await updateGuest(
      tenantId,
        guestId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Guest updated successfully",
      data: guest,
    });
  }
);

export const removeGuest = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user!.tenantId;

    const guestId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
      
    await deleteGuest(
      tenantId,
      guestId
    );

    res.status(200).json({
      success: true,
      message: "Guest deactivated successfully",
    });
  }
);