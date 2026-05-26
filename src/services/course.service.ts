import { AppError } from "../errors/app-error.js";
import { CourseRepository } from "../repositories/course.repository.js";
import type {
  CreateCourseInput,
  ListCoursesQuery,
  UpdateCourseInput,
} from "../validations/course.schema.js";

type CourseStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";

const courseRepository = new CourseRepository();

function normalizeStatus(status?: string): CourseStatus | undefined {
  if (!status) {
    return undefined;
  }

  const statusMap: Record<string, CourseStatus> = {
    not_started: "NOT_STARTED",
    in_progress: "IN_PROGRESS",
    completed: "COMPLETED",
    paused: "PAUSED",
  };

  return statusMap[status];
}

function parseDate(date?: string) {
  return date ? new Date(date) : undefined;
}

export class CourseService {
  async create(userId: string, data: CreateCourseInput) {
    return courseRepository.create({
      title: data.title,
      platform: data.platform,
      description: data.description,
      status: normalizeStatus(data.status),
      progress: data.progress,
      startedAt: parseDate(data.startedAt),
      finishedAt: parseDate(data.finishedAt),
      userId,
    });
  }

  async list(userId: string, query: ListCoursesQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const status = normalizeStatus(query.status);

    const [courses, total] = await Promise.all([
      courseRepository.findManyByUserId({
        userId,
        status,
        page,
        limit,
      }),
      courseRepository.countByUserId(userId, status),
    ]);

    return {
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, courseId: string) {
    const course = await courseRepository.findByIdAndUserId(courseId, userId);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    return course;
  }

  async update(userId: string, courseId: string, data: UpdateCourseInput) {
    const course = await courseRepository.findByIdAndUserId(courseId, userId);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    return courseRepository.update(courseId, {
      title: data.title,
      platform: data.platform,
      description: data.description,
      status: normalizeStatus(data.status),
      progress: data.progress,
      startedAt: parseDate(data.startedAt),
      finishedAt: parseDate(data.finishedAt),
    });
  }

  async delete(userId: string, courseId: string) {
    const course = await courseRepository.findByIdAndUserId(courseId, userId);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    await courseRepository.delete(courseId);

    return {
      message: "Course deleted successfully",
    };
  }
}
