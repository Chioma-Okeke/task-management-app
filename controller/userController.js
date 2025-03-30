const userModel = require("../model/userModel");

const get_a_user = async (req, res, next) => {
    const { id } = req.params;
    try {
        const fetchedUser = await userModel.findById(id);
        if (!fetchedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({ fetchedUser });
    } catch (error) {
        next({ status: 404, message: "User not found" });
    }
};

const create_a_user = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ msg: "All fields are required" });
    }
    try {
        const newUser = new userModel({ ...req.body });
        const createdUser = await newUser.save();
        res.status(200).json({ createdUser });
    } catch (error) {
        next(error);
    }
};

const update_a_user = async (req, res, next) => {
    const userInfo = req.user;
    const { id } = req.params;
    const update = req.body;

    if (userInfo._id != id) {
        console.log(userInfo._id, id)
        return res
            .status(401)
            .json({ msg: "You are not authorized to perform this action" });
    }

    try {
        const updatedUserDetails = await userModel.findByIdAndUpdate(
            id,
            update,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!updatedUserDetails) {
            return res.status(404).json({ msg: "No user found" });
        }
        const {password: _, ...userData} = updatedUserDetails.toObject()
        res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};

const delete_a_user = async (req, res, next) => {
    const userInfo = req.user;
    const { id } = req.params;

    if (userInfo._id != id) {
        return res
            .status(401)
            .json({ msg: "You are not authorized to perform this action" });
    }

    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NOD_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
        });
        await userModel.findByIdAndDelete(id);
        res.status(200).json({ msg: "User successfully deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    update_a_user,
    get_a_user,
    delete_a_user,
    create_a_user
};
