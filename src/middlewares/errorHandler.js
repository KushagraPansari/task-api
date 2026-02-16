import ApiError from "../utils/ApiError.js";
import config from "../config/index.js";
import logger from "../config/logger.js";

const errorHandler = (err, _req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message =
      config.node_env === "production"
        ? "Internal Server Error"
        : error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], err.stack);
  }

  logger.error({
    statusCode: error.statusCode,
    message: err.message,  
    stack: error.stack,     
  });

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(config.node_env === "development" && { stack: error.stack }),
  });
};

export default errorHandler;