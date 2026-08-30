import express from "express";
import { prisma } from "./lib/prisma.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authRoutes } from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { courseRoutes } from "./routes/course.routes.js";
import { courseModuleRoutes } from "./routes/course-module.routes.js";
import { jobRoutes } from "./routes/job.routes.js";
import { applicationRoutes } from "./routes/application.routes.js";
import { swaggerSpecification } from "./docs/swagger.js";

export const app = express();

app.use(express.json());

app.get("/", (_request, response) => {
  return response.status(200).json({
    status: "ok",
    message: "Career Tracker API",
    documentation: "https://career-tracker-api.vercel.app/api-docs",
    health: "https://career-tracker-api.vercel.app/health",
    databaseHealth: "https://career-tracker-api.vercel.app/db-health"
  });
});

app.get("/openapi.json", (_request, response) => { return response.status(200).json(swaggerSpecification) });

const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Career Tracker API — Swagger</title>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css"
  />
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        persistAuthorization: true,
        displayRequestDuration: true
      });
    };
  </script>
</body>
</html>`;

app.get(["/api-docs", "/api-docs/"], (_request, response) => {
  return response
    .status(200)
    .type("html")
    .send(swaggerHtml);
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check API health
 *     description: Confirms that the Career Tracker API is running.
 *     responses:
 *       200:
 *         description: API is running successfully
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
 *                   example: Career Tracker API is running
 */
app.get("/health", (_request, response) => {
  return response.status(200).json({ status: "ok", message: "Career Tracker API is running" });
});

app.get("/db-health", async (_request, response) => {
  const usersCount = await prisma.user.count();

  return response.status(200).json({
    status: "ok", database: "connected", usersCount });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/course-modules", courseModuleRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);

app.use(errorMiddleware);
export default app;
