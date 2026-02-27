import { Router } from "express";
import { register, login, logout, refreshToken } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", auth, logout);
router.post("/refresh-token", refreshToken);

export default router;