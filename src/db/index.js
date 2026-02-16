import mongoose from "mongoose";
import config from "../config/index.js";
import logger from "../config/logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri);

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });
  } catch (error) {
    logger.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;