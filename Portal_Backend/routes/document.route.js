import { Router } from 'express'
import { getDocuments, uploadNewDocument, replaceExistingDocument, removeDocument, downloadExistingDocument } from '../controller/document/document.controller.js'
import upload from '../middleware/documentUpload.middleware.js'

const router = Router()

// GET /documents — List all documents
router.get('/', getDocuments)

// POST /documents/upload — Upload a new document
router.post('/upload', upload.single('file'), uploadNewDocument)

// PUT /documents/:id/replace — Replace an existing document
router.put('/:id/replace', upload.single('file'), replaceExistingDocument)

// DELETE /documents/:id — Delete a document
router.delete('/:id', removeDocument)

// GET /documents/:id/download — Download a document
router.get('/:id/download', downloadExistingDocument)

export default router