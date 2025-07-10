import express from 'express'
import { createTaks, deleteTask, getAllTask, getAllTaskAssignedToMe, getAllTaskCreatedByMe, getTaskById, updateTask } from '../controller/task.controller.js'
import {authMiddleware} from '../middleware/auth.middleware.js'

const taskRuter = express.Router()

taskRuter.route("/").get(authMiddleware, getAllTask)
taskRuter.route("/assignedToMe").get(authMiddleware, getAllTaskAssignedToMe)
taskRuter.route("/createdByMe").get(authMiddleware, getAllTaskCreatedByMe)

taskRuter.route("/createTask").post(authMiddleware, createTaks)
taskRuter.route("/:id")
    .delete(authMiddleware, deleteTask)
    .get(authMiddleware, getTaskById)
    .post(authMiddleware, updateTask)

export default taskRuter