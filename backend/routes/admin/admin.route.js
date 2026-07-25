import express from 'express'
import { AdminAuthMiddleware } from '../../middleware/admin.middleware.js'
import {AdminDashboardController} from '../../controller/admin/dashboard.controller.js'
import { verifyAdminController } from '../../controller/admin/verify.controller.js'
import studentRoute from './studentData.route.js'
import placementRoute from './placementData.route.js'
import applicationRoute from './application.route.js'
import documentRoute from './document.route.js'

const route = express.Router()

// Verify admin route - uses middleware to verify admin authentication
route.get('/auth/verify', AdminAuthMiddleware, verifyAdminController)

// Protected admin routes
route.get('/dashboard', AdminAuthMiddleware, AdminDashboardController)

// Student routes
route.use('/students', AdminAuthMiddleware, studentRoute)

// Placement routes
route.use('/placements', AdminAuthMiddleware, placementRoute)

// Application routes
route.use('/applications', AdminAuthMiddleware, applicationRoute)

// Document routes
route.use('/documents', AdminAuthMiddleware, documentRoute)

export default route
