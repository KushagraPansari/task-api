import app from "./app.js";
import config from "./config/index.js";
import connectDB from "./db/index.js";
import logger from "./config/logger.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} [${config.node_env}]`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });

      // Force shutdown after 10s if graceful fails
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Rejection:", err);
      shutdown("UNHANDLED_REJECTION");
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();