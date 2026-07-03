import User from "../../model/auth/authUser.model.js";

// Get user data
export const showProfile = async (userId) => {
    const user = await User.findById(userId)

    if (!user) {
        throw new Error('User not found')
    }
    return user;
}

// Update user profile (including avatar)
export const Update_Profile = async (userId, userData) => {
    const updateFields = {}

    if (userData.phone !== undefined) {
        updateFields.phone = userData.phone
    }
    if (userData.bio !== undefined) {
        updateFields.bio = userData.bio
    }
    if (userData.username !== undefined) {
        updateFields.username = userData.username
    }
    if (userData.email !== undefined) {
        updateFields.email = userData.email
    }
    if (userData.avatar !== undefined) {
        updateFields.avatar = userData.avatar
    }
    if (userData.theme !== undefined) {
        updateFields.theme = userData.theme
    }

    if (Object.keys(updateFields).length === 0) {
        throw new Error('No fields provided to update')
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true }
    )

    if (!updatedUser) {
        throw new Error('User not found')
    }

    return updatedUser;
}

export const GetAllUser = async () => {
    try {
        const users = await User.find().select('username email avatar bio phone createdAt').lean();
        return users;
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
};