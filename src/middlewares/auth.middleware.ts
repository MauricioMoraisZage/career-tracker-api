import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
  };
};

export function authMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Missing authorization token", 401));
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new AppError("Invalid authorization format", 401));
  }

  const decoded = verifyAccessToken(token);

  const authenticatedRequest = request as AuthenticatedRequest;

  authenticatedRequest.user = {
    id: decoded.sub,
    email: decoded.email,
  };

  return next();
}
