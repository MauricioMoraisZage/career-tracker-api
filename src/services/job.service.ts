import { AppError } from "../errors/app-error.js";
import { JobRepository } from "../repositories/job.repository.js";
import type {
  CreateJobInput,
  ListJobsQuery,
  UpdateJobInput,
} from "../validations/job.schema.js";

type JobStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "REJECTED"
  | "OFFER";

const jobRepository = new JobRepository();

function normalizeStatus(status?: string): JobStatus | undefined {
  if (!status) {
    return undefined;
  }

  const statusMap: Record<string, JobStatus> = {
    saved: "SAVED",
    applied: "APPLIED",
    interview: "INTERVIEW",
    rejected: "REJECTED",
    offer: "OFFER",
  };

  return statusMap[status];
}

function parseDate(date?: string): Date | undefined {
  return date ? new Date(date) : undefined;
}

export class JobService {
  async create(userId: string, data: CreateJobInput) {
    return jobRepository.create({
      company: data.company,
      position: data.position,
      location: data.location,
      remote: data.remote,
      jobUrl: data.jobUrl,
      description: data.description,
      salaryRange: data.salaryRange,
      status: normalizeStatus(data.status),
      appliedAt: parseDate(data.appliedAt),
      userId,
    });
  }

  async list(userId: string, query: ListJobsQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filters = {
      userId,
      status: normalizeStatus(query.status),
      remote: query.remote,
      q: query.q,
      page,
      limit,
    };

    const [jobs, total] = await Promise.all([
      jobRepository.findManyByUserId(filters),
      jobRepository.countByUserId(filters),
    ]);

    return {
      data: jobs,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, jobId: string) {
    const job = await jobRepository.findByIdAndUserId(jobId, userId);

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    return job;
  }

  async update(userId: string, jobId: string, data: UpdateJobInput) {
    const job = await jobRepository.findByIdAndUserId(jobId, userId);

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    return jobRepository.update(jobId, {
      company: data.company,
      position: data.position,
      location: data.location,
      remote: data.remote,
      jobUrl: data.jobUrl,
      description: data.description,
      salaryRange: data.salaryRange,
      status: normalizeStatus(data.status),
      appliedAt: parseDate(data.appliedAt),
    });
  }

  async delete(userId: string, jobId: string) {
    const job = await jobRepository.findByIdAndUserId(jobId, userId);

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    await jobRepository.delete(jobId);
  }
}
