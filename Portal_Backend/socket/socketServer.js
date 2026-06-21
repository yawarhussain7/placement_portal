import { Server } from 'socket.io'

let io = null

export const initSocketServer = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        },
    })

    io.use((socket, next) => {
        // Extract userId from handshake auth or query
        const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId
        if (userId) {
            socket.userId = userId
            // Join a personal room so we can send messages directly to this user
            socket.join(`user:${userId}`)
        }
        next()
    })

    io.on('connection', (socket) => {
        console.log(`[Socket] User connected: ${socket.userId || 'anonymous'} (${socket.id})`)

        socket.on('disconnect', () => {
            console.log(`[Socket] User disconnected: ${socket.userId || 'anonymous'} (${socket.id})`)
        })
    })

    console.log('[Socket] Socket.IO server initialized')
    return io
}

export const getIO = () => {
    if (!io) throw new Error('Socket.IO not initialized')
    return io
}

// Emit a new message event to all participants in a conversation
export const emitNewMessage = (conversationId, participants, message, senderId) => {
    if (!io) return
    participants.forEach((participantId) => {
        const pid = participantId?.toString?.() || participantId
        if (pid !== senderId?.toString?.()) {
            io.to(`user:${pid}`).emit('new_message', {
                conversationId: conversationId?.toString?.() || conversationId,
                message,
            })
        }
    })
}

// Emit a new conversation event to the other participant
export const emitNewConversation = (conversation, currentUserId) => {
    if (!io) return
    const otherParticipantId = conversation.participants?.find(
        (p) => p.toString() !== currentUserId.toString()
    )
    if (otherParticipantId) {
        io.to(`user:${otherParticipantId.toString()}`).emit('new_conversation', {
            conversation: {
                id: conversation._id?.toString() || conversation.id,
                name: conversation.participantNames?.[currentUserId.toString()] || 'User',
                role: 'Registered User',
                subject: conversation.subject || 'New conversation',
                time: 'Just now',
                unread: true,
                messages: [],
            }
        })
    }
}