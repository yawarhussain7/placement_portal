import { PlacementDoc_Schema } from '../../model/newPlacement/PlacementSchema.modle.js'
import Document from '../../model/documents/document.model.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Base upload directory (relative to project root)
const UPLOAD_BASE = path.resolve(__dirname, '../../uploads')

export const listDocuments = async (userId) => {
    const documents = []

    // Get from dedicated Document model
    try {
        const userDocs = await Document.find({ userId }).sort({ createdAt: -1 }).lean()
        userDocs.forEach(doc => {
            documents.push({
                id: doc._id.toString(),
                title: doc.title,
                type: doc.fileType,
                status: 'Uploaded',
                updated: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
                fileName: doc.fileName,
                fileUrl: doc.fileUrl,
                fileSize: doc.fileSize,
                description: doc.description
            })
        })
    } catch {
        // ignore
    }

    // Get from PlacementDoc_Schema (submitted placement documents)
    try {
        const placementDocs = await PlacementDoc_Schema.find().sort({ createdAt: -1 }).lean()
        const fields = ['resume', 'photoId', 'studentId', 'transcript', 'certificates', 'additional']
        const seenIds = new Set(documents.map(d => d.id))

        for (const doc of placementDocs) {
            for (const field of fields) {
                if (doc[field] && !seenIds.has(field)) {
                    const filePath = doc[field]
                    const fileName = filePath.split('/').pop() || filePath
                    const ext = path.extname(fileName).replace('.', '').toUpperCase() || 'FILE'
                    documents.push({
                        id: field,
                        title: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
                        type: ext,
                        status: 'Uploaded',
                        updated: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
                        fileName: fileName,
                        fileUrl: doc[field],
                        fileSize: ''
                    })
                    seenIds.add(field)
                }
            }
        }
    } catch {
        // ignore
    }

    return documents
}

/**
 * Upload a new document for a user.
 */
export const uploadDocument = async (userId, file, title, description = '') => {
    if (!file) {
        throw new Error('No file provided')
    }

    const fileUrl = file.path
    const fileName = file.originalname || file.filename
    const fileType = file.mimetype || path.extname(file.originalname).replace('.', '') || 'FILE'
    const fileSize = file.size ? (file.size / 1024).toFixed(1) + ' KB' : '0'

    const doc = await Document.create({
        userId,
        title: title || fileName.replace(/\.[^.]+$/, ''),
        description,
        fileName,
        fileUrl,
        fileType,
        fileSize
    })

    return {
        id: doc._id.toString(),
        title: doc.title,
        type: fileType,
        status: 'Uploaded',
        updated: new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }),
        fileName,
        fileUrl,
        fileSize
    }
}

/**
 * Replace an existing document with a new file.
 */
export const replaceDocument = async (documentId, userId, file) => {
    if (!file) {
        throw new Error('No file provided')
    }

    const existing = await Document.findOne({ _id: documentId, userId })
    if (!existing) {
        throw new Error('Document not found')
    }

    // Delete old file if it exists
    if (existing.fileUrl) {
        const oldPath = path.resolve(UPLOAD_BASE, existing.fileUrl.replace(/^uploads[\\/]/, ''))
        try {
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        } catch {
            // ignore if file doesn't exist
        }
    }

    const fileUrl = file.path
    const fileName = file.originalname || file.filename
    const fileType = file.mimetype || path.extname(file.originalname).replace('.', '') || 'FILE'
    const fileSize = file.size ? (file.size / 1024).toFixed(1) + ' KB' : '0'

    existing.fileUrl = fileUrl
    existing.fileName = fileName
    existing.fileType = fileType
    existing.fileSize = fileSize
    await existing.save()

    return {
        id: existing._id.toString(),
        title: existing.title,
        type: fileType,
        status: 'Uploaded',
        updated: new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }),
        fileName,
        fileUrl,
        fileSize
    }
}

/**
 * Delete a document.
 */
export const deleteDocument = async (documentId, userId) => {
    const doc = await Document.findOne({ _id: documentId, userId })
    if (!doc) {
        throw new Error('Document not found')
    }

    // Delete the file from disk
    if (doc.fileUrl) {
        const filePath = path.resolve(UPLOAD_BASE, doc.fileUrl.replace(/^uploads[\\/]/, ''))
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        } catch {
            // ignore
        }
    }

    await Document.deleteOne({ _id: documentId })
    return { message: 'Document deleted successfully' }
}

/**
 * Download a document file.
 * Returns the file path for the controller to stream.
 */
export const downloadDocument = async (documentId, userId) => {
    // Try dedicated Document model first
    let doc = null
    try {
        doc = await Document.findOne({ _id: documentId, userId }).lean()
    } catch {
        // not found in dedicated model
    }

    if (!doc) {
        // Try PlacementDoc_Schema
        try {
            const placementDocs = await PlacementDoc_Schema.find().lean()
            const fields = ['resume', 'photoId', 'studentId', 'transcript', 'certificates', 'additional']
            for (const pd of placementDocs) {
                for (const field of fields) {
                    if (field === documentId && pd[field]) {
                        doc = {
                            fileName: pd[field].split('/').pop() || pd[field],
                            fileUrl: pd[field]
                        }
                        break
                    }
                }
                if (doc) break
            }
        } catch {
            // ignore
        }
    }

    if (!doc) {
        throw new Error('Document not found')
    }

    // Resolve the full file path
    let filePath
    if (doc.fileUrl) {
        // fileUrl could be relative like "uploads/newPlacement/document/file.png"
        // or absolute
        if (path.isAbsolute(doc.fileUrl)) {
            filePath = doc.fileUrl
        } else {
            // Remove 'uploads/' prefix if present and resolve relative to upload base
            const relativePath = doc.fileUrl.replace(/^uploads[\\/]/, '')
            filePath = path.resolve(UPLOAD_BASE, relativePath)
        }
    } else {
        throw new Error('File path not found')
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        throw new Error('File not found on disk')
    }

    return {
        filePath,
        fileName: doc.fileName || path.basename(filePath)
    }
}