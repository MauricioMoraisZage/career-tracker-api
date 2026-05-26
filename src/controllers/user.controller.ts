import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { UserRepository } from "../repositories/user.repository.js";

const userRepository = new UserRepository();

export class UserController {
  async me(request: Request, response: Response, next: NextFunction) {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;

      const userId = authenticatedRequest.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return response.status(200).json({
        status: "success",
        user,
      });
    } catch (error) {
      return next(error);
    }
  }
}
