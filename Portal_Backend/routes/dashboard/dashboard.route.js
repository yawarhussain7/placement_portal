import { Router } from 'express'
import { getDashboard, addTask, toggleTaskDone, addThread, addMessage, addTicket } from '../../controller/dashboard/dashboard.controller.js'

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

export default router