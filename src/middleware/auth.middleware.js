import jwt from 'json-web-token'


import { User } from "../models/user.model";
import { asynchandeler } from "../utils/asyncHandeler";
import apiError from '../utils/apiError';

export const authMiddleware = asynchandeler( async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.headers("Authorization").replace("Bearer", "")

    if(!accessToken) throw new apiError(403, "unauthorized access");

    const decodedAccessToken = jwt.varify(accessToken, process.env.ACCESTOKENKEY)
    const user = await User.findById(decodedAccessToken._id)
    if(!user) {
        throw new apiError (403, 'unathorized access')
    }

    req.user = user
    next()

})

