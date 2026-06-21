import { Router } from "express";
import { CourseModuleController } from "../controllers/course-module.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { updateCourseModuleSchema } from "../validations/course-module.schema.js";

const courseModuleRoutes = Router();
const courseModuleController = new CourseModuleController();

courseModuleRoutes.use(authMiddleware);

/**
 * @openapi
 * /course-modules/{id}:
 *   get:
 *     tags:
 *       - Course Modules
 *     summary: Get a course module by ID
 *     description: Returns a module belonging to a course owned by the authenticated user.
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
 *         description: Course module found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 module:
 *                   $ref: '#/components/schemas/CourseModule'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course module not found
 */
courseModuleRoutes.get("/:id", courseModuleController.findOne);


/**
 * @openapi
 * /course-modules/{id}:
 *   patch:
 *     tags:
 *       - Course Modules
 *     summary: Update a course module
 *     description: Partially updates a module owned by the authenticated user.
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
 *             $ref: '#/components/schemas/UpdateCourseModuleRequest'
 *     responses:
 *       200:
 *         description: Course module updated successfully
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
 *                   example: Course module updated successfully
 *                 module:
 *                   $ref: '#/components/schemas/CourseModule'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course module not found
 */
courseModuleRoutes.patch("/:id", validateBody(updateCourseModuleSchema),
  courseModuleController.update);


/**
 * @openapi
 * /course-modules/{id}:
 *   delete:
 *     tags:
 *       - Course Modules
 *     summary: Delete a course module
 *     description: Deletes a module owned by the authenticated user.
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
 *         description: Course module deleted successfully
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
 *                   example: Course module deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course module not found
 */
courseModuleRoutes.delete("/:id", courseModuleController.delete);

export { courseModuleRoutes };
