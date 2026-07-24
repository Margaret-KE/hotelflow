import { Request, Response, NextFunction } from "express";

import {
  getKitchenQueue,
  startPreparing,
  markReady,
  markServed,
} from "./kitchen.service";

export async function getKitchenOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await getKitchenQueue(
      req.user!.tenantId
    );

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function startPreparingOrderItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await startPreparing(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id)
    );

    res.json({
      success: true,
      message: "Kitchen item is now being prepared.",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function markOrderItemReady(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await markReady(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id)
    );

    res.json({
      success: true,
      message: "Kitchen item is ready.",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function markOrderItemServed(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await markServed(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id)
    );

    res.json({
      success: true,
      message: "Kitchen item has been served.",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}