import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}