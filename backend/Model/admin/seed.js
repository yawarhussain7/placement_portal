import AdminModel from './admin.model.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import connectDB from '../../config/db.config.js'

dotenv.config()

const createAdmin = async () => {
    try {
        const fullName = "Yawar Hussain";
        const email = "yawar123@gmail.com";
        const password = 'yawar123'

        const admin = await AdminModel.findOne({ email });
        if (admin) {
            console.log(' Admin already exists with this email')
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = await AdminModel.create({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })
        
        console.log('Admin account created successfully!')
        console.log('Email:', email)
        console.log('Password:', password)
        console.log('Name:', fullName)
        process.exit(0)

    } catch (error) {
        console.error('Admin account failed to create:', error.message)
        process.exit(1)
    }
}

// Connect to database first
await connectDB()

createAdmin()
