import { AppError } from "../errors/app-error.js";
import { ApplicationRepository } from "../repositories/application.repository.js";
import { JobRepository } from "../repositories/job.repository.js";
import type {
  CreateApplicationInput,
  ListApplicationsQuery,
  UpdateApplicationInput,
} from "../validations/application.schema.js";

const applicationRepository = new ApplicationRepository();
const jobRepository = new JobRepository();

function parseDate(date?: string): Date {
  return date ? new Date(date) : new Date();
}

export class ApplicationService {
  async create(
    userId: string,
    jobId: string,
    data: CreateApplicationInput,
  ) {
    const job = await jobRepository.findByIdAndUserId(jobId, userId);

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    const existingApplication =
      await applicationRepository.findByJobIdAndUserId(jobId, userId);

    if (existingApplication) {
      throw new AppError(
        "Application already exists for this job",
        409,
      );
    }

    return applicationRepository.createAndMarkJobApplied({
      jobId,
      cvVersion: data.cvVersion,
      coverLetter: data.coverLetter,
      notes: data.notes,
      appliedAt: parseDate(data.appliedAt),
    });
  }

  async list(userId: string, query: ListApplicationsQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [applications, total] = await Promise.all([
      applicationRepository.findManyByUserId(userId, page, limit),
      applicationRepository.countByUserId(userId),
    ]);

    return {
      data: applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, applicationId: string) {
    const application =
      await applicationRepository.findByIdAndUserId(
        applicationId,
        userId,
      );

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    return application;
  }

  async update(
    userId: string,
    applicationId: string,
    data: UpdateApplicationInput,
  ) {
    const application =
      await applicationRepository.findByIdAndUserId(
        applicationId,
        userId,
      );

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    return applicationRepository.updateAndSyncJob(applicationId, {
      cvVersion: data.cvVersion,
      coverLetter: data.coverLetter,
      notes: data.notes,
      appliedAt: data.appliedAt
        ? new Date(data.appliedAt)
        : undefined,
    });
  }

  async delete(userId: string, applicationId: string) {
    const application =
      await applicationRepository.findByIdAndUserId(
        applicationId,
        userId,
      );

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    await applicationRepository.deleteAndResetJob(applicationId);
  }
}
