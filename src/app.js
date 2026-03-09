import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import ApiError from "./utils/ApiError.js";
import routes from "./routes/index.js";

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);

app.use(generalLimiter);

// Parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Performance
app.use(compression());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1", routes);

// 404 handler
app.use((_req, _res, next) => {
  next(ApiError.notFound("Route not found"));
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;