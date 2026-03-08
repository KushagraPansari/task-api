import ApiError from "../utils/ApiError.js";
import config from "../config/index.js";
import logger from "../config/logger.js";

const errorHandler = (err, _req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {

    if (err.name === "CastError") {
      error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
    }
    else if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      error = ApiError.conflict(`${field} already exists`);
    }
    else if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      error = ApiError.badRequest("Validation failed", errors);
    }
    else if (err.name === "JsonWebTokenError") {
      error = ApiError.unauthorized("Invalid token");
    }
    else if (err.name === "TokenExpiredError") {
      error = ApiError.unauthorized("Token expired");
    }
    else {
    const statusCode = err.statusCode || 500;
    const message =
      config.node_env === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], err.stack);
    }
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