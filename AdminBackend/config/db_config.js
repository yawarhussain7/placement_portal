import mongoose from "mongoose";
const MONGO_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/adminPortal'

if (!MONGO_URL) {
    console.error("MONGO_URI is missing in environment variables");
    process.exit(1)
}
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URL)
       console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}

export default connectDB;