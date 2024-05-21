import User from "../models/user.model.js"

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedinUserId = req.user._id

        const filteredUsers = await User.find({ _id: { $ne: loggedinUserId } }).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}