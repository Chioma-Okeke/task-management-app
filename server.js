const express = require('express')
const connectDb = require('./db/dbController')

const app = express()

require("dotenv").config()
const port = process.env.PORT

connectDb()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.listen(port, console.log("Server running..."))