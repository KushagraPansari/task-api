//validate(registerSchema) is called immediately when the server starts, not when a request comes in.
import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    return next(ApiError.badRequest("Validation failed", errors));
  }

  req.body = result.data; //The original dirty request body:Gets replaced with the cleaned data:
  next();
};

export default validate;