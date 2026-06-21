import 'dotenv/config'
import express from 'express'
import connectDB from './config/db.config.js'

const PORT = process.env.PORT || 2000

if (!PORT) {
    console.log('PORT is not set for connection')
    process.exit(1)
}

const app = express()

connectDB()

app.use(express.json())

app.get('/test', (req, res) => {
    try {
        res.status(200).send({
            message: 'testing backend API',
            success: true
        })
    } catch (error) {
        res.status(500).send({
            message: 'Connection failed',
            success: false
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})