const express = require('express')
const connectDb = require('./db/dbController')
const cookieParser = require("cookie-parser")
const authRouter = require('./router/authRouter')
const taskRouter = require('./router/taskRoute')


const app = express()
require("dotenv").config()

const port = process.env.PORT

connectDb()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", authRouter)
app.use("/api", taskRouter)


app.listen(port, console.log("Server running..."))