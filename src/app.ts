import express from "express";
import { prisma } from "./lib/prisma.js";

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