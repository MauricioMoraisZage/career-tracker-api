import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { ApplicationService } from "../services/application.service.js";
import type { ListApplicationsQuery } from "../validations/application.schema.js";

const applicationService = new ApplicationService();

type JobApplicationParams = {
  jobId: string;
};

type ApplicationIdParams = {
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

export class ApplicationController {
  async create(request: Request<JobApplicationParams>,
    response: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(request);

      const application = await applicationService.create(
        userId,
        request.params.jobId,
        request.body,
      );

      return response.status(201).json({
        status: "success",
        message: "Application created successfully",
        application,
      });
    } catch (error) {
      return next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction ) {
    try {
      const userId = getAuthenticatedUserId(request);

	  const query = response.locals.validatedQuery as ListApplicationsQuery;

      const result = await applicationService.list(userId, query);

      return response.status(200).json({ status: "success", ...result });
    } catch (error) {
      return next(error);
    }
  }

  async findOne(
    request: Request<ApplicationIdParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = getAuthenticatedUserId(request);

      const application = await applicationService.findOne(
        userId,
        request.params.id,
      );

      return response.status(200).json({
        status: "success",
        application,
      });
    } catch (error) {
      return next(error);
    }
  }

  async update(
    request: Request<ApplicationIdParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = getAuthenticatedUserId(request);

      const application = await applicationService.update(
        userId,
        request.params.id,
        request.body,
      );

      return response.status(200).json({
        status: "success",
        message: "Application updated successfully",
        application,
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(
    request: Request<ApplicationIdParams>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = getAuthenticatedUserId(request);

      await applicationService.delete(
        userId,
        request.params.id,
      );

      return response.status(200).json({
        status: "success",
        message: "Application deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
}
