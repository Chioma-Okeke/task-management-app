const {Router} = require("express")
const authMiddleware = require("../middleware/authMiddleware")

const taskRouter = Router()
    .get("/tasks", authMiddleware,)
    .post("/task", authMiddleware, )
    .put("/tasks/:id", authMiddleware, )
    .delete("/tasks/:id", authMiddleware,);

module.exports = taskRouter