import { Router } from 'express'
import { createOrGetConversation, getConversations, sendMessage } from '../../controller/dashboard/conversation.controller.js'

const router = Router()

// GET /conversations — list all conversations for the current user
router.get('/', getConversations)

// POST /conversations — create or get existing conversation
router.post('/', createOrGetConversation)

// POST /conversations/:conversationId/message — send a message
router.post('/:conversationId/message', sendMessage)

export default router