import { Router } from "express";
import { ApplicationController } from "../controllers/application.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody, validateQuery } from "../middlewares/validate.middleware.js";
import {
  listApplicationsQuerySchema, updateApplicationSchema,
} from "../validations/application.schema.js";

const applicationRoutes = Router();
const applicationController = new ApplicationController();

applicationRoutes.use(authMiddleware);

/**
 * @openapi
 * /applications:
 *   get:
 *     tags:
 *       - Applications
 *     summary: List job applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Paginated application list
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
 *                     $ref: '#/components/schemas/Application'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Authentication required
 */
applicationRoutes.get("/", validateQuery(listApplicationsQuerySchema),
  applicationController.list);


/**
 * @openapi
 * /applications/{id}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Get an application by ID
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
 *         description: Application found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Application not found
 */
applicationRoutes.get("/:id", applicationController.findOne);


/**
 * @openapi
 * /applications/{id}:
 *   patch:
 *     tags:
 *       - Applications
 *     summary: Update an application
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
 *             $ref: '#/components/schemas/UpdateApplicationRequest'
 *     responses:
 *       200:
 *         description: Application updated successfully
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
 *                   example: Application updated successfully
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Application not found
 */
applicationRoutes.patch("/:id", validateBody(updateApplicationSchema),
  applicationController.update);


/**
 * @openapi
 * /applications/{id}:
 *   delete:
 *     tags:
 *       - Applications
 *     summary: Delete an application
 *     description: Deletes the application and resets the associated job to SAVED.
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
 *         description: Application deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Application not found
 */
applicationRoutes.delete("/:id", applicationController.delete);

export { applicationRoutes };
