import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.config.js'
import cookieParser from 'cookie-parser'

import route from './routes/auth.route.js'
import placementRoute from './routes/portal/placement.route.js'
import profileRoute from './routes/portal/profile.route.js'
import applicationRoute from './routes/portal/application.route.js'
import documentRoute from './routes/portal/document.route.js'
import adminRoute from './routes/admin/admin.route.js'

const app = express()
dotenv.config()
const port = process.env.PORT || 2000

connectDB()
//! Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5172'],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//** ROUTES */
app.use('/auth',route)
app.use('/placement',placementRoute)
app.use('/api/student', profileRoute)
app.use('/application', applicationRoute)
app.use('/document', documentRoute)
app.use('/admin', adminRoute)

// Serve static files from uploads directory
app.use('/uploads', express.static('upload'))

app.get("/test",(req,res)=>{
    res.send({
        message:'Testing...',
        success:true,

    })
})

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error)
  
  if (error instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request format'
    })
  }
  
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB'
    })
  }
  
  if (error.code === 'ENOENT') {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error. Please contact administrator.'
    })
  }
  
  return res.status(500).json({
    success: false,
    message: error.message || 'Internal server error'
  })
})

app.listen(port,()=>{
    console.log(` Server running at http://localhost:${port}`);
})
