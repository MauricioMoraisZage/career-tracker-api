import { Router } from "express";
import { CourseModuleController } from "../controllers/course-module.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { updateCourseModuleSchema } from "../validations/course-module.schema.js";

const courseModuleRoutes = Router();
const courseModuleController = new CourseModuleController();

courseModuleRoutes.use(authMiddleware);

courseModuleRoutes.get("/:id", courseModuleController.findOne);

courseModuleRoutes.patch("/:id", validateBody(updateCourseModuleSchema),
  courseModuleController.update,
);

courseModuleRoutes.delete("/:id", courseModuleController.delete);

export { courseModuleRoutes };
