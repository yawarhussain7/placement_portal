import api from './axios.js'

// Upload a new document
export const uploadDocument = async (formData) => {
    return api.post('/document/upload', formData)
}

// Get document by ID
export const getDocumentById = async (documentId) => {
    return api.get(`/document/${documentId}`)
}

// Get my documents
export const getMyDocuments = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.documentType) params.append('documentType', filters.documentType)
    if (filters.isVerified !== undefined) params.append('isVerified', filters.isVerified)
    if (filters.placementId) params.append('placementId', filters.placementId)
    if (filters.applicationId) params.append('applicationId', filters.applicationId)
    
    return api.get(`/document/my-documents?${params.toString()}`)
}

// Get latest documents
export const getLatestDocuments = async (documentType = null) => {
    const params = new URLSearchParams()
    if (documentType) params.append('documentType', documentType)
    
    return api.get(`/document/latest?${params.toString()}`)
}

// Update document metadata
export const updateDocument = async (documentId, updateData) => {
    return api.put(`/document/${documentId}`, updateData)
}

// Update document version (upload new version)
export const updateDocumentVersion = async (documentId, formData) => {
    return api.put(`/document/${documentId}/version`, formData)
}

// Delete document
export const deleteDocument = async (documentId) => {
    return api.delete(`/document/${documentId}`)
}

// Verify document
export const verifyDocument = async (documentId) => {
    return api.post(`/document/${documentId}/verify`)
}

// Unverify document
export const unverifyDocument = async (documentId) => {
    return api.post(`/document/${documentId}/unverify`)
}

// Download document
export const downloadDocument = async (documentId) => {
    return api.post(`/document/${documentId}/download`)
}

// Get document statistics
export const getDocumentStats = async () => {
    return api.get('/document/stats')
}

// Search documents
export const searchDocuments = async (query) => {
    return api.get(`/document/search?query=${encodeURIComponent(query)}`)
}

// Get all documents (admin)
export const getAllDocuments = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.documentType) params.append('documentType', filters.documentType)
    if (filters.isVerified !== undefined) params.append('isVerified', filters.isVerified)
    if (filters.userId) params.append('userId', filters.userId)
    
    return api.get(`/document/all?${params.toString()}`)
}