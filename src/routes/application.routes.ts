import { Router } from "express";
import { ApplicationController } from "../controllers/application.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateBody,
  validateQuery,
} from "../middlewares/validate.middleware.js";
import {
  listApplicationsQuerySchema,
  updateApplicationSchema,
} from "../validations/application.schema.js";

const applicationRoutes = Router();
const applicationController = new ApplicationController();

applicationRoutes.use(authMiddleware);

applicationRoutes.get(
  "/",
  validateQuery(listApplicationsQuerySchema),
  applicationController.list,
);

applicationRoutes.get("/:id", applicationController.findOne);

applicationRoutes.patch(
  "/:id",
  validateBody(updateApplicationSchema),
  applicationController.update,
);

applicationRoutes.delete(
  "/:id",
  applicationController.delete,
);

export { applicationRoutes };
