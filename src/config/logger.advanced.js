import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "./index.js";

const devFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.align(),
  format.printf(
    (info) =>
      `[${info.timestamp}] ${info.level}: ${info.message}${info.stack ? "\n" + info.stack : ""}`,
  ),
);

const prodFormat = format.combine(
  format.errors({ stack: true }),
  format.timestamp(),
  format.json(),
);

const logger = createLogger({
  level: config.node_env === "production" ? "info" : "debug",
  format: config.node_env === "production" ? prodFormat : devFormat,
  defaultMeta: { service: "task-api" },
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      level: "error",
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  exitOnError: false, 
});

export default logger;
