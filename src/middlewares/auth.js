import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import config from "../config/index.js";

const auth = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw ApiError.unauthorized("Access token required");

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.accessSecret);
  } catch (error) {
    throw ApiError.unauthorized("Invalid or expired access token");
  }

  const user = await User.findById(decoded._id);
  if (!user) throw ApiError.unauthorized("User not found");

  req.user = user;
  next();
});

export default auth;