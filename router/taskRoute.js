const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    get_user_tasks,
    create_a_task,
    update_a_task,
    delete_a_task,
    get_task_by_id,
    task_status_update,
} = require("../controller/taskController");

const taskRouter = Router()
    .get("/tasks/:id", authMiddleware, get_task_by_id)
    .get("/tasks", authMiddleware, get_user_tasks)
    .post("/task", authMiddleware, create_a_task)
    .put("/tasks/:id", authMiddleware, update_a_task)
    .put("/tasks/:id/status", authMiddleware, task_status_update)
    .delete("/tasks/:id", authMiddleware, delete_a_task);

module.exports = taskRouter;
