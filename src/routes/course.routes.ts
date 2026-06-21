import { Router } from "express";
import { CourseController } from "../controllers/course.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody, validateQuery } from "../middlewares/validate.middleware.js";
import { createCourseSchema, listCoursesQuerySchema, updateCourseSchema } from "../validations/course.schema.js";
import { CourseModuleController } from "../controllers/course-module.controller.js";
import { createCourseModuleSchema } from "../validations/course-module.schema.js";

const courseRoutes = Router();
const courseController = new CourseController();
const courseModuleController = new CourseModuleController();

courseRoutes.use(authMiddleware);

courseRoutes.post("/", validateBody(createCourseSchema), courseController.create);

courseRoutes.get("/", validateQuery(listCoursesQuerySchema), courseController.list);

courseRoutes.post("/:courseId/modules", validateBody(createCourseModuleSchema), courseModuleController.create);

courseRoutes.get("/:courseId/modules", courseModuleController.list);

courseRoutes.get("/:id", courseController.findOne);

courseRoutes.patch("/:id", validateBody(updateCourseSchema), courseController.update);

courseRoutes.delete("/:id", courseController.delete);

export { courseRoutes };
