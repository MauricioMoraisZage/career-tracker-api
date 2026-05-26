import { z } from "zod";

export const courseStatusSchema = z.enum([
  "not_started", "in_progress", "completed", "paused",
]);

export const createCourseSchema = z.object({
  title: z.string().trim().min(2, "Title must have at least 2 characters"),
  platform: z.string().trim().optional(),
  description: z.string().trim().optional(),
  status: courseStatusSchema.optional(),
  progress: z.number().int().min(0).max(100).optional(),
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const listCoursesQuerySchema = z.object({
  status: courseStatusSchema.optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type ListCoursesQuery = z.infer<typeof listCoursesQuerySchema>;
