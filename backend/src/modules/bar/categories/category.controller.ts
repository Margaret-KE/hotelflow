import { Request, Response, NextFunction } from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.service";

export async function getAllCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await getCategories(
      req.user!.tenantId
    );

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = await getCategoryById(
      req.user!.tenantId,
      String(req.params.id)
    );

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = await createCategory(
      req.user!.tenantId,
      req.user!.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Bar category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExistingCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = await updateCategory(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id),
      req.body
    );

    res.json({
      success: true,
      message: "Bar category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteCategory(
      req.user!.tenantId,
      req.user!.id,
      String(req.params.id)
    );

    res.json({
      success: true,
      message: "Bar category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}