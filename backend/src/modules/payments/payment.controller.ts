import { Request, Response, NextFunction } from "express";

import {
  createPayment,
  getReservationPaymentSummary,
} from "./payment.service";

export async function receivePayment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await createPayment(
      req.user!.tenantId,
      req.user!.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Payment received successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentSummary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const summary =
      await getReservationPaymentSummary(
        String(req.params.id)
      );

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}