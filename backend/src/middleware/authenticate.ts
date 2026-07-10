import { Request, Response, NextFunction } from "express";

import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";

import { verifyAccessToken } from "../modules/auth/jwt";

export default async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId,
        tenantId: payload.tenantId,
        isActive: true,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return next(new ApiError(401, "Invalid token"));
    }

    req.user = {
      id: user.id,
      tenantId: user.tenantId,
      roleId: user.roleId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}