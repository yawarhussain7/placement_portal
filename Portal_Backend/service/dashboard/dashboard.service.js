import { Activity, Task, Thread, Ticket } from '../../model/dashboard/dashboardActivity.model.js'
import { PersonalDetails, CourseDetails_Schema, PlacementDoc_Schema } from '../../model/newPlacement/PlacementSchema.modle.js'
import User from '../../model/auth/authUser.model.js'

const formatDate = (date) => {
    if (!date) return new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
    return new Date(date).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const getDashboardData = async (userId) => {
    const today = formatDate(new Date())

    // ── 1) Applications ──
    const applications = []
    try {
        const personalRecords = await PersonalDetails.find().sort({ createdAt: -1 }).limit(10).lean()
        for (const rec of personalRecords) {
            const courseRec = await CourseDetails_Schema.findOne({ _id: rec._id }).lean()
            applications.push({
                id: `WM-PL-${String(rec._id).slice(-4).toUpperCase()}`,
                role: courseRec?.course || 'Placement Application',
                company: courseRec?.rtoInstitution || 'Unknown Institution',
                status: 'Submitted',
                stage: 'Application',
                date: formatDate(rec.createdAt),
                advisor: 'Placement Team',
                progress: 28,
                notes: ''
            })
        }
    } catch {
       
    }
    if (applications.length === 0) {
        applications.push({
            id: 'WM-PL-1001',
            role: 'Placement Application',
            company: 'Pending Submission',
            status: 'Draft',
            stage: 'Draft',
            date: today,
            advisor: '—',
            progress: 12,
            notes: 'Complete the placement form to get started.'
        })
    }

    // ── 2) Documents (deduplicated by field id) ──
    const docMap = new Map()
    try {
        const docRecords = await PlacementDoc_Schema.find().sort({ createdAt: -1 }).lean()
        const fields = ['resume', 'photoId', 'studentId', 'transcript', 'certificates', 'additional']
        for (const doc of docRecords) {
            for (const field of fields) {
                if (doc[field] && !docMap.has(field)) {
                    docMap.set(field, {
                        id: field,
                        title: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
                        type: 'File',
                        status: 'Uploaded',
                        updated: formatDate(doc.createdAt),
                        fileName: doc[field].split('/').pop() || doc[field]
                    })
                }
            }
        }
    } catch {
        // ignore
    }
    const documents = docMap.size > 0
        ? Array.from(docMap.values())
        : [
            { id: 'resume', title: 'Resume / CV', type: 'PDF', status: 'Not Uploaded', updated: '—', fileName: '' },
            { id: 'photoId', title: 'Photo ID', type: 'PNG', status: 'Not Uploaded', updated: '—', fileName: '' },
            { id: 'transcript', title: 'Academic Transcript', type: 'PDF', status: 'Not Uploaded', updated: '—', fileName: '' }
        ]

    // ── 3) Activity ──
    const activityDocs = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(8).lean()
    const activity = activityDocs.length > 0
        ? activityDocs.map(a => ({ id: a._id.toString(), type: a.type, title: a.title, detail: a.detail }))
        : [{ id: '1', type: 'application', title: 'Welcome to WebMantis', detail: 'Your placement journey starts here.' }]

    // ── 4) Tasks ──
    const taskDocs = await Task.find({ userId }).sort({ createdAt: -1 }).limit(10).lean()
    const tasks = taskDocs.length > 0
        ? taskDocs.map(t => ({ id: t._id.toString(), title: t.title, due: t.due || 'No due date', urgent: t.urgent, done: t.done }))
        : [
            { id: '1', title: 'Complete your placement form', due: 'Due ' + today, urgent: true, done: false },
            { id: '2', title: 'Upload required documents', due: 'Recommended', urgent: false, done: false }
        ]

    // ── 5) Threads ──
    const threadDocs = await Thread.find({ userId }).sort({ updatedAt: -1 }).limit(10).lean()
    const threads = threadDocs.length > 0
        ? threadDocs.map(th => ({ id: th._id.toString(), name: th.name, role: th.role, subject: th.subject, time: th.time, unread: th.unread, messages: th.messages }))
        : []

    // ── 6) Tickets ──
    const ticketDocs = await Ticket.find({ userId }).sort({ createdAt: -1 }).limit(10).lean()
    const tickets = ticketDocs.length > 0
        ? ticketDocs.map(tk => ({ id: tk._id.toString(), subject: tk.subject, status: tk.status, date: formatDate(tk.createdAt) }))
        : []

    // ── 7) Account ──
    let account = { fullName: 'User', email: '', phone: '', region: 'Australia Placement Team', avatar: '', bio: '' }
    try {
        const user = await User.findById(userId).lean()
        if (user) {
            account = { id: user._id.toString(), fullName: user.username || 'User', email: user.email || '', phone: user.phone || '', region: 'Australia Placement Team', avatar: user.avatar || '', bio: user.bio || '' }
        }
    } catch {
        // keep default
    }

    return { account, applications, documents, threads, tasks, tickets, activity }
}


export const createActivity = async (userId, type, title, detail) => {
    return Activity.create({ userId, type, title, detail })
}


export const createTask = async (userId, title, due = '', urgent = false) => {
    return Task.create({ userId, title, due, urgent, done: false })
}


export const toggleTask = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, userId })
    if (!task) throw new Error('Task not found')
    task.done = !task.done
    await task.save()
    return task
}


export const createThread = async (userId, name, role, subject, message) => {
    return Thread.create({
        userId, name, role, subject,
        time: 'Just now',
        unread: false,
        messages: [{ from: 'You', body: message, own: true, time: 'Just now' }]
    })
}


export const sendMessage = async (threadId, userId, body) => {
    const thread = await Thread.findOne({ _id: threadId, userId })
    if (!thread) throw new Error('Thread not found')
    thread.messages.push({ from: 'You', body, own: true, time: 'Just now' })
    thread.time = 'Just now'
    thread.unread = false
    await thread.save()
    return thread
}


export const createTicket = async (userId, subject) => {
    return Ticket.create({ userId, subject, status: 'Open' })
}