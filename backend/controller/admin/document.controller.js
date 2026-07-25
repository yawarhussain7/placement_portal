import {
    getAllDocumentService,
    SelectedDocumentService,
    verifyDocumentService,
    rejectDocumentService
} from '../../services/admin/documents.service.js'
import fs from 'fs'
import path from 'path'

// Get all documents with statistics
export const getAllDocumentsController = async (req, res) => {
    try {
        console.log('Fetching all documents...')
        const documents = await getAllDocumentService()
        console.log(`Found ${documents.length} documents`)
        
        // Calculate statistics
        const totalDocuments = documents.length
        const verified = documents.filter(doc => doc.isVerified === true).length
        const pending = documents.filter(doc => doc.isVerified === false).length
        
        res.status(200).json({
            success: true,
            data: {
                totalDocuments,
                totalVerified: verified,
                totalPending: pending,
                totalRejected: 0,
                documents
            }
        })
    } catch (error) {
        console.error('Error in getAllDocumentsController:', error)
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch documents'
        })
    }
}

// Get single document by ID
export const getDocumentByIdController = async (req, res) => {
    try {
        const { documentId } = req.params
        
        const document = await SelectedDocumentService({ file_id: documentId })
        
        res.status(200).json({
            success: true,
            data: document
        })
    } catch (error) {
        const statusCode = error.message === 'File not found' ? 404 : 500
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to fetch document'
        })
    }
}

// Verify document
export const verifyDocumentController = async (req, res) => {
    try {
        const { documentId } = req.params
        const adminId = req.adminId
        
        console.log('Verify document - documentId:', documentId, 'type:', typeof documentId, 'adminId:', adminId)
        
        if (!documentId || documentId === 'undefined' || documentId === 'null') {
            console.error('Invalid documentId received:', documentId)
            return res.status(400).json({
                success: false,
                message: 'Invalid document ID provided'
            })
        }
        
        const document = await verifyDocumentService(documentId, adminId)
        
        res.status(200).json({
            success: true,
            data: document,
            message: 'Document verified successfully'
        })
    } catch (error) {
        console.error('Error in verifyDocumentController:', error)
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to verify document'
        })
    }
}

// Reject document
export const rejectDocumentController = async (req, res) => {
    try {
        const { documentId } = req.params
        const adminId = req.adminId
        
        console.log('Reject document - documentId:', documentId, 'type:', typeof documentId, 'adminId:', adminId)
        
        if (!documentId || documentId === 'undefined' || documentId === 'null') {
            console.error('Invalid documentId received:', documentId)
            return res.status(400).json({
                success: false,
                message: 'Invalid document ID provided'
            })
        }
        
        const document = await rejectDocumentService(documentId, adminId)
        
        res.status(200).json({
            success: true,
            data: document,
            message: 'Document rejected successfully'
        })
    } catch (error) {
        console.error('Error in rejectDocumentController:', error)
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reject document'
        })
    }
}

// Download document
export const downloadDocumentController = async (req, res) => {
    try {
        const { documentId } = req.params
        
        const document = await SelectedDocumentService({ file_id: documentId })
        
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            })
        }
        
        // Extract filename from fileUrl (e.g., /uploads/filename.pdf -> filename.pdf)
        const fileName = path.basename(document.fileUrl)
        
        // Construct the full file path - files are stored in backend/upload directory
        const filePath = path.join(process.cwd(), 'upload', fileName)
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            message: 'File not found on server'
        })
        }
        
        // Set headers for file download
        res.setHeader('Content-Type', document.fileType)
        res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`)
        res.setHeader('Content-Length', document.fileSize)
        
        // Stream the file
        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to download document'
        })
    }
}
