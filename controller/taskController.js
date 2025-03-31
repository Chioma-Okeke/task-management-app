const moment = require("moment");
const taskModel = require("../model/taskModel");
const userModel = require("../model/userModel");

const get_user_tasks = async (req, res, next) => {
    const userId = req.user._id;
    const { categories, deadline } = req.query;

    try {
        let filter = { userId };

        if (categories) {
            filter.categories = categories;
        }

        console.log(moment(req.body.deadline, "DD/MM/YYYY").toISOString(), "deadline date")

        if (deadline) {
            filter.deadline = { $lte: moment(req.body.deadline, "DD/MM/YYYY").toISOString() };
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
        // if (!user) {
        //     return res
        //         .status(401)
        //         .json({ msg: "You need to be logged in to create a post" });
        // }

        const newTask = new taskModel({
            ...req.body,
            userId: userId,
            categories: req.body.categories.toLowerCase(),
            deadline: moment(req.body.deadline, "DD/MM/YYYY").add(1, 'days').toISOString()
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
    const updates = req.body;
    const { id } = req.params;

    try {
        const taskUpdated = await taskModel.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!taskUpdated) {
            return res.status(404).json({ msg: "No post found" });
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
                msg: "Unauthorized: Only authors can delete this post",
            });
        }

        await taskModel.findByIdAndDelete(id);

        if (user) {
            user.taskIds = user.taskIds.filter((taskId) => taskId !== id);
            await user.save();
        }
        res.status(200).json({ msg: "Task successfully deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    get_user_tasks,
    create_a_task,
    update_a_task,
    delete_a_task,
};
