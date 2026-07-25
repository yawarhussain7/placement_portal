import api from './axios.js'

// Create a new placement application
export const createPlacement = async (placementData) => {
    return api.post('/placement/create', placementData)
}

// Get all placements (admin only)
export const getAllPlacements = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.userId) params.append('userId', filters.userId)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    
    return api.get(`/placement?${params.toString()}`)
}

// Get placement by ID
export const getPlacementById = async (placementId) => {
    return api.get(`/placement/${placementId}`)
}

// Get current user's placements
export const getMyPlacements = async () => {
    return api.get('/placement/my-placements')
}

// Update placement
export const updatePlacement = async (placementId, updateData) => {
    return api.put(`/placement/${placementId}`, updateData)
}

// Submit placement for review
export const submitPlacement = async (placementId) => {
    return api.post(`/placement/${placementId}/submit`)
}

// Update placement status (admin only)
export const updatePlacementStatus = async (placementId, status, reviewNotes = '') => {
    return api.patch(`/placement/${placementId}/status`, { status, reviewNotes })
}

// Delete placement
export const deletePlacement = async (placementId) => {
    return api.delete(`/placement/${placementId}`)
}

// Get placement statistics (admin only)
export const getPlacementStats = async () => {
    return api.get('/placement/stats/overview')
}

// Upload document to placement
export const uploadDocument = async (placementId, documentType, formData) => {
    return api.post(`/placement/${placementId}/upload-document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

// Remove document from placement
export const removeDocument = async (placementId, documentType) => {
    return api.post(`/placement/${placementId}/remove-document`, { documentType })
}