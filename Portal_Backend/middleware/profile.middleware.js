import multer from "multer";
import path from 'path'
import fs from 'fs'

// Ensure upload directory exists
const uploadDir = 'uploads/User_profile'
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniquename = Date.now() + '-' + Math.round(Math.random() * 1000000) + path.extname(file.originalname)
        cb(null, uniquename)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png'
    ]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only jpg, jpeg and png files are allowed'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default upload;