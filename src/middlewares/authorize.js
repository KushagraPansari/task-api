import ApiError from "../utils/ApiError.js";

const authorize = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden("You don't have permission to perform this action");
    }

    next();
  };
};

export default authorize;