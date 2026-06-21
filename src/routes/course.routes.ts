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

/**
 * @openapi
 * /courses:
 *   post:
 *     tags:
 *       - Courses
 *     summary: Create a course
 *     description: Creates a new course owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseRequest'
 *     responses:
 *       201:
 *         description: Course created successfully
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
 *                   example: Course created successfully
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
courseRoutes.post("/", validateBody(createCourseSchema), courseController.create);


/**
 * @openapi
 * /courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: List authenticated user's courses
 *     description: Returns paginated courses owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [not_started, in_progress, completed]
 *         description: Filter courses by status
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search courses by text
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
 *         description: Paginated course list
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
 *                     $ref: '#/components/schemas/Course'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
courseRoutes.get("/", validateQuery(listCoursesQuerySchema), courseController.list);


/**
 * @openapi
 * /courses/{courseId}/modules:
 *   post:
 *     tags:
 *       - Course Modules
 *     summary: Create a course module
 *     description: Creates a module inside a course owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseModuleRequest'
 *     responses:
 *       201:
 *         description: Course module created successfully
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
 *                   example: Course module created successfully
 *                 module:
 *                   $ref: '#/components/schemas/CourseModule'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course not found
 */
courseRoutes.post("/:courseId/modules", validateBody(createCourseModuleSchema), courseModuleController.create);


/**
 * @openapi
 * /courses/{courseId}/modules:
 *   get:
 *     tags:
 *       - Course Modules
 *     summary: List modules from a course
 *     description: Returns modules ordered by the order field.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Course modules returned successfully
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
 *                     $ref: '#/components/schemas/CourseModule'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course not found
 */
courseRoutes.get("/:courseId/modules", courseModuleController.list);


/**
 * @openapi
 * /courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Get a course by ID
 *     description: Returns a course owned by the authenticated user.
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
 *         description: Course found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
courseRoutes.get("/:id", courseController.findOne);


/**
 * @openapi
 * /courses/{id}:
 *   patch:
 *     tags:
 *       - Courses
 *     summary: Update a course
 *     description: Partially updates a course owned by the authenticated user.
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
 *             $ref: '#/components/schemas/UpdateCourseRequest'
 *     responses:
 *       200:
 *         description: Course updated successfully
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
 *                   example: Course updated successfully
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course not found
 */
courseRoutes.patch("/:id", validateBody(updateCourseSchema), courseController.update);


/**
 * @openapi
 * /courses/{id}:
 *   delete:
 *     tags:
 *       - Courses
 *     summary: Delete a course
 *     description: Deletes a course and its associated modules.
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
 *         description: Course deleted successfully
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
 *                   example: Course deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course not found
 */
courseRoutes.delete("/:id", courseController.delete);

export { courseRoutes };
