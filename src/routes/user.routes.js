import express from 'express'
import { getAllUsers, logIn, logOut, signUp, updateUser } from '../controller/user.controller.js'
import {authMiddleware} from "../middleware/auth.middleware.js";



const userRouter = express.Router()
userRouter.route('/signUp').post(signUp)
userRouter.route('/logIn').post(logIn)
userRouter.route('/logOut').get(authMiddleware, logOut)
userRouter.route('/updateUser').post(authMiddleware, updateUser)
userRouter.route('/getAllUsers').get(authMiddleware, getAllUsers)

export default userRouter