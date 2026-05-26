import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { CourseService } from "../services/course.service.js";

const courseService = new CourseService();

function getAuthenticatedUserId(request: Request) {
  const authenticatedRequest = request as AuthenticatedRequest;
  const userId = authenticatedRequest.user?.id;

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  return userId;
}

function getRequiredParam(value: unknown, paramName: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new AppError(`Missing or invalid parameter: ${paramName}`, 400);
  }

  return value;
}

export class CourseController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(request);
      const course = await courseService.create(userId, request.body);

      return response.status(201).json({
        status: "success",
        message: "Course created successfully",
        course,
      });
    } catch (error) {
      return next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(request);
      const result = await courseService.list(userId, response.locals.query ?? {});

      return response.status(200).json({
        status: "success",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async findOne(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(request);
      const courseId = getRequiredParam(request.params.id, "id");

      const course = await courseService.findOne(userId, courseId);

      return response.status(200).json({
        status: "success",
        course,
      });
    } catch (error) {
      return next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(request);
      const courseId = getRequiredParam(request.params.id, "id");

      const course = await courseService.update(
        userId,
        courseId,
        request.body,
      );

      return response.status(200).json({
        status: "success",
        message: "Course updated successfully",
        course,
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(request);
      const courseId = getRequiredParam(request.params.id, "id");

      const result = await courseService.delete(userId, courseId);

      return response.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      return next(error);
    }
  }
}
