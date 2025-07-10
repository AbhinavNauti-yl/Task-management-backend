import jwt from 'jsonwebtoken'


import { User } from "../models/user.model.js";
import { asynchandeler } from "../utils/asyncHandeler.js";
import apiError from '../utils/apiError.js';

export const authMiddleware = asynchandeler( async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization").replace("Bearer", "")

    if(!accessToken) throw new apiError(403, "unauthorized access");
    const decodedAccessToken = await jwt.verify(accessToken, process.env.ACCESTOKENKEY)
    const user = await User.findById(decodedAccessToken._id)
    if(!user) {
        throw new apiError (403, 'unathorized access')
    }

    req.user = user
    next()

})

