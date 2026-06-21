import { z } from "zod";

export const jobStatusSchema = z.enum([
  "saved",
  "applied",
  "interview",
  "rejected",
  "offer",
]);

export const createJobSchema = z.object({
  company: z
    .string()
    .trim()
    .min(2, "Company must have at least 2 characters"),

  position: z
    .string()
    .trim()
    .min(2, "Position must have at least 2 characters"),

  location: z.string().trim().min(2).optional(),

  remote: z.boolean().optional(),

  jobUrl: z.string().trim().url("Invalid job URL").optional(),

  description: z.string().trim().min(5).optional(),

  salaryRange: z.string().trim().min(2).optional(),

  status: jobStatusSchema.optional(),

  appliedAt: z.string().datetime().optional(),
});

export const updateJobSchema = createJobSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

const remoteQuerySchema = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

export const listJobsQuerySchema = z.object({
  status: jobStatusSchema.optional(),
  remote: remoteQuerySchema.optional(),

  q: z.string().trim().min(1).optional(),

  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
