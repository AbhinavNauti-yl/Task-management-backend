import express from 'express'
import { createTaks, deleteTask, getAllTaskCreatedByMe } from '../controller/task.controller.js'
import {authMiddleware} from '../middleware/auth.middleware.js'

const taskRuter = express.Router()

taskRuter.route("/createTask").post(authMiddleware, createTaks)
taskRuter.route("/:_id").delete(authMiddleware, deleteTask)
taskRuter.route("/:_id").get(authMiddleware, getAllTaskCreatedByMe)

export default taskRuter