import express from "express";

export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  return response.status(200).json({
    status: "ok",
    message: "Career Tracker API is running",
  });
});
