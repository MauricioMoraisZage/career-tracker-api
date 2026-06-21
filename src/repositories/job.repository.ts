import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

type JobStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "REJECTED"
  | "OFFER";

type CreateJobData = {
  company: string;
  position: string;
  location?: string;
  remote?: boolean;
  jobUrl?: string;
  description?: string;
  salaryRange?: string;
  status?: JobStatus;
  appliedAt?: Date;
  userId: string;
};

type UpdateJobData = Partial<Omit<CreateJobData, "userId">>;

type ListJobsFilters = {
  userId: string;
  status?: JobStatus;
  remote?: boolean;
  q?: string;
  page: number;
  limit: number;
};

function buildWhere(filters: ListJobsFilters): Prisma.JobWhereInput {
  return {
    userId: filters.userId,
    status: filters.status,
    remote: filters.remote,

    OR: filters.q
      ? [
          {
            company: {
              contains: filters.q,
              mode: "insensitive",
            },
          },
          {
            position: {
              contains: filters.q,
              mode: "insensitive",
            },
          },
          {
            location: {
              contains: filters.q,
              mode: "insensitive",
            },
          },
        ]
      : undefined,
  };
}

export class JobRepository {
  create(data: CreateJobData) {
    return prisma.job.create({
      data,
    });
  }

  findManyByUserId(filters: ListJobsFilters) {
    const skip = (filters.page - 1) * filters.limit;

    return prisma.job.findMany({
      where: buildWhere(filters),

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: filters.limit,
    });
  }

  countByUserId(filters: ListJobsFilters) {
    return prisma.job.count({
      where: buildWhere(filters),
    });
  }

  findByIdAndUserId(id: string, userId: string) {
    return prisma.job.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  update(id: string, data: UpdateJobData) {
    return prisma.job.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: string) {
    return prisma.job.delete({
      where: {
        id,
      },
    });
  }
}
