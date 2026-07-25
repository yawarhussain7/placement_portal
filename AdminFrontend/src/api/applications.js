import api from './api.js'

export const getApplications = async (filters = {}) => {
    try {
        const params = new URLSearchParams()
        
        if (filters.status) params.append('status', filters.status)
        if (filters.search) params.append('search', filters.search)
        if (filters.page) params.append('page', filters.page)
        if (filters.limit) params.append('limit', filters.limit)
        
        const response = await api.get(`/admin/applications?${params.toString()}`)
        return response.data
    } catch (error) {
        console.error('Error fetching applications:', error)
        throw error
    }
}

export const getApplicationById = async (id) => {
    try {
        const response = await api.get(`/admin/applications/${id}`)
        return response.data
    } catch (error) {
        console.error('Error fetching application by ID:', error)
        throw error
    }
}

export const updateApplicationStatus = async (id, status) => {
    try {
        const response = await api.patch(`/admin/applications/${id}/status`, { status })
        return response.data
    } catch (error) {
        console.error('Error updating application status:', error)
        throw error
    }
}