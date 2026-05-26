import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/app-error.js";

type AccessTokenPayload = {
  sub: string;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  return secret;
}

export function signAccessToken(payload: AccessTokenPayload) {
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "1d") as SignOptions["expiresIn"];

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (typeof decoded === "string") {
      throw new AppError("Invalid token", 401);
    }

    const payload = decoded as JwtPayload;

    if (!payload.sub || typeof payload.email !== "string") {
      throw new AppError("Invalid token payload", 401);
    }

    return {
      sub: String(payload.sub),
      email: payload.email,
    };
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}