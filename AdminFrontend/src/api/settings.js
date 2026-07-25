import api from './api.js'

export const getProfile = async () => {
    try {
        const response = await api.get('/profile')
        return response.data
    } catch (error) {
        console.error('Error fetching profile:', error)
        throw error
    }
}

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/profile', profileData)
        return response.data
    } catch (error) {
        console.error('Error updating profile:', error)
        throw error
    }
}

export const updateNotifications = async (notificationSettings) => {
    try {
        const response = await api.put('/profile/notifications', notificationSettings)
        return response.data
    } catch (error) {
        console.error('Error updating notifications:', error)
        throw error
    }
}

export const updateSecurity = async (securityData) => {
    try {
        const response = await api.put('/profile/security', securityData)
        return response.data
    } catch (error) {
        console.error('Error updating security:', error)
        throw error
    }
}

export const updateAppearance = async (appearanceData) => {
    try {
        const response = await api.put('/profile/appearance', appearanceData)
        return response.data
    } catch (error) {
        console.error('Error updating appearance:', error)
        throw error
    }
}