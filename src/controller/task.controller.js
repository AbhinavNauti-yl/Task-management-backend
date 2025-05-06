import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asynchandeler } from "../utils/asyncHandeler.js";

const createTaks = asynchandeler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new apiError(403, "unauthorized access");

  const {
    title,
    description,
    dueDate,
    priority,
    status,
    assignedTo,
  } = req.body;

  const newTask = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    createdBy: user._id,
    assignedTo,
  });
  const task = await Task.findById(newTask._id)
  if (!task) throw new apiError(500, "could not create task");

  res.status(200).json(new apiResponse(200, task, 'task created'))
});

const deleteTask = asynchandeler( async (req, res, next) => {
    const _id = req.params
    const taskToDelete = await Task.findById(_id)
    if(!taskToDelete) throw new apiError(500, "no task to delete");
    if(taskToDelete.status == 'Pending') throw new apiError(400, "task not completed")

    const response = await Task.deleteOne({_id: taskToDelete._id})
    if(!response) throw new apiError(500, "something went wring deleting the task");
    res.status(200).json(new apiResponse(200, response, "task deleted"))
})

const getAllTaskCreatedByMe = asynchandeler (async (req, res, next) => {
    const user = await User.findById(req.user?._id)
    if(!user) throw new apiError(403, "unauthorized access");

    const tasks = await Task.find({createdBy: user._id}).populate("assignedTo", "name email")

    if(!tasks) throw new apiError(400, "no tasks found");
    res.status(200).json(new apiResponse(200, tasks, "all tasks created by me"))

})


export {createTaks, deleteTask, getAllTaskCreatedByMe}