import express from 'express'
import { AdminAuthMiddleware } from '../../middleware/admin.middleware.js'
import {
    getAllApplicationsController,
    getApplicationByIdController,
    updateApplicationStatusController
} from '../../controller/admin/application.controller.js'

const route = express.Router()

// All application routes require admin authentication
route.use(AdminAuthMiddleware)

// Get all applications with filters
route.get('/', getAllApplicationsController)

// Get single application by ID
route.get('/:id', getApplicationByIdController)

// Update application status
route.patch('/:id/status', updateApplicationStatusController)

export default route