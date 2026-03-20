import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as authService from "../services/auth.service.js";
import config from "../config/index.js";

const cookieOptions = {
  httpOnly: true,
  secure: config.node_env === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);

  res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(ApiResponse.created({ user, accessToken }, "Registration successful"));
});


export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(ApiResponse.ok({ user, accessToken }, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);

  res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .json(ApiResponse.ok(null, "Logged out successfully"));
});


export const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshAccessToken(incomingRefreshToken);

  res
    .status(200)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(ApiResponse.ok({ accessToken }, "Token refreshed"));
});


export const getCurrentUser = asyncHandler(async(req, res)=>{
  res.status(200).json(ApiResponse.ok(req.user, "User fetched successfully"));
})


export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, currentPassword, newPassword);
  res.status(200).json(ApiResponse.ok(null, "Password changed successfully"));
});


export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest("Please upload an image");

  const user = await authService.updateAvatar(req.user._id, req.file.buffer);
  res.status(200).json(ApiResponse.ok(user, "Avatar updated successfully"));
});


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await authService.getAllUsers();
  res.status(200).json(ApiResponse.ok(users, "Users fetched successfully"));
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await authService.deleteAccount(req.user._id, req.body.password);
  res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .json(ApiResponse.ok(null, "Account deleted successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  res.status(200).json(ApiResponse.ok(user, "Profile updated successfully"));
});