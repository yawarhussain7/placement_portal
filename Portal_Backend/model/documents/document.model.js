import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AuthUser",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        default:"",
        maxlength:250 
    },
    fileName:{
        type:String,
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    fileType:{
        type:String,
        required:true
    },
    fileSize:{
        type:String,
        default:"0"
    },
}, {
    timestamps: true
})

const Document = mongoose.model("Document", DocumentSchema)
export default Document
