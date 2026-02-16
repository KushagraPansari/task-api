/**
 * Advanced Logger Configuration
 * 
 * Use this when:
 * - Server runs for months with persistent disk
 * - You need daily log rotation to prevent disk from filling up
 * - Running microservices where logs need service identification
 * - Compliance requires log retention policies
 *
 * Extra dependency needed: npm i winston-daily-rotate-file
 */

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
  exitOnError: false, //`exitOnError: false` says: "if logging breaks, keep the app running anyway."
});

export default logger;

/* The full picture of what happens when you write `logger.error("DB failed", error):
Your code calls logger.error()
    ↓
Winston checks: is "error" >= current level? Yes
    ↓
Format pipeline runs:
    Dev  → colorize → timestamp → align → printf → colored terminal output
    Prod → errors(stack) → timestamp → json → JSON string
    ↓
defaultMeta adds { service: "task-api" }
    ↓
Three transports receive the log simultaneously:
    Console     → prints to terminal
    error.log   → writes to today's error file
    combined.log → writes to today's combined file
    ↓
Tomorrow at midnight:
    → Today's files get compressed to .gz
    → New files created for the new date
    → Files older than 14 days get deleted */