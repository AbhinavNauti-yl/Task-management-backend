import express from 'express'
import { logIn, logOut, signUp } from '../controller/user.controller.js'


const userRouter = express.Router()
userRouter.route('/signUp').post(signUp)
userRouter.route('/logIn').get(logIn)
userRouter.route('/logOut').get(logOut)

export default userRouter