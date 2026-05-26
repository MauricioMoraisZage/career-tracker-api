import { prisma } from "../lib/prisma.js";

type CourseStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";

type CreateCourseData = {
  title: string;
  platform?: string;
  description?: string;
  status?: CourseStatus;
  progress?: number;
  startedAt?: Date;
  finishedAt?: Date;
  userId: string;
};

type UpdateCourseData = Partial<Omit<CreateCourseData, "userId">>;

type ListCoursesFilters = {
  userId: string;
  status?: CourseStatus;
  page: number;
  limit: number;
};

export class CourseRepository {
  create(data: CreateCourseData) {
    return prisma.course.create({
      data,
    });
  }

  findManyByUserId(filters: ListCoursesFilters) {
    const skip = (filters.page - 1) * filters.limit;

    return prisma.course.findMany({
      where: {
        userId: filters.userId,
        status: filters.status,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: filters.limit,
    });
  }

  countByUserId(userId: string, status?: CourseStatus) {
    return prisma.course.count({
      where: {
        userId,
        status,
      },
    });
  }

  findByIdAndUserId(id: string, userId: string) {
    return prisma.course.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  update(id: string, data: UpdateCourseData) {
    return prisma.course.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: string) {
    return prisma.course.delete({
      where: {
        id,
      },
    });
  }
}
