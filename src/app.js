import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.routes.js'
import taskRuter from './routes/task.routes.js';

const app = express();

app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
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
app.use("/task", taskRuter)

app.get("/", (req, res) => {
    res.send("api working")
})

export default app