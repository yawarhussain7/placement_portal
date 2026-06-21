import mongoose from 'mongoose'

const DB_URL = process.env.MONGO_URI;
if(!DB_URL){
    console.error('Data base link not found')
    process.exit(1)
}

 const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(DB_URL)
        console.log(`Database connected successfully: ${conn.connection.host}`);
    }catch(error){
        console.error(`Database connection Failed : ${error.message}`)
        process.exit(1)
    }
}

export default connectDB