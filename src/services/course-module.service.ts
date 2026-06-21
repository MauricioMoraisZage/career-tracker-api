import { AppError } from "../errors/app-error.js";
import { CourseModuleRepository } from "../repositories/course-module.repository.js";
import { CourseRepository } from "../repositories/course.repository.js";
import type { 
	CreateCourseModuleInput, UpdateCourseModuleInput,
} from "../validations/course-module.schema.js";

type CourseModuleStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

const courseRepository = new CourseRepository();
const courseModuleRepository = new CourseModuleRepository();

function normalizeStatus(status?: string): CourseModuleStatus | undefined {
  if (!status) {
    return undefined;
  }

  const statusMap: Record<string, CourseModuleStatus> = {
    not_started: "NOT_STARTED",
    in_progress: "IN_PROGRESS",
    completed: "COMPLETED",
  };

  return statusMap[status];
}

export class CourseModuleService {
	 async create( userId: string, courseId: string, data: CreateCourseModuleInput) {
	   const course = await courseRepository.findByIdAndUserId(courseId, userId);
	   if (!course) {
	     throw new AppError("Course not found", 404);
	   }
	   return courseModuleRepository.create({
	     title: data.title,
	     description: data.description,
	     status: normalizeStatus(data.status),
	     order: data.order,
	     courseId,
	   });
	 }

	 async list(userId: string, courseId: string) {
	   const course = await courseRepository.findByIdAndUserId(courseId, userId);
	   if (!course) {
	     throw new AppError("Course not found", 404);
	   }
	   return courseModuleRepository.findManyByCourseId(courseId);
	 }

	async findOne(userId: string, moduleId: string) {
	 const module = await courseModuleRepository.findByIdAndUserId(
	   moduleId,
	   userId,
	 );
	 if (!module) {
	   throw new AppError("Course module not found", 404);
	 }
	 return module;
	}

	async update(userId: string, moduleId: string,
	 data: UpdateCourseModuleInput) {
	 const module = await courseModuleRepository.findByIdAndUserId(
	   moduleId,
	   userId,
	 );
	 if (!module) {
	   throw new AppError("Course module not found", 404);
	 }
	 return courseModuleRepository.update(moduleId, {
	   title: data.title,
	   description: data.description,
	   status: normalizeStatus(data.status),
	   order: data.order,
	 });
	}

	async delete(userId: string, moduleId: string) {
	 const module = await courseModuleRepository.findByIdAndUserId(
	   moduleId,
	   userId,
	 );
	 if (!module) {
	   throw new AppError("Course module not found", 404);
	 }
	 await courseModuleRepository.delete(moduleId);
	}
  
}
