import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asynchandeler } from "../utils/asyncHandeler.js";

const createTaks = asynchandeler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new apiError(403, "unauthorized access");

  const { title, description, dueDate, priority, status, assignedTo } =
    req.body;

  const newTask = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    createdBy: user._id,
    assignedTo,
  });
  const task = await Task.findById(newTask._id);
  if (!task) throw new apiError(500, "could not create task");

  res.status(200).json(new apiResponse(200, task, "task created"));
});

const deleteTask = asynchandeler(async (req, res, next) => {
  const id = req?.params?.id;
  const taskToDelete = await Task.findById(id);
  if (!taskToDelete) throw new apiError(500, "no task to delete");
  if (taskToDelete.status == "Pending")
    throw new apiError(400, "task not completed");

  const response = await Task.deleteOne({ _id: taskToDelete._id });
  if (!response)
    throw new apiError(500, "something went wring deleting the task");
  res.status(200).json(new apiResponse(200, response, "task deleted"));
});

const getAllTaskCreatedByMe = asynchandeler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new apiError(403, "unauthorized access");

  const tasks = await Task.find({ createdBy: user._id }).populate(
    "assignedTo createdBy",
    "name email"
  );

  if (!tasks) throw new apiError(400, "no tasks found");
  res.status(200).json(new apiResponse(200, tasks, "all tasks created by me"));
});

const getAllTaskAssignedToMe = asynchandeler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new apiError(403, "unauthorized access");

  const tasks = await Task.find({ assignedTo: user?._id }).populate(
    "assignedTo createdBy",
    "name email"
  );

  if (!tasks) throw new apiError(400, "no tasks found");
  res.status(200).json(new apiResponse(200, tasks, "all tasks assigned to me"));
});

const getAllTask = asynchandeler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new apiError(403, "unauthorized access");

  const tasks = await Task.find({}).populate(
    "assignedTo createdBy",
    "name email"
  );

  if (!tasks) throw new apiError(400, "no tasks found");
  res.status(200).json(new apiResponse(200, tasks, "all tasks"));
});

const getTaskById = asynchandeler(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  if (!user) throw new apiError(400, "unathorized access");
  const id = req?.params?.id;
  const task = await Task.findById(id).populate(
    "assignedTo createdBy",
    "name email"
  );
  if (!task) throw new apiError(500, "task dose not exist");

  res.status(200).json(new apiResponse(200, task, "task by id"));
});

const updateTask = asynchandeler(async (req, res, next) => {
  const id = req?.params?.id
  const user = await User.findById(req?.user?._id);
  const {
    title,
    description,
    dueDate,
    priority,
    status,
    createdBy,
    assignedTo,
  } = req?.body;

  if (!user) throw new apiError("unauthorized access");

  if (!(user._id == createdBy || user._id == assignedTo)) {
    throw new apiError("You do not have access to modify this task");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy,
      assignedTo,
    },
    {
      new: true,
    }
  ).populate("createdBy assignedTo", "name email");

  if(!updateTask) throw new apiError(400, "Could not find task");
  res.status(200).json(new apiResponse(200, updatedTask, "task updated successfully"))
});

export {
  createTaks,
  deleteTask,
  getAllTaskCreatedByMe,
  getAllTaskAssignedToMe,
  getAllTask,
  getTaskById,
  updateTask,
};
