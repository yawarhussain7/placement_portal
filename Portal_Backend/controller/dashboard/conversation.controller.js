import Conversation from '../../model/dashboard/conversation.model.js'
import User from '../../model/auth/authUser.model.js'
import { emitNewMessage, emitNewConversation } from '../../socket/socketServer.js'

const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// ─── Create or get existing conversation ──────────────────────────────────────
export const createOrGetConversation = async (req, res) => {
    try {
        const currentUserId = req.user?.id || req.user?._id
        if (!currentUserId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }

        const { participantId, subject } = req.body
        if (!participantId) {
            return res.status(400).json({ message: 'Participant ID is required', success: false })
        }

        // Check if conversation already exists between these two users
        const existing = await Conversation.findOne({
            participants: { $all: [currentUserId, participantId], $size: 2 }
        }).lean()

        if (existing) {
            return res.status(200).json({ success: true, data: existing, existing: true })
        }

        // Get participant names
        const currentUser = await User.findById(currentUserId).select('username').lean()
        const participant = await User.findById(participantId).select('username').lean()

        if (!participant) {
            return res.status(404).json({ message: 'Participant not found', success: false })
        }

        const conversation = await Conversation.create({
            participants: [currentUserId, participantId],
            participantNames: {
                [currentUserId?.toString()]: currentUser?.username || 'You',
                [participantId?.toString()]: participant?.username || 'Unknown'
            },
            subject: subject || `Chat with ${participant.username}`,
            lastActivity: new Date()
        })

        // Emit socket event to notify the other user
        try {
            emitNewConversation(conversation.toObject(), currentUserId)
        } catch (e) {
            console.warn('[Socket] Failed to emit new_conversation:', e.message)
        }

        res.status(201).json({ success: true, data: conversation.toObject(), existing: false })
    } catch (error) {
        console.error('Create conversation error:', error.message)
        res.status(500).json({ message: error.message || 'Failed to create conversation', success: false })
    }
}

// ─── Get user's conversations ─────────────────────────────────────────────────
export const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user?.id || req.user?._id
        if (!currentUserId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }

        const conversations = await Conversation.find({
            participants: currentUserId
        })
            .sort({ lastActivity: -1 })
            .lean()

        // Format for frontend
        const formatted = conversations.map((conv) => {
            const otherParticipantId = conv.participants.find(
                (p) => p.toString() !== currentUserId.toString()
            )
            const otherName = conv.participantNames?.[otherParticipantId?.toString()] || 'Unknown User'
            const lastMsg = conv.messages?.[conv.messages.length - 1]

            return {
                id: conv._id.toString(),
                name: otherName,
                role: 'Registered User',
                subject: conv.subject || 'New conversation',
                time: lastMsg?.time || 'Just now',
                unread: false,
                messages: (conv.messages || []).map((msg) => ({
                    from: msg.from,
                    body: msg.body,
                    own: msg.fromUserId?.toString() === currentUserId.toString(),
                    time: msg.time || '',
                })),
            }
        })

        res.status(200).json({ success: true, data: formatted })
    } catch (error) {
        console.error('Get conversations error:', error.message)
        res.status(500).json({ message: error.message || 'Failed to load conversations', success: false })
    }
}

// ─── Send a message ───────────────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
    try {
        const currentUserId = req.user?.id || req.user?._id
        if (!currentUserId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }

        const { conversationId } = req.params
        const { body } = req.body

        if (!body || !body.trim()) {
            return res.status(400).json({ message: 'Message body is required', success: false })
        }

        const currentUser = await User.findById(currentUserId).select('username').lean()
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found', success: false })
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: currentUserId
        })

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found', success: false })
        }

        const message = {
            from: currentUser.username,
            fromUserId: currentUserId,
            body: body.trim(),
            time: formatTime(),
        }

        conversation.messages.push(message)
        conversation.lastMessage = body.trim()
        conversation.lastActivity = new Date()
        await conversation.save()

        // Emit socket event to the other participant(s) in real-time
        try {
            emitNewMessage(
                conversation._id,
                conversation.participants,
                {
                    from: currentUser.username,
                    body: body.trim(),
                    own: false,
                    time: message.time,
                },
                currentUserId
            )
        } catch (e) {
            console.warn('[Socket] Failed to emit new_message:', e.message)
        }

        res.status(200).json({
            success: true,
            data: {
                from: message.from,
                body: message.body,
                own: true,
                time: message.time,
            }
        })
    } catch (error) {
        console.error('Send message error:', error.message)
        res.status(500).json({ message: error.message || 'Failed to send message', success: false })
    }
}