import { showProfile, Update_Profile } from '../../service/user/updateProfile.service.js'

// GET /profile — Fetch user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }
        const data = await showProfile(userId)
        return res.status(200).json({
            message: 'User data successfully retrieved',
            success: true,
            data
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: error.message || 'Server error',
            success: false
        })
    }
}

// PUT /profile-update/:id — Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id
        const userData = req.body
        if (req.file) {
            // Store web-servable URL path instead of filesystem path
            userData.avatar = '/uploads/User_profile/' + req.file.filename
        }
        const data = await Update_Profile(userId, userData)
        return res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            data
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: error.message || 'Server error',
            success: false
        })
    }
}