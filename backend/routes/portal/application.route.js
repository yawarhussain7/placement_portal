import express from 'express'
import {
  createApplicationController,
  getApplicationByIdController,
  getMyApplicationsController,
  updateApplicationController,
  updateApplicationStatusController,
  deleteApplicationController,
  getApplicationStatsController,
  uploadDocumentController,
  removeDocumentController
} from '../../controller/portal/application.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { upload } from '../../middleware/doc.middleware.js'

const route = express.Router()

// Application routes
route.post('/create', authMiddleware, createApplicationController)
route.get('/my-applications', authMiddleware, getMyApplicationsController)
route.get('/stats', authMiddleware, getApplicationStatsController)
route.get('/:applicationId', authMiddleware, getApplicationByIdController)
route.put('/:applicationId', authMiddleware, updateApplicationController)
route.put('/:applicationId/status', authMiddleware, updateApplicationStatusController)
route.delete('/:applicationId', authMiddleware, deleteApplicationController)
route.post('/:applicationId/upload-document', authMiddleware, upload.single('document'), uploadDocumentController)
route.post('/:applicationId/remove-document', authMiddleware, removeDocumentController)

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
