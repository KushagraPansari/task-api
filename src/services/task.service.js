import Task from "../models/task.model.js";
import ApiError from "../utils/ApiError.js";
import { PAGINATION } from "../constants/index.js";


export const createTask = async (taskData, userId) => {
  const task = await Task.create({ ...taskData, user: userId });
  return task;
};

export const getTasks = async (userId, userRole, query) => {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    status,
    priority,
    sortBy = "createdAt",
    order = "desc",
    search,
  } = query;

  const filter = {};
 
  // Regular users see only their tasks, admin sees all
  if (userRole !== "admin") {
    filter.user = userId;
  }

  // Optional filters
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  // Search by title
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(parseInt(limit, 10), PAGINATION.MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;
  const sortOrder = order === "asc" ? 1 : -1;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .populate("user", "name email"),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};


export const getTaskById = async (taskId, userId, userRole) => {
  const task = await Task.findById(taskId).populate("user", "name email");
  if (!task) throw ApiError.notFound("Task not found");

  if (userRole !== "admin" && task.user._id.toString() !== userId.toString()) {
    throw ApiError.forbidden("You can only access your own tasks");
  }

  return task;
};


export const updateTask = async (taskId, userId, userRole, updateData) => {
  const task = await Task.findById(taskId);
  if (!task) throw ApiError.notFound("Task not found");

  if (userRole !== "admin" && task.user.toString() !== userId.toString()) {
    throw ApiError.forbidden("You can only update your own tasks");
  }

  Object.assign(task, updateData);
  await task.save();

  return task.populate("user", "name email");
};


export const deleteTask = async (taskId, userId, userRole) => {
  const task = await Task.findById(taskId);
  if (!task) throw ApiError.notFound("Task not found");

  if (userRole !== "admin" && task.user.toString() !== userId.toString()) {
    throw ApiError.forbidden("You can only delete your own tasks");
  }

  await task.deleteOne();
};