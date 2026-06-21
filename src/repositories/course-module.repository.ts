import { prisma } from "../lib/prisma.js";

type CourseModuleStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type CreateCourseModuleData = {
  title: string;
  description?: string;
  status?: CourseModuleStatus;
  order: number;
  courseId: string;
};

type UpdateCourseModuleData = {
  title?: string;
  description?: string;
  status?: CourseModuleStatus;
  order?: number;
};

export class CourseModuleRepository {
	 create(data: CreateCourseModuleData) {
	   return prisma.courseModule.create({ data });
	 }

	 findManyByCourseId(courseId: string) {
	   return prisma.courseModule.findMany({
	     where: { courseId },
	     orderBy: { order: "asc" },
	   });
	 }

	findByIdAndUserId(id: string, userId: string) {
	  return prisma.courseModule.findFirst({
	    where: {
	      id,
	      course: { userId },
	    },
	  });
	}

	update(id: string, data: UpdateCourseModuleData) {
	  return prisma.courseModule.update({
	    where: { id },
	    data,
	  });
	}

	delete(id: string) {
	  return prisma.courseModule.delete({
	    where: { id },
	  });
	} 
}
