import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/dbconfig.js'
import { verifyToken } from './middleware/auth.middleware.js'
import { initSocketServer } from './socket/socketServer.js'

dotenv.config()

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
const allowedOrigins = [
    'http://localhost:5172',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000'
]
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))
app.use(cookieParser())

const server = http.createServer(app)
initSocketServer(server)

import AuthRoute from './routes/User.route.js'
import UserProfile_Route from './routes/UserProfile.route.js'
import Placement_Submit_Route from './routes/newPlacement/placement_submit.route.js'
import Dashboard_Route from './routes/dashboard/dashboard.route.js'
import Users_Route from './routes/dashboard/users.route.js'
import Conversation_Route from './routes/dashboard/conversation.route.js'
import Document_Route from './routes/document.route.js'
import studentRoutes from './routes/students.route.js'
import AdminAuthRoute from './routes/admin/auth.route.js'
import AdminDashboardRoute from './routes/admin/dashboard.route.js'
connectDB()

app.get('/test', (req, res) => {
    res.send("Hello world")
})

// upload files
app.use('/uploads', express.static('uploads'))

// auth route (public)
app.use('/auth', AuthRoute)
// admin routes
app.use('/admin/auth', AdminAuthRoute)
app.use('/admin', verifyToken, AdminDashboardRoute)
// profile routes (protected)
app.use('/profile', verifyToken, UserProfile_Route)
app.use('/new-placement', verifyToken, Placement_Submit_Route)
app.use('/dashboard', verifyToken, Dashboard_Route)
app.use('/documents', verifyToken, Document_Route)
app.use('/users', verifyToken, Users_Route)
app.use('/conversations', verifyToken, Conversation_Route)
app.use("/api/students", studentRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found`, success: false });
})

server.listen(PORT, ()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`)
})
