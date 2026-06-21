import multer from 'multer'
import path from 'path'

// store the file on this path
const storage = multer.diskStorage({
   destination:(req,file,cb)=>{
    cb(null,'uploads/newPlacement/document')
   },
   //create a unique name for each file 
    filename:(req,file,cb)=>{
        const uniquename= Date.now()+'-'+Math.round(Math.random()*1000000)+path.extname(file.originalname)
        cb(null,uniquename)
    }
  
});

// filter which type of file allow to upload
const fileFilter = (req,file,cb)=>{
    const allowedTypes = [

        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png"

    ];

    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error("Only PDF, DOC, DOCX, JPG, PNG files are allowed"),false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits:{
          fileSize:5 * 1024 * 1024
    }
})

export default upload;