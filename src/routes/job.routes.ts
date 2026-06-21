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

/**
 * @openapi
 * /jobs:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Create a job opportunity
 *     description: Creates a job opportunity owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobRequest'
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Job created successfully
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 */
jobRoutes.post("/", validateBody(createJobSchema), jobController.create);


/**
 * @openapi
 * /jobs:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: List job opportunities
 *     description: Returns paginated job opportunities owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [saved, applied, interview, rejected, offer]
 *       - in: query
 *         name: remote
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by company, position or location
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated job list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Authentication required
 */
jobRoutes.get("/", validateQuery(listJobsQuerySchema), jobController.list);

/**
 * @openapi
 * /jobs/{jobId}/application:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Create an application for a job
 *     description: Creates one application and automatically marks the job as APPLIED.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateApplicationRequest'
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Application created successfully
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Job not found
 *       409:
 *         description: Application already exists for this job
 */
jobRoutes.post("/:jobId/application", validateBody(createApplicationSchema), applicationController.create);


/**
 * @openapi
 * /jobs/{id}:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get a job by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Job not found
 */
jobRoutes.get("/:id", jobController.findOne);


/**
 * @openapi
 * /jobs/{id}:
 *   patch:
 *     tags:
 *       - Jobs
 *     summary: Update a job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateJobRequest'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Job updated successfully
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Job not found
 */
jobRoutes.patch("/:id", validateBody(updateJobSchema), jobController.update);


/**
 * @openapi
 * /jobs/{id}:
 *   delete:
 *     tags:
 *       - Jobs
 *     summary: Delete a job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Job not found
 */
jobRoutes.delete("/:id", jobController.delete);

export { jobRoutes };
