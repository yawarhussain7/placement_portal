import api from './axios.js'

// Create a new application
export const createApplication = async (applicationData) => {
    return api.post('/application/create', applicationData)
}

// Get application by ID
export const getApplicationById = async (applicationId) => {
    return api.get(`/application/${applicationId}`)
}

// Get current user's applications
export const getMyApplications = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    
    return api.get(`/application/my-applications?${params.toString()}`)
}

// Update application
export const updateApplication = async (applicationId, updateData) => {
    return api.put(`/application/${applicationId}`, updateData)
}

// Update application status
export const updateApplicationStatus = async (applicationId, status, additionalData = {}) => {
    return api.put(`/application/${applicationId}/status`, { status, ...additionalData })
}

// Delete application
export const deleteApplication = async (applicationId) => {
    return api.delete(`/application/${applicationId}`)
}

// Get application statistics
export const getApplicationStats = async () => {
    return api.get('/application/stats')
}

// Upload document to application
export const uploadDocument = async (applicationId, documentType, formData) => {
    return api.post(`/application/${applicationId}/upload-document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

// Remove document from application
export const removeDocument = async (applicationId, documentType) => {
    return api.post(`/application/${applicationId}/remove-document`, { documentType })
}