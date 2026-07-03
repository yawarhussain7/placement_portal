import { listDocuments, uploadDocument, replaceDocument, deleteDocument, downloadDocument } from '../../service/document/document.service.js'

/**
 * GET /documents
 * List all documents for the logged-in user.
 */
export const getDocuments = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }
        const documents = await listDocuments(userId)
        return res.status(200).json({ success: true, data: documents })
    } catch (error) {
        console.error('Get documents error:', error.message)
        return res.status(500).json({ message: error.message || 'Failed to fetch documents', success: false })
    }
}

/**
 * POST /documents/upload
 * Upload a new document.
 */
export const uploadNewDocument = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file provided', success: false })
        }

        const { title, description } = req.body
        const doc = await uploadDocument(userId, req.file, title, description)
        return res.status(201).json({ success: true, data: doc, message: 'Document uploaded successfully' })
    } catch (error) {
        console.error('Upload document error:', error.message)
        return res.status(500).json({ message: error.message || 'Failed to upload document', success: false })
    }
}

/**
 * PUT /documents/:id/replace
 * Replace an existing document with a new file.
 */
export const replaceExistingDocument = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file provided', success: false })
        }

        const doc = await replaceDocument(req.params.id, userId, req.file)
        return res.status(200).json({ success: true, data: doc, message: 'Document replaced successfully' })
    } catch (error) {
        console.error('Replace document error:', error.message)
        if (error.message === 'Document not found') {
            return res.status(404).json({ message: error.message, success: false })
        }
        return res.status(500).json({ message: error.message || 'Failed to replace document', success: false })
    }
}

/**
 * DELETE /documents/:id
 * Delete a document.
 */
export const removeDocument = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }

        const result = await deleteDocument(req.params.id, userId)
        return res.status(200).json({ success: true, ...result })
    } catch (error) {
        console.error('Delete document error:', error.message)
        if (error.message === 'Document not found') {
            return res.status(404).json({ message: error.message, success: false })
        }
        return res.status(500).json({ message: error.message || 'Failed to delete document', success: false })
    }
}

/**
 * GET /documents/:id/download
 * Download a document file.
 */
export const downloadExistingDocument = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }

        const { filePath, fileName } = await downloadDocument(req.params.id, userId)

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)
        res.setHeader('Content-Type', 'application/octet-stream')

        // Stream the file
        return res.sendFile(filePath)
    } catch (error) {
        console.error('Download document error:', error.message)
        if (error.message === 'Document not found' || error.message === 'File not found on disk' || error.message === 'File path not found') {
            return res.status(404).json({ message: error.message, success: false })
        }
        return res.status(500).json({ message: error.message || 'Failed to download document', success: false })
    }
}