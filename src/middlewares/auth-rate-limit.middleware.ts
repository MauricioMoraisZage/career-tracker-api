import { rateLimit } from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,

  standardHeaders: true,
  legacyHeaders: false,

  skip: () => process.env.NODE_ENV === "test",

  message: {
    status: "error",
    message: "Too many authentication attempts. Please try again later.",
  },
});
