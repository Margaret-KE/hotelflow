import { Request, Response } from "express";

import asyncHandler from "../../../utils/asyncHandler";

import * as paymentService from "./payment.service";

export const getBarBillController =
  asyncHandler(async (req: Request, res: Response) => {
    const bill =
      await paymentService.getBarBill(
        req.user!.tenantId,
        String(req.params.id)
      );

    res.status(200).json({
      success: true,
      data: bill,
    });
  });

export const receiveBarPaymentController =
  asyncHandler(async (req: Request, res: Response) => {
    const payment =
      await paymentService.receiveBarPayment(
        req.user!.tenantId,
        req.user!.id,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Payment received successfully",
      data: payment,
    });
  });