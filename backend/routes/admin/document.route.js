import express from 'express'
import { AdminAuthMiddleware } from '../../middleware/admin.middleware.js'
import { 
    getAllDocumentsController,
    getDocumentByIdController,
    verifyDocumentController,
    rejectDocumentController,
    downloadDocumentController
} from '../../controller/admin/document.controller.js'

const route = express.Router()

// All document routes require admin authentication
route.use(AdminAuthMiddleware)

// Get all documents with statistics
route.get('/', getAllDocumentsController)

// Get single document by ID
route.get('/:documentId', getDocumentByIdController)

// Verify document
route.post('/:documentId/verify', verifyDocumentController)

// Reject document
route.post('/:documentId/reject', rejectDocumentController)

// Download document
route.get('/:documentId/download', downloadDocumentController)

export default route
