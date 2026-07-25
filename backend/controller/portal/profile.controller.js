import { getProfileService, updateProfileService } from '../../services/portal/profile.service.js'
import { uploadAvatar } from '../../middleware/upload.middleware.js'

// Get user profile
export const getProfileController = async(req, res) => {
    try {
        const userId = req.userId
        const user = await getProfileService({id: userId})
        
        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            data: user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch profile'
        })
    }
}

// Update user profile
export const updateProfileController = async(req, res) => {
    try {
        const userId = req.userId
        const { fullName, email, username, bio, website, password, phone, gender, dateOfBirth } = req.body
        
        const data = {
            fullName,
            email,
            username,
            bio,
            website,
            password,
            phone,
            gender,
            dateOfBirth
        }

        // Handle avatar upload
        if (req.file) {
          const avatarUrl = `/uploads/avatars/${req.file.filename}`
          data.avatar = avatarUrl
        }

        const updatedUser = await updateProfileService({id: userId, data})
        
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Failed to update profile'
        })
    }
}
