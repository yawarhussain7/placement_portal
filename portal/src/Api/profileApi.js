import api from './axios.js'

// Get profile data (requires auth token)
export const getProfile = async () => {
    return api.get('/profile/profile', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
    })
}

// Update profile with optional avatar upload
export const updateProfile = async (userId, formData) => {
    return api.put(`/profile/profile-update/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
    })
}