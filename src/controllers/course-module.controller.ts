import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { CourseModuleService } from "../services/course-module.service.js";

const courseModuleService = new CourseModuleService();

type CourseModuleRouteParams = { courseId: string };
type CourseModuleIdParams = { id: string };

function getAuthenticatedUserId(request: Request) {
  const authenticatedRequest = request as AuthenticatedRequest;
  const userId = authenticatedRequest.user?.id;
  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }
  return userId;
}

export class CourseModuleController {
	 async create(request: Request<CourseModuleRouteParams>,
	   response: Response, next: NextFunction ) {
	   try {
	     const userId = getAuthenticatedUserId(request);
	     const { courseId } = request.params;

	     const module = await courseModuleService.create(
	       userId,
	       courseId,
	       request.body,
	     );
	     return response.status(201).json({
	       status: "success",
	       message: "Course module created successfully",
	       module,
	     });
	   } catch (error) {
	     return next(error);
	   }
	 }

	 async list(request: Request<CourseModuleRouteParams>,
	   response: Response, next: NextFunction ) {
	   try {
	     const userId = getAuthenticatedUserId(request);
	     const { courseId } = request.params;
	     const modules = await courseModuleService.list(userId, courseId);
	     return response.status(200).json({
	       status: "success",
	       data: modules,
	     });
	   } catch (error) {
	     return next(error);
	   }
	 }

	async findOne(request: Request<CourseModuleIdParams>,
	 response: Response, next: NextFunction) {
	 try {
	   const userId = getAuthenticatedUserId(request);
	   const module = await courseModuleService.findOne(
	     userId,
	     request.params.id,
	   );
	   return response.status(200).json({
	     status: "success",
	     module,
	   });
	 } catch (error) {
	   return next(error);
	 }
	}

	async update(request: Request<CourseModuleIdParams>,
	 response: Response, next: NextFunction) {
	 try {
	   const userId = getAuthenticatedUserId(request);

	   const module = await courseModuleService.update(
	     userId,
	     request.params.id,
	     request.body,
	   );

	   return response.status(200).json({
	     status: "success",
	     message: "Course module updated successfully",
	     module,
	   });
	 } catch (error) {
	   return next(error);
	 }
	}

	async delete(request: Request<CourseModuleIdParams>,
	 response: Response, next: NextFunction) {
	 try {
	   const userId = getAuthenticatedUserId(request);
	   await courseModuleService.delete(userId, request.params.id);
	   return response.status(200).json({
	     status: "success",
	     message: "Course module deleted successfully",
	   });
	 } catch (error) {
	   return next(error);
	 }
	}
  
}
