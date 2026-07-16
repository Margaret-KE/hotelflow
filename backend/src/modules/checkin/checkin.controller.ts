import { Request, Response, NextFunction } from "express";

import * as checkInService from "./checkin.service";

export async function checkIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reservation =
      await checkInService.checkIn(
        req.user!.tenantId,
        req.body.reservationId
      );

    return res.status(200).json({
      success: true,
      message: "Guest checked in successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
}