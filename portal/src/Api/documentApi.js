import api from './axios'

export const getDocuments = async () => {
    return api.get('/documents')
}

/**
 * Upload a new document.
 * @param {File} file - The file to upload
 * @param {string} [title] - Optional title for the document
 * @param {string} [description] - Optional description
 */
export const uploadDocument = async (file, title = '', description = '') => {
    const formData = new FormData()
    formData.append('file', file)
    if (title) formData.append('title', title)
    if (description) formData.append('description', description)
    return api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

/**
 * Replace an existing document with a new file.
 * @param {string} documentId - The document ID to replace
 * @param {File} file - The new file
 */
export const replaceDocument = async (documentId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.put(`/documents/${documentId}/replace`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

/**
 * Delete a document.
 * @param {string} documentId - The document ID to delete
 */
export const deleteDocument = async (documentId) => {
    return api.delete(`/documents/${documentId}`)
}

/**
 * Download a document.
 * @param {string} documentId - The document ID to download
 */
export const downloadDocument = async (documentId) => {
    const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
    })
    return response
}