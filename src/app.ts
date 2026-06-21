import express from "express";
import { prisma } from "./lib/prisma.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authRoutes } from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { courseRoutes } from "./routes/course.routes.js";
import { courseModuleRoutes } from "./routes/course-module.routes.js";
import { jobRoutes } from "./routes/job.routes.js";
import { applicationRoutes } from "./routes/application.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  return response.status(200).json({
    status: "ok",
    message: "Career Tracker API is running",
  });
});

app.get("/db-health", async (_request, response) => {
  const usersCount = await prisma.user.count();

  return response.status(200).json({
    status: "ok",
    database: "connected",
    usersCount,
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/course-modules", courseModuleRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);

app.use(errorMiddleware);
