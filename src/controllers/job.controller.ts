import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { JobService } from "../services/job.service.js";
import type { ListJobsQuery } from "../validations/job.schema.js";

const jobService = new JobService();

type JobIdParams = {
  id: string;
};

function getAuthenticatedUserId(request: Request): string {
  const authenticatedRequest = request as AuthenticatedRequest;
  const userId = authenticatedRequest.user?.id;

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  return userId;
}

export class JobController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(request);

      const job = await jobService.create(userId, request.body);

      return response.status(201).json({
        status: "success",
        message: "Job created successfully",
        job,
      });
    } catch (error) {
      return next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(request);

      const query = request.query as unknown as ListJobsQuery;

      const result = await jobService.list(userId, query);

      return response.status(200).json({
        status: "success",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async findOne(
    request: Request<JobIdParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = getAuthenticatedUserId(request);

      const job = await jobService.findOne(userId, request.params.id);

      return response.status(200).json({
        status: "success",
        job,
      });
    } catch (error) {
      return next(error);
    }
  }

  async update(
    request: Request<JobIdParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = getAuthenticatedUserId(request);

      const job = await jobService.update(
        userId,
        request.params.id,
        request.body,
      );

      return response.status(200).json({
        status: "success",
        message: "Job updated successfully",
        job,
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(
    request: Request<JobIdParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = getAuthenticatedUserId(request);

      await jobService.delete(userId, request.params.id);

      return response.status(200).json({
        status: "success",
        message: "Job deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}
