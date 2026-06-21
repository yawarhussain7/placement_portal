import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },
    type: {
        type: String,
        enum: ["document", "message", "application"],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    detail: {
        type: String,
        default: "",
        trim: true
    }
}, {
    timestamps: true
});

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    due: {
        type: String,
        default: ""
    },
    urgent: {
        type: Boolean,
        default: false
    },
    done: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const threadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: ""
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String,
        default: ""
    },
    unread: {
        type: Boolean,
        default: false
    },
    messages: [{
        from: { type: String, required: true },
        body: { type: String, required: true },
        own: { type: Boolean, default: false },
        time: { type: String, default: "" }
    }]
}, {
    timestamps: true
});

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open"
    }
}, {
    timestamps: true
});

const Activity = mongoose.model("DashboardActivity", activitySchema);
const Task = mongoose.model("DashboardTask", taskSchema);
const Thread = mongoose.model("DashboardThread", threadSchema);
const Ticket = mongoose.model("DashboardTicket", ticketSchema);

export { Activity, Task, Thread, Ticket };