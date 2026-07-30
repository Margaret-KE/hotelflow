import { Request, Response, NextFunction } from "express";

import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "./menuItem.service";

export async function getAllMenuItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const items = await getMenuItems(
      req.user!.tenantId
    );

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await getMenuItemById(
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

export async function createNewMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await createMenuItem(
      req.user!.tenantId,
      req.user!.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Bar menu item created successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExistingMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const item = await updateMenuItem(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id),
      req.body
    );

    res.json({
      success: true,
      message: "Bar menu item updated successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteMenuItem(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id)
    );

    res.json({
      success: true,
      message: "Bar menu item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}