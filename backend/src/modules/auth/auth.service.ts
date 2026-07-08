import prisma from "../../lib/prisma";
import { comparePassword } from "../../utils/password";
import ApiError from "../../utils/ApiError";

import { LoginDto } from "./auth.types";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./jwt";

export async function login(data: LoginDto) {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      isActive: true,
    },
    include: {
      tenant: true,
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const validPassword = await comparePassword(
    data.password,
    user.password
  );

  if (!validPassword) {
    throw new ApiError(401, "Invalid email or password");
  }

  const payload = {
    userId: user.id,
    tenantId: user.tenantId,
    roleId: user.roleId,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Save refresh token
  const refreshTokenDays =
  Number(process.env.REFRESH_TOKEN_DAYS) || 7;
  
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      ),
    },
  });

  // Update last login
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "LOGIN",
      entity: "AUTH",
      description: "User logged into Staff Portal",
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      tenant: user.tenant.name,
      permissions: user.role.permissions.map(
        (item) => item.permission.code
      ),
    },
  };
}