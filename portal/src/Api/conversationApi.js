import api from './axios.js'

export const getConversations = async () => {
    return api.get('/conversations')
}

export const createOrGetConversation = async (participantId, subject = '') => {
    return api.post('/conversations', { participantId, subject })
}

export const sendMessage = async (conversationId, body) => {
    return api.post(`/conversations/${conversationId}/message`, { body })
}