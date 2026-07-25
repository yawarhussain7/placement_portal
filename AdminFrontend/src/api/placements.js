import api from './api.js'

export const getPlacements = async (filters = {}) => {
    try {
        const params = new URLSearchParams()
        
        if (filters.search) params.append('search', filters.search)
        if (filters.page) params.append('page', filters.page)
        if (filters.limit) params.append('limit', filters.limit || 15)
        
        const response = await api.get(`/admin/placements?${params.toString()}`)
        return response.data
    } catch (error) {
        console.error('Error fetching placements:', error)
        throw error
    }
}

export const getPlacementById = async (id) => {
    try {
        const response = await api.get(`/admin/placements/${id}`)
        return response.data
    } catch (error) {
        console.error('Error fetching placement by ID:', error)
        throw error
    }
}

export const updatePlacementField = async (id, section, field, value) => {
    try {
        const response = await api.put(`/admin/placements/${id}`, {
            section,
            field,
            value
        })
        return response.data
    } catch (error) {
        console.error('Error updating placement field:', error)
        throw error
    }
}

export const verifyDocument = async (id, docId) => {
    try {
        const response = await api.post(`/admin/placements/${id}/verify/${docId}`)
        return response.data
    } catch (error) {
        console.error('Error verifying document:', error)
        throw error
    }
}

export const rejectDocument = async (id, docId) => {
    try {
        const response = await api.post(`/admin/placements/${id}/reject/${docId}`)
        return response.data
    } catch (error) {
        console.error('Error rejecting document:', error)
        throw error
    }
}

export const deletePlacement = async (id) => {
    try {
        const response = await api.delete(`/admin/placements/delete-placement/${id}`)
        return response.data
    } catch (error) {
        console.error('Error deleting placement:', error)
        throw error
    }
}
