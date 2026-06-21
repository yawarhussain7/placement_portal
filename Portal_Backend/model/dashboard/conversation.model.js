import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    }],
    participantNames: {
        type: Map,
        of: String,
        default: {}
    },
    subject: {
        type: String,
        default: "New conversation"
    },
    lastMessage: {
        type: String,
        default: ""
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    messages: [messageSchema]
}, {
    timestamps: true
})

// Index for fast participant lookup
conversationSchema.index({ participants: 1 })
conversationSchema.index({ lastActivity: -1 })

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation