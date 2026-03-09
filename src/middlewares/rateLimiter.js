import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests("Too many attempts. Please try again after 15 minutes."));
  },
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests("Too many requests. Please try again later."));
  },
});