import api from './axios.js'

// Get profile data (uses cookie-based auth)
export const getProfile = async () => {
    return api.get('/api/student/profile')
}

// Update profile with optional avatar upload
export const updateProfile = async (formData) => {
    return api.put('/api/student/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// Helper to get full avatar URL
export const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null
    if (avatarPath.startsWith('http')) return avatarPath
    // Convert relative path to full URL
    return `http://localhost:8000${avatarPath}`
}
