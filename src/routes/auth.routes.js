import { Router } from "express";
import { register, login, logout, refreshToken, getCurrentUser, changePassword } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import { registerSchema, loginSchema, changePasswordSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", auth, logout);
router.post("/refresh-token", refreshToken);
router.get("/me", auth, getCurrentUser);
router.post("/change-password", auth, validate(changePasswordSchema), changePassword);

export default router;