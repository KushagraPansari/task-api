import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import validate from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator.js";

const router = Router();

router.use(auth);

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;