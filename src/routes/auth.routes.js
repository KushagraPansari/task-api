import { Router } from "express";
import { register, login, logout, refreshToken, getCurrentUser, changePassword, updateAvatar, getAllUsers, deleteAccount } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import authorize from "../middlewares/authorize.js";
import { registerSchema, loginSchema, changePasswordSchema, deleteAccountSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", auth, logout);
router.post("/refresh-token", refreshToken);
router.get("/me", auth, getCurrentUser);
router.post("/change-password", auth, validate(changePasswordSchema), changePassword);
router.patch("/avatar", auth, upload.single("avatar"), updateAvatar);
router.get("/users", auth, authorize("admin"), getAllUsers);
router.delete("/account", auth, validate(deleteAccountSchema), deleteAccount);

export default router;