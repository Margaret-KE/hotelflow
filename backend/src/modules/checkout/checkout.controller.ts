import { Request, Response, NextFunction } from "express";

import * as checkOutService from "./checkout.service";

export async function checkOut(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reservation =
      await checkOutService.checkOut(
        req.user!.tenantId,
        req.body.reservationId
      );

    return res.status(200).json({
      success: true,
      message: "Guest checked out successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
}