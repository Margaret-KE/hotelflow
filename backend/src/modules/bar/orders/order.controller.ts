import { NextFunction, Request, Response } from "express";

import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderNotes,
  cancelOrder,
} from "./order.service";

export async function getAllOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await getOrders(
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

export async function getOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const order = await getOrderById(
      req.user!.tenantId,
      String(req.params.id)
    );

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const order = await createOrder(
      req.user!.tenantId,
      req.user!.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Bar order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateNotes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const order = await updateOrderNotes(
      req.user!.tenantId,
      String(req.params.id),
      req.body.notes
    );

    res.json({
      success: true,
      message: "Bar order updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const order = await cancelOrder(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id)
    );

    res.json({
      success: true,
      message: "Bar order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}