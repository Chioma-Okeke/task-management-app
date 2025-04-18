const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        taskIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "task"
            }
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("user", userModel);
