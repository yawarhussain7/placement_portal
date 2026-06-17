import api from './axios.js'

export const getDashboardData = async () => {
    return api.get('/dashboard')
}

export const createTask = async (title, due = '', urgent = false) => {
    return api.post('/dashboard/task', { title, due, urgent })
}

export const toggleTask = async (taskId) => {
    return api.patch(`/dashboard/task/${taskId}/toggle`)
}

export const createThread = async (name, subject, message, role = '') => {
    return api.post('/dashboard/thread', { name, role, subject, message })
}

export const sendMessage = async (threadId, body) => {
    return api.post(`/dashboard/thread/${threadId}/message`, { body })
}

export const createTicket = async (subject) => {
    return api.post('/dashboard/ticket', { subject })
}