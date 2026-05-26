import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const user = await authService.register(request.body);

      return response.status(201).json({
        status: "success",
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await authService.login(request.body);

      return response.status(200).json({
        status: "success",
        message: "User authenticated successfully",
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      return next(error);
    }
  }
}
