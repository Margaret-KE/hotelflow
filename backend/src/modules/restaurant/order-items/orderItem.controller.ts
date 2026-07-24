import { Request, Response, NextFunction } from "express";

import {
  getOrderItems,
  getOrderItemById,
  addOrderItem,
  updateOrderItemQuantity,
  cancelOrderItem as cancelOrderItemService,
} from "./orderItem.service";

export async function getAllOrderItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const items = await getOrderItems(
      req.user!.tenantId,
      String(req.params.orderId)
    );

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await getOrderItemById(
      req.user!.tenantId,
      String(req.params.id)
    );

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewOrderItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const order = await addOrderItem(
      req.user!.tenantId,
      req.user!.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Order item added successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateQuantity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await updateOrderItemQuantity(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id),
      req.body
    );

    res.json({
      success: true,
      message: "Order item updated successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrderItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await cancelOrderItemService(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id)
    );

    res.json({
      success: true,
      message: "Order item cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
}