import express from 'express'
import { AdminAuthMiddleware } from '../../middleware/admin.middleware.js'
import { 
    getAllPlacementsController,
    getPlacementByIdController,
    updatePlacementController,
    verifyDocumentController,
    rejectDocumentController,
    deletePlacementController
} from '../../controller/admin/placementData.controller.js'

const route = express.Router()

// All placement routes require admin authentication
route.use(AdminAuthMiddleware)

// Get all placements
route.get('/', getAllPlacementsController)

// Get single placement by ID
route.get('/:id', getPlacementByIdController)

// Update placement fields
route.put('/:id', updatePlacementController)

// Verify document
route.post('/:id/verify/:docId', verifyDocumentController)

// Reject document
route.post('/:id/reject/:docId', rejectDocumentController)

// Delete placement
route.delete('/delete-placement/:id', deletePlacementController)

export default route
