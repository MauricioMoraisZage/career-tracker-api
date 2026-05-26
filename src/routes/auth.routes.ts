import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validations/auth.schema.js";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post(
  "/register",
  validateBody(registerSchema),
  authController.register,
);

authRoutes.post("/login", validateBody(loginSchema), authController.login);

export { authRoutes };