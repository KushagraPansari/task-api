import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/index.js";

const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw ApiError.conflict("Email already exists");

  const user = await User.create({ name, email, password });

  const { accessToken, refreshToken } = await generateTokens(user._id);
  
//user.create returns the full document including the password hash, doing a fresh findById returns the user WITHOUT password and refreshToken. This is the clean user object we send to the client:
  const createdUser = await User.findById(user._id);//Get a clean user object without password hash.

  return { user: createdUser, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw ApiError.unauthorized("Invalid email or password");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id);//Get a clean user object without password hash.

  return { user: loggedInUser, accessToken, refreshToken };
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};

export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw ApiError.unauthorized("Refresh token required");

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, config.jwt.refreshSecret); //If it passes, decoded contains the payload: { _id: "user123" }
  } catch (error) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded._id).select("+refreshToken"); //Find the user using decoded ID
  if (!user) throw ApiError.unauthorized("Invalid refresh token"); //Valid token but user deleted → reject ❌

  if (user.refreshToken !== incomingRefreshToken) { //Compare incoming token with stored token in DB
    throw ApiError.unauthorized("Refresh token is expired or used");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id); //Generate new access & refresh tokens

  return { accessToken, refreshToken };
};