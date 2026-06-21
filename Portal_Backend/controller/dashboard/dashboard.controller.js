import { getDashboardData, createActivity, createTask, toggleTask, createThread, sendMessage, createTicket } from '../../service/dashboard/dashboard.service.js'


export const getDashboard = async (req, res) => {
    try {
       
        const userId = req.user?._id || req.user?.id || null
        const data = await getDashboardData(userId)
        res.status(200).json({ success: true, data })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to load dashboard', success: false })
    }
}

export const addTask = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || null

        const { title, due, urgent } = req.body
        if (!title) return res.status(400).json({ message: 'Task title is required', success: false })

        const task = userId ? await createTask(userId, title, due || '', urgent || false) : { _id: 'new', title, due: due || '', urgent: urgent || false, done: false }

        if (userId) {
            await createActivity(userId, 'application', 'Task created', `New task: ${title}`)
        }

        res.status(201).json({ success: true, data: task })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}


export const toggleTaskDone = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || null
        if (!userId) return res.status(401).json({ message: 'Authentication required for this action', success: false })

        const task = await toggleTask(req.params.id, userId)
        res.status(200).json({ success: true, data: task })
    } catch (error) {
        res.status(404).json({ message: error.message, success: false })
    }
}


export const addThread = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || null
        if (!userId) return res.status(401).json({ message: 'Authentication required', success: false })

        const { name, role, subject, message } = req.body
        if (!name || !subject || !message) {
            return res.status(400).json({ message: 'Name, subject, and message are required', success: false })
        }

        const thread = await createThread(userId, name, role || '', subject, message)

        await createActivity(userId, 'message', 'New conversation started', subject)

        res.status(201).json({ success: true, data: thread })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}


export const addMessage = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || null
        if (!userId) return res.status(401).json({ message: 'Authentication required', success: false })

        const { body } = req.body
        if (!body) return res.status(400).json({ message: 'Message body is required', success: false })

        const thread = await sendMessage(req.params.id, userId, body)

        await createActivity(userId, 'message', 'Message sent', body.slice(0, 80))

        res.status(200).json({ success: true, data: thread })
    } catch (error) {
        res.status(404).json({ message: error.message, success: false })
    }
}


export const addTicket = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id || null
        if (!userId) return res.status(401).json({ message: 'Authentication required', success: false })

        const { subject } = req.body
        if (!subject) return res.status(400).json({ message: 'Ticket subject is required', success: false })

        const ticket = await createTicket(userId, subject)
        res.status(201).json({ success: true, data: ticket })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}