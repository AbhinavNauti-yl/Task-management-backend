import express from 'express'
import { logIn, logOut, signUp, updateUser } from '../controller/user.controller.js'
import {authMiddleware} from "../middleware/auth.middleware.js";



const userRouter = express.Router()
userRouter.route('/signUp').post(signUp)
userRouter.route('/logIn').get(logIn)
userRouter.route('/logOut').get(authMiddleware, logOut)
userRouter.route('/updateUser').post(authMiddleware, updateUser)

export default userRouter