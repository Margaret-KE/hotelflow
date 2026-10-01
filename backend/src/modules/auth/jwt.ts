import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: string;
  tenantId: string;
  roleId: string;
  email: string;
}

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is missing");
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is missing");
}

console.log("JWT configuration:", {
  accessSecretLength: ACCESS_SECRET.length,
  refreshSecretLength: REFRESH_SECRET.length,
});

export function generateAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}