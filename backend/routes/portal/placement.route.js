import express from 'express'
import {
  createPlacementController,
  getPlacementByIdController,
  getMyPlacementsController,
  updatePlacementController,
  submitPlacementController,
  deletePlacementController,
  uploadDocumentController,
  removeDocumentController
} from '../../controller/portal/placement.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { upload } from '../../middleware/doc.middleware.js'


const route = express.Router()

// Student placement routes
route.post('/create', authMiddleware, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'photoId', maxCount: 1 },
  { name: 'studentId', maxCount: 1 },
  { name: 'transcript', maxCount: 1 },
  { name: 'certificates', maxCount: 1 },
  { name: 'additional', maxCount: 1 }
]), createPlacementController)
route.get('/my-placements', authMiddleware, getMyPlacementsController)
route.get('/:placementId', authMiddleware, getPlacementByIdController)
route.put('/:placementId', authMiddleware, updatePlacementController)
route.post('/:placementId/submit', authMiddleware, submitPlacementController)
route.delete('/:placementId', authMiddleware, deletePlacementController)
route.post('/:placementId/upload-document', authMiddleware, upload.single('document'), uploadDocumentController)
route.post('/:placementId/remove-document', authMiddleware, removeDocumentController)

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
