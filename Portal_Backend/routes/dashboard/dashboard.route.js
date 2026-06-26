import { Router } from 'express'
import { getDashboard, addTask, toggleTaskDone, addThread, addMessage, addTicket, getAdminStats, getAdminStudents, getAdminDocuments } from '../../controller/dashboard/dashboard.controller.js'

const router = Router()

// Dashboard data
router.get('/', getDashboard)

// Tasks
router.post('/task', addTask)
router.patch('/task/:id/toggle', toggleTaskDone)

// Threads / Messages
router.post('/thread', addThread)
router.post('/thread/:id/message', addMessage)

// Tickets
router.post('/ticket', addTicket)

// Admin analytics & data endpoints
router.get('/admin/stats', getAdminStats)
router.get('/admin/students', getAdminStudents)
router.get('/admin/documents', getAdminDocuments)

export default router