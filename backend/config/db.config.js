import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const DB_URL = process.env.DBURL 

if (!DB_URL) {
    throw new Error('DB link variable not found ')
}

const connectDB = async () => {

    try {
        const connection = await mongoose.connect(DB_URL)
        console.log('Database conection successfully')
    } catch (error) {
        console.log("Datebase not connected")
        process.exit(1);
    }
}

export default connectDB