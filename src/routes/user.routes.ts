import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/me", authMiddleware, userController.me);

export { userRoutes };