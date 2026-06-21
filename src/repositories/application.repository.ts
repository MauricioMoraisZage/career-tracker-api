import { prisma } from "../lib/prisma.js";

type CreateApplicationData = {
  jobId: string;
  cvVersion?: string;
  coverLetter?: string;
  notes?: string;
  appliedAt: Date;
};

type UpdateApplicationData = {
  cvVersion?: string;
  coverLetter?: string;
  notes?: string;
  appliedAt?: Date;
};

const jobSummarySelect = {
  id: true,
  company: true,
  position: true,
  status: true,
  appliedAt: true,
};

export class ApplicationRepository {
  createAndMarkJobApplied(data: CreateApplicationData) {
    return prisma.$transaction(async (transaction) => {
      await transaction.job.update({
        where: {
          id: data.jobId,
        },
        data: {
          status: "APPLIED",
          appliedAt: data.appliedAt,
        },
      });

      return transaction.application.create({
        data,
        include: {
          job: {
            select: jobSummarySelect,
          },
        },
      });
    });
  }

  findByJobIdAndUserId(jobId: string, userId: string) {
    return prisma.application.findFirst({
      where: {
        jobId,
        job: {
          userId,
        },
      },
    });
  }

  findManyByUserId(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    return prisma.application.findMany({
      where: {
        job: {
          userId,
        },
      },
      include: {
        job: {
          select: jobSummarySelect,
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
      skip,
      take: limit,
    });
  }

  countByUserId(userId: string) {
    return prisma.application.count({
      where: {
        job: {
          userId,
        },
      },
    });
  }

  findByIdAndUserId(id: string, userId: string) {
    return prisma.application.findFirst({
      where: {
        id,
        job: {
          userId,
        },
      },
      include: {
        job: {
          select: jobSummarySelect,
        },
      },
    });
  }

  updateAndSyncJob(id: string, data: UpdateApplicationData) {
    return prisma.$transaction(async (transaction) => {
      const application = await transaction.application.update({
        where: {
          id,
        },
        data,
      });

      if (data.appliedAt) {
        await transaction.job.update({
          where: {
            id: application.jobId,
          },
          data: {
            appliedAt: data.appliedAt,
          },
        });
      }

      return transaction.application.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          job: {
            select: jobSummarySelect,
          },
        },
      });
    });
  }

  deleteAndResetJob(id: string) {
    return prisma.$transaction(async (transaction) => {
      const application = await transaction.application.delete({
        where: {
          id,
        },
      });

      await transaction.job.update({
        where: {
          id: application.jobId,
        },
        data: {
          status: "SAVED",
          appliedAt: null,
        },
      });

      return application;
    });
  }
}
