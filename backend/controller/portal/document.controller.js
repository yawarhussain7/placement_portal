import {
  createDocumentService,
  getDocumentByIdService,
  getDocumentsByUserIdService,
  getLatestDocumentsByUserIdService,
  updateDocumentService,
  updateDocumentVersionService,
  deleteDocumentService,
  verifyDocumentService,
  unverifyDocumentService,
  incrementDownloadCountService,
  getDocumentStatsService,
  searchDocumentsService,
  getAllDocumentsService
} from '../../services/portal/document.service.js'
import { upload } from '../../middleware/doc.middleware.js'

// Upload a new document
export const uploadDocumentController = async (req, res) => {
  try {
    const userId = req.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const { 
      documentType, 
      description, 
      tags, 
      placementId, 
      applicationId,
      isPublic 
    } = req.body

    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: 'Document type is required'
      })
    }

    // Determine file type from mimetype
    const fileType = req.file.mimetype

    const documentData = {
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: fileType,
      fileSize: req.file.size,
      documentType: documentType,
      userId: userId,
      description: description || '',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
      placementId: placementId || null,
      applicationId: applicationId || null,
      isPublic: isPublic === 'true' || isPublic === true
    }

    const document = await createDocumentService(documentData)

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    })
  } catch (error) {
    console.error('Error uploading document:', error)
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get document by ID
export const getDocumentByIdController = async (req, res) => {
  try {
    const { documentId } = req.params

    const document = await getDocumentByIdService(documentId)

    return res.status(200).json({
      success: true,
      message: 'Document fetched successfully',
      data: document
    })
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    })
  }
}

// Get my documents
export const getMyDocumentsController = async (req, res) => {
  try {
    const userId = req.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const { documentType, isVerified, placementId, applicationId } = req.query
    const filters = {}
    
    if (documentType) filters.documentType = documentType
    if (isVerified !== undefined) filters.isVerified = isVerified === 'true'
    if (placementId) filters.placementId = placementId
    if (applicationId) filters.applicationId = applicationId

    const documents = await getDocumentsByUserIdService(userId, filters)

    return res.status(200).json({
      success: true,
      message: 'Your documents fetched successfully',
      data: documents
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get latest documents
export const getLatestDocumentsController = async (req, res) => {
  try {
    const userId = req.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const { documentType } = req.query
    const documents = await getLatestDocumentsByUserIdService(userId, documentType)

    return res.status(200).json({
      success: true,
      message: 'Latest documents fetched successfully',
      data: documents
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Update document metadata
export const updateDocumentController = async (req, res) => {
  try {
    const userId = req.userId
    const { documentId } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const document = await getDocumentByIdService(documentId)

    // Check if user owns this document
    if (document.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only update your own documents'
      })
    }

    const allowedFields = ['description', 'tags', 'isPublic', 'documentType']
    const updateKeys = Object.keys(req.body)
    const isOnlyAllowedFields = updateKeys.every(key => allowedFields.includes(key))
    
    if (!isOnlyAllowedFields) {
      return res.status(400).json({
        success: false,
        message: 'Only description, tags, isPublic, and documentType can be updated'
      })
    }

    const updatedDocument = await updateDocumentService(documentId, req.body)

    return res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: updatedDocument
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Update document version (upload new version)
export const updateDocumentVersionController = async (req, res) => {
  try {
    const userId = req.userId
    const { documentId } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const document = await getDocumentByIdService(documentId)

    // Check if user owns this document
    if (document.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only update your own documents'
      })
    }

    const newFileData = {
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    }

    const updatedDocument = await updateDocumentVersionService(documentId, newFileData)

    return res.status(200).json({
      success: true,
      message: 'Document version updated successfully',
      data: updatedDocument
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Delete document
export const deleteDocumentController = async (req, res) => {
  try {
    const userId = req.userId
    const { documentId } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const document = await getDocumentByIdService(documentId)

    // Check if user owns this document
    if (document.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only delete your own documents'
      })
    }

    await deleteDocumentService(documentId)

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Verify document (admin/recruiter only)
export const verifyDocumentController = async (req, res) => {
  try {
    const userId = req.userId
    const { documentId } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const document = await verifyDocumentService(documentId, userId)

    return res.status(200).json({
      success: true,
      message: 'Document verified successfully',
      data: document
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Unverify document (admin/recruiter only)
export const unverifyDocumentController = async (req, res) => {
  try {
    const userId = req.userId
    const { documentId } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const document = await unverifyDocumentService(documentId)

    return res.status(200).json({
      success: true,
      message: 'Document unverified successfully',
      data: document
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Increment download count
export const downloadDocumentController = async (req, res) => {
  try {
    const { documentId } = req.params

    const document = await incrementDownloadCountService(documentId)

    return res.status(200).json({
      success: true,
      message: 'Download recorded',
      data: document
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get document statistics
export const getDocumentStatsController = async (req, res) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const stats = await getDocumentStatsService(userId)

    return res.status(200).json({
      success: true,
      message: 'Document statistics fetched successfully',
      data: stats
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Search documents
export const searchDocumentsController = async (req, res) => {
  try {
    const userId = req.userId
    const { query } = req.query

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }

    const documents = await searchDocumentsService(userId, query)

    return res.status(200).json({
      success: true,
      message: 'Documents fetched successfully',
      data: documents
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get all documents (admin only)
export const getAllDocumentsController = async (req, res) => {
  try {
    const { documentType, isVerified, userId } = req.query
    const filters = {}
    
    if (documentType) filters.documentType = documentType
    if (isVerified !== undefined) filters.isVerified = isVerified === 'true'
    if (userId) filters.userId = userId

    const documents = await getAllDocumentsService(filters)

    return res.status(200).json({
      success: true,
      message: 'All documents fetched successfully',
      data: documents
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}