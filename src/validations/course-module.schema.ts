import { z } from "zod";

export const courseModuleStatusSchema = z.enum(["not_started", "in_progress", "completed"]);

export const createCourseModuleSchema = z.object({
  title: z.string().trim().min(2, "Title must have at least 2 characters"),
  description: z.string().trim().optional(),
  status: courseModuleStatusSchema.optional(),
  order: z.number().int().min(1, "Order must be greater than or equal to 1"),
});

export type CreateCourseModuleInput = z.infer<typeof createCourseModuleSchema>;

export const updateCourseModuleSchema = createCourseModuleSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {message: "At least one field must be provided"});

export type UpdateCourseModuleInput = z.infer<typeof updateCourseModuleSchema>;
