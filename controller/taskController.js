const moment = require("moment");
const taskModel = require("../model/taskModel");
const userModel = require("../model/userModel");

const get_task_by_id = async (req, res, next) => {
    const { id } = req.params;
    try {
        const task = await taskModel.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json({ message: "Task successfully fetched.", task });
    } catch (error) {
        next(error);
    }
};

const get_user_tasks = async (req, res, next) => {
    const userId = req.user._id;
    const { categories, deadline, status } = req.query;

    try {
        let filter = { userId };

        if (categories) {
            filter.categories = categories;
        }

        if (deadline) {
            filter.deadline = {
                $lte: moment(deadline, "DD/MM/YYYY").toISOString(),
            };
        }

        if (status) {
            if (status !== "true" && status !== "false") {
                return res.status(400).json({
                    message: "Invalid status value. Must be 'true' or 'false'.",
                });
            }
            filter.completed = status === "true";
        }

        const tasks = await taskModel.find(filter);

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found." });
        }

        res.status(200).json({ message: "Tasks successfully fetched", tasks });
    } catch (error) {
        next(error);
    }
};

const create_a_task = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const user = await userModel.findById(userId);

        const newTask = new taskModel({
            ...req.body,
            userId: userId,
            categories: req.body.categories.toLowerCase(),
            deadline: moment(req.body.deadline, "DD/MM/YYYY")
                .add(1, "days")
                .toISOString(),
        });
        const createdTask = await newTask.save();
        user.taskIds.push(createdTask._id);
        await user.save();
        res.status(201).json({
            message: "Task successfully created",
            createdTask,
        });
    } catch (error) {
        next(error);
    }
};

const update_a_task = async (req, res, next) => {
    const userInfo = req.user
    const updates = req.body;
    const { id } = req.params;

    if (!userInfo.taskIds.includes(id)) {
        return res
            .status(401)
            .json({ msg: "You can only edit tasks created by you" });
    }
    try {
        const taskUpdated = await taskModel.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!taskUpdated) {
            return res.status(404).json({ msg: "No task found" });
        }
        res.status(200).json(taskUpdated);
    } catch (error) {
        next(error);
    }
};

const delete_a_task = async (req, res, next) => {
    const userId = req.user._id;
    const { id } = req.params;
    try {
        const task = await taskModel.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        const user = await userModel.findById(task.userId);

        if (task.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You can only delete task created by you.",
            });
        }

        await taskModel.findByIdAndDelete(id);

        if (user) {
            user.taskIds = user.taskIds.filter((taskId) => taskId.toString() !== id.toString());
            await user.save();
        }
        res.status(200).json({ msg: "Task successfully deleted" });
    } catch (error) {
        next(error);
    }
};

const task_status_update = async (req, res, next) => {
    const userInfo = req.user;
    const { id } = req.params;
    const { status } = req.body;

    if (!userInfo.taskIds.includes(id)) {
        return res
            .status(401)
            .json({ msg: "You can only edit tasks created by you" });
    }

    try {
        if (typeof status !== "boolean") {
            return res
                .status(400)
                .json({
                    message: "Invalid status value. Must be true or false.",
                });
        }
        const task = await taskModel.findOne({ _id: id, userId: userInfo._id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.completed = status;
        await task.save();

        res.status(200).json({ message: "Task status updated.", task });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    get_task_by_id,
    get_user_tasks,
    create_a_task,
    update_a_task,
    delete_a_task,
    task_status_update,
};
