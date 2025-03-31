const mongoose = require("mongoose")

const taskModel = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        categories: {
            type: String,
            enum: ["work", "personal", "others"],
            default: "Others"
        },
        deadline: {
            type: Date
        },
        completed: {
            type: Boolean,
            default: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("task", taskModel)