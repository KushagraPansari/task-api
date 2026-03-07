import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as taskService from "../services/task.service.js";

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user._id);
  res.status(201).json(ApiResponse.created(task, "Task created successfully"));
});

export const getTasks = asyncHandler(async (req, res) => {
  const result = await taskService.getTasks(
    req.user._id,
    req.user.role,
    req.query,
  );
  res.status(200).json(ApiResponse.ok(result, "Tasks fetched successfully"));
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(
    req.params.id,
    req.user._id,
    req.user.role,
  );
  res.status(200).json(ApiResponse.ok(task, "Task fetched successfully"));
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body,
  );
  res.status(200).json(ApiResponse.ok(task, "Task updated successfully"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user._id, req.user.role);
  res.status(200).json(ApiResponse.ok(null, "Task deleted successfully"));
});