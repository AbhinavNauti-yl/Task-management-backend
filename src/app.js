import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.routes.js'

const app = express();

app.use(cookieParser())

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.urlencoded(
    {
        limit: "16kb",
        extended: true,
    }
))

app.use(express.json(
    {
        limit: "16kb",
        extended: true,
    }
))

app.use("/user", userRouter)

app.get("/", (req, res) => {
    res.send("api working")
})

export default app