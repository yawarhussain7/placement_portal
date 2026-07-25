import api from './api.js'

export const getDocuments = async ()=>{
    return await api.get('/admin/documents')
}

export const getDocumentById = async (documentId) => {
    return await api.get(`/admin/documents/${documentId}`)
}

export const verifyDocument = async (documentId) => {
    console.log('API: Verifying document:', documentId)
    try {
        const response = await api.post(`/admin/documents/${documentId}/verify`)
        console.log('API: Verify response:', response.data)
        return response
    } catch (error) {
        console.error('API: Verify error:', error)
        throw error
    }
}

export const rejectDocument = async (documentId) => {
    console.log('API: Rejecting document:', documentId)
    try {
        const response = await api.post(`/admin/documents/${documentId}/reject`)
        console.log('API: Reject response:', response.data)
        return response
    } catch (error) {
        console.error('API: Reject error:', error)
        throw error
    }
}

export const downloadDocument = async (documentId) => {
    // Create a link to trigger download
    const link = document.createElement('a')
    link.href = `${api.defaults.baseURL}/admin/documents/${documentId}/download`
    link.download = ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return { success: true, message: 'Download initiated' }
}
