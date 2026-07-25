import express from 'express'
import {
  uploadDocumentController,
  getDocumentByIdController,
  getMyDocumentsController,
  getLatestDocumentsController,
  updateDocumentController,
  updateDocumentVersionController,
  deleteDocumentController,
  verifyDocumentController,
  unverifyDocumentController,
  downloadDocumentController,
  getDocumentStatsController,
  searchDocumentsController,
  getAllDocumentsController
} from '../../controller/portal/document.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { upload } from '../../middleware/doc.middleware.js'

const route = express.Router()

// Document routes
route.post('/upload', authMiddleware, upload.single('document'), uploadDocumentController)
route.get('/my-documents', authMiddleware, getMyDocumentsController)
route.get('/latest', authMiddleware, getLatestDocumentsController)
route.get('/stats', authMiddleware, getDocumentStatsController)
route.get('/search', authMiddleware, searchDocumentsController)
route.get('/:documentId', authMiddleware, getDocumentByIdController)
route.put('/:documentId', authMiddleware, updateDocumentController)
route.put('/:documentId/version', authMiddleware, upload.single('document'), updateDocumentVersionController)
route.delete('/:documentId', authMiddleware, deleteDocumentController)
route.post('/:documentId/verify', authMiddleware, verifyDocumentController)
route.post('/:documentId/unverify', authMiddleware, unverifyDocumentController)
route.post('/:documentId/download', authMiddleware, downloadDocumentController)

// Admin routes
route.get('/all', getAllDocumentsController)

// Error handling middleware for multer file uploads - must be after all routes
route.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file upload format'
    })
  }
  
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB'
    })
  }
  
  console.error('Upload error:', error)
  return res.status(500).json({
    success: false,
    message: 'File upload failed: ' + error.message
  })
})

export default route