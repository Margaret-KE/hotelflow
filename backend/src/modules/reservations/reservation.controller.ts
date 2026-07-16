import { Request, Response, NextFunction } from "express";

import * as reservationService from "./reservation.service";

export async function getAllReservations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reservations =
      await reservationService.getReservations(
        req.user!.tenantId
      );

    return res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReservation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reservation =
      await reservationService.getReservationById(
        req.user!.tenantId,
        String(req.params.id)
      );

    return res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewReservation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reservation =
      await reservationService.createReservation(
        req.user!.tenantId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExistingReservation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reservation =
      await reservationService.updateReservation(
        req.user!.tenantId,
        String(req.params.id),
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelExistingReservation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reservation =
      await reservationService.cancelReservation(
        req.user!.tenantId,
        String(req.params.id)
      );

    return res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeReservation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await reservationService.deleteReservation(
      req.user!.tenantId,
      String(req.params.id)
    );

    return res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}