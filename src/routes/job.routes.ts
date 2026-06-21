import { Router } from "express";
import { JobController } from "../controllers/job.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody, validateQuery } from "../middlewares/validate.middleware.js";
import {
  createJobSchema, listJobsQuerySchema, updateJobSchema,
} from "../validations/job.schema.js";
import { ApplicationController } from "../controllers/application.controller.js";
import { createApplicationSchema } from "../validations/application.schema.js";

const jobRoutes = Router();
const jobController = new JobController();
const applicationController = new ApplicationController();

jobRoutes.use(authMiddleware);

jobRoutes.post("/", validateBody(createJobSchema), jobController.create);

jobRoutes.get("/", validateQuery(listJobsQuerySchema), jobController.list);

jobRoutes.post("/:jobId/application", validateBody(createApplicationSchema), applicationController.create);

jobRoutes.get("/:id", jobController.findOne);

jobRoutes.patch("/:id", validateBody(updateJobSchema), jobController.update);

jobRoutes.delete("/:id", jobController.delete);

export { jobRoutes };
