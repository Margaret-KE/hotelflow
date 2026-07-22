import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/ApiError";

export default function authorize(
  permission: string
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;

    if (!user) {
      return next(
        new ApiError(
          401,
          "Authentication required."
        )
      );
    }

    if (
      !user.permissions.includes(permission)
    ) {
      return next(
        new ApiError(
          403,
          "You do not have permission to perform this action."
        )
      );
    }

    next();
  };
}