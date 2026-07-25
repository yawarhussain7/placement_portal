import DocumentModel from '../../Model/portal/document.model.js'

//* */ Create a new document
export const createDocumentService = async (documentData) => {
  try {
    const document = new DocumentModel(documentData)
    const savedDocument = await document.save()
    return savedDocument
  } catch (error) {
    throw new Error(`Error creating document: ${error.message}`)
  }
}

// Get document by ID
export const getDocumentByIdService = async (documentId) => {
  try {
    const document = await DocumentModel.findById(documentId)
      .populate('userId', '_id fullName email phone')
      .populate('placementId')
      .populate('applicationId')
      .populate('verifiedBy', 'fullName email')

    if (!document) {
      throw new Error('Document not found')
    }

    return document
  } catch (error) {
    throw new Error(`Error fetching document: ${error.message}`)
  }
}

// Get documents by user ID
export const getDocumentsByUserIdService = async (userId, filters = {}) => {
  try {
    const { documentType, isVerified, placementId, applicationId } = filters
    
    const query = { userId }
    
    if (documentType) {
      query.documentType = documentType
    }
    
    if (isVerified !== undefined) {
      query.isVerified = isVerified
    }
    
    if (placementId) {
      query.placementId = placementId
    }
    
    if (applicationId) {
      query.applicationId = applicationId
    }

    const documents = await DocumentModel.find(query)
      .populate('userId', '_id fullName email phone')
      .populate('placementId')
      .populate('applicationId')
      .populate('verifiedBy', 'fullName email')
      .sort({ createdAt: -1 })

    return documents
  } catch (error) {
    throw new Error(`Error fetching user documents: ${error.message}`)
  }
}

// Get latest documents by user ID and document type
export const getLatestDocumentsByUserIdService = async (userId, documentType = null) => {
  try {
    const query = { userId, isLatest: true }
    
    if (documentType) {
      query.documentType = documentType
    }

    const documents = await DocumentModel.find(query)
      .populate('userId', '_id fullName email phone')
      .populate('placementId')
      .populate('applicationId')
      .sort({ createdAt: -1 })

    return documents
  } catch (error) {
    throw new Error(`Error fetching latest documents: ${error.message}`)
  }
}

// Update document
export const updateDocumentService = async (documentId, updateData) => {
  try {
    const document = await DocumentModel.findByIdAndUpdate(
      documentId,
      updateData,
      { new: true, runValidators: true }
    )

    if (!document) {
      throw new Error('Document not found')
    }

    return document
  } catch (error) {
    throw new Error(`Error updating document: ${error.message}`)
  }
}

// Update document version (create new version)
export const updateDocumentVersionService = async (documentId, newFileData) => {
  try {
    const existingDocument = await DocumentModel.findById(documentId)
    
    if (!existingDocument) {
      throw new Error('Document not found')
    }

    // Mark old version as not latest
    await DocumentModel.findByIdAndUpdate(documentId, { isLatest: false })

    // Create new version
    const newDocument = new DocumentModel({
      fileName: newFileData.fileName,
      fileUrl: newFileData.fileUrl,
      fileType: newFileData.fileType,
      fileSize: newFileData.fileSize,
      documentType: existingDocument.documentType,
      userId: existingDocument.userId,
      placementId: existingDocument.placementId,
      applicationId: existingDocument.applicationId,
      description: existingDocument.description,
      tags: existingDocument.tags,
      isPublic: existingDocument.isPublic,
      version: existingDocument.version + 1,
      isLatest: true
    })

    const savedDocument = await newDocument.save()
    return savedDocument
  } catch (error) {
    throw new Error(`Error updating document version: ${error.message}`)
  }
}

// Delete document
export const deleteDocumentService = async (documentId) => {
  try {
    const document = await DocumentModel.findByIdAndDelete(documentId)

    if (!document) {
      throw new Error('Document not found')
    }

    return document
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`)
  }
}

// Verify document
export const verifyDocumentService = async (documentId, verifiedBy) => {
  try {
    const document = await DocumentModel.findByIdAndUpdate(
      documentId,
      {
        isVerified: true,
        verifiedBy: verifiedBy,
        verifiedAt: new Date()
      },
      { new: true, runValidators: true }
    )

    if (!document) {
      throw new Error('Document not found')
    }

    return document
  } catch (error) {
    throw new Error(`Error verifying document: ${error.message}`)
  }
}

// Unverify document
export const unverifyDocumentService = async (documentId) => {
  try {
    const document = await DocumentModel.findByIdAndUpdate(
      documentId,
      {
        isVerified: false,
        verifiedBy: null,
        verifiedAt: null
      },
      { new: true, runValidators: true }
    )

    if (!document) {
      throw new Error('Document not found')
    }

    return document
  } catch (error) {
    throw new Error(`Error unverifying document: ${error.message}`)
  }
}

// Increment download count
export const incrementDownloadCountService = async (documentId) => {
  try {
    const document = await DocumentModel.findByIdAndUpdate(
      documentId,
      {
        $inc: { downloadCount: 1 },
        lastDownloadedAt: new Date()
      },
      { new: true }
    )

    if (!document) {
      throw new Error('Document not found')
    }

    return document
  } catch (error) {
    throw new Error(`Error updating download count: ${error.message}`)
  }
}

// Get document statistics
export const getDocumentStatsService = async (userId) => {
  try {
    const totalDocuments = await DocumentModel.countDocuments({ userId })
    const verifiedDocuments = await DocumentModel.countDocuments({ userId, isVerified: true })
    const unverifiedDocuments = await DocumentModel.countDocuments({ userId, isVerified: false })
    
    // Get documents by type
    const documentsByType = await DocumentModel.aggregate([
      { $match: { userId: new (await import('mongoose')).default.Types.ObjectId(userId) } },
      { $group: { _id: '$documentType', count: { $sum: 1 } } }
    ])

    // Get total file size
    const totalFileSize = await DocumentModel.aggregate([
      { $match: { userId: new (await import('mongoose')).default.Types.ObjectId(userId) } },
      { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
    ])

    return {
      totalDocuments,
      verifiedDocuments,
      unverifiedDocuments,
      documentsByType,
      totalFileSize: totalFileSize[0]?.totalSize || 0
    }
  } catch (error) {
    throw new Error(`Error fetching document statistics: ${error.message}`)
  }
}

// Search documents
export const searchDocumentsService = async (userId, searchQuery) => {
  try {
    const documents = await DocumentModel.find({
      userId,
      $or: [
        { fileName: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } }
      ]
    })
      .populate('userId', '_id fullName email phone')
      .populate('placementId')
      .populate('applicationId')
      .sort({ createdAt: -1 })

    return documents
  } catch (error) {
    throw new Error(`Error searching documents: ${error.message}`)
  }
}

// Get all documents (admin only)
export const getAllDocumentsService = async (filters = {}) => {
  try {
    const { documentType, isVerified, userId } = filters
    
    const query = {}
    
    if (documentType) {
      query.documentType = documentType
    }
    
    if (isVerified !== undefined) {
      query.isVerified = isVerified
    }
    
    if (userId) {
      query.userId = userId
    }

    const documents = await DocumentModel.find(query)
      .populate('userId', '_id fullName email phone')
      .populate('placementId')
      .populate('applicationId')
      .populate('verifiedBy', 'fullName email')
      .sort({ createdAt: -1 })

    return documents
  } catch (error) {
    throw new Error(`Error fetching all documents: ${error.message}`)
  }
}