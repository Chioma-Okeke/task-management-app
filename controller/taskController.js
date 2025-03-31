const taskModel = require("../model/taskModel");

const get_user_tasks = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const tasks = await taskModel.find({ userId });
        if (!tasks) {
            return res.status(404).json({ message: "No tasks found." });
        } else {
            return res
                .status(200)
                .json({ message: "Tasks successfully fetched", tasks });
        }
    } catch (error) {
        next(error);
    }
};

const create_a_task = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const user = await userModel.findById(userInfo);
        // if (!user) {
        //     return res
        //         .status(401)
        //         .json({ msg: "You need to be logged in to create a post" });
        // }

        const newTask = new taskModel({
            ...req.body,
            userId: userId,
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

        await blogModel.findByIdAndDelete(id);

        if (user) {
            user.taskIds = user.taskIds.filter((taskId) => taskId !== id);
            await user.save();
        }
        res.status(200).json({ msg: "Task successfully deleted" });
    } catch (error) {
        next(error);
    }
};

const get_tasks_by_category = async (req, res, next) => {
    const userId = req.user._id;
    const { category } = req.query;
    try {
        let filter = { userId: userId };
        if (category) {
            filter.category = category;
        }
        const tasks = await taskModel.find(filter);
        res.status(200).json({ message: "Task fetched successfully", tasks });
    } catch (error) {
        next(error);
    }
};

const get_tasks_by_deadline = async (req, res, next) => {
    const userId = req.user._id
    const {deadline} = req.query
    try {
        const filter = {userId: userId}
        if(deadline) {
            filter.deadline = {$lte: new Date(deadline)}
        }
        const tasks = await taskModel.find(filter)
        res.status(200).json({message: "Tasks successfully fetched", tasks})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    get_user_tasks,
    create_a_task,
    update_a_task,
    delete_a_task,
    get_tasks_by_category,
};
