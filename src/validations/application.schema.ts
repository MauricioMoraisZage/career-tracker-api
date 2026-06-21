import { z } from "zod";

export const createApplicationSchema = z.object({
  cvVersion: z.string().trim().min(2).optional(),

  coverLetter: z.string().trim().min(10).optional(),

  notes: z.string().trim().min(2).optional(),

  appliedAt: z.string().datetime().optional(),
});

export const updateApplicationSchema = createApplicationSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const listApplicationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreateApplicationInput = z.infer<
  typeof createApplicationSchema
>;

export type UpdateApplicationInput = z.infer<
  typeof updateApplicationSchema
>;

export type ListApplicationsQuery = z.infer<
  typeof listApplicationsQuerySchema
>;
