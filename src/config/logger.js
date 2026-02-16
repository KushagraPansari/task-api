import { createLogger, format, transports } from "winston";
import config from "./index.js";

const logger = createLogger({
  level: config.node_env === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    config.node_env === "production"
      ? format.json()
      : format.combine(format.colorize(), format.simple()),
  ),
  transports: [
    new transports.Console(),
    ...(config.node_env === "production"
      ? [
          new transports.File({ filename: "logs/error.log", level: "error" }),
          new transports.File({ filename: "logs/combined.log" }),
        ]
      : []),
  ],
});

export default logger;