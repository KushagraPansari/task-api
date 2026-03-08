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
    //why do they get token back from register? -> Because we want to log them in immediately after they register, so they can start using the app without having to log in again. It's a better user experience. We create the tokens in the service layer, and then send them back to the client in the response. The client can then store the access token in memory (e.g. Redux store) and the refresh token in an HTTP-only cookie for security.
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);

  res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(ApiResponse.created({ user, accessToken }, "Registration successful")); //api response just creates a object it doesnt send the response, we still need to use res.json to send the response. ApiResponse is just a helper class to create a consistent response format.
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