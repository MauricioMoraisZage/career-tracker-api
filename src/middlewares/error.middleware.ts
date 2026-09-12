import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import { logger } from "../lib/logger.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  request.log?.error({ err: error }, "Unhandled request error");

  if (!request.log) {
    logger.error({ err: error }, "Unhandled request error");
  }

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
