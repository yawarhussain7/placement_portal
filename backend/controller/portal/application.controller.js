import {
  createApplicationService,
  getApplicationByIdService,
  getApplicationsByUserIdService,
  updateApplicationService,
  updateApplicationStatusService,
  deleteApplicationService,
  getApplicationStatsService
} from '../../services/portal/application.service.js'

// Create a new application
export const createApplicationController = async (req, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const applicationData = {
      ...req.body,
      userId: userId
    }

    const application = await createApplicationService(applicationData)

    return res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application
    })
  } catch (error) {
    console.error('Error creating application:', error)
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get application by ID
export const getApplicationByIdController = async (req, res) => {
  try {
    const { applicationId } = req.params

    const application = await getApplicationByIdService(applicationId)

    return res.status(200).json({
      success: true,
      message: 'Application fetched successfully',
      data: application
    })
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    })
  }
}

// Get current user's applications
export const getMyApplicationsController = async (req, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const { status } = req.query
    const filters = status ? { status } : {}

    const applications = await getApplicationsByUserIdService(userId, filters)

    return res.status(200).json({
      success: true,
      message: 'Your applications fetched successfully',
      data: applications
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Update application
export const updateApplicationController = async (req, res) => {
  try {
    const userId = req.userId
    const { applicationId } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const application = await getApplicationByIdService(applicationId)

    // Check if user owns this application
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only update your own applications'
      })
    }

    // Check if the update is only for non-critical fields (notes, coverLetter, etc.)
    const allowedFieldsInProgress = ['coverLetter', 'additionalInfo', 'notes', 'documents']
    const updateKeys = Object.keys(req.body)
    const isOnlyAllowedFields = updateKeys.every(key => allowedFieldsInProgress.includes(key))
    
    // If application is not in draft and trying to update critical fields, block it
    if (application.status !== 'draft' && !isOnlyAllowedFields) {
      return res.status(400).json({
        success: false,
        message: `Cannot update application with status: ${application.status}. Only notes and documents can be updated.`
      })
    }

    const updatedApplication = await updateApplicationService(applicationId, req.body)

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: updatedApplication
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Update application status
export const updateApplicationStatusController = async (req, res) => {
  try {
    const userId = req.userId
    const { applicationId } = req.params
    const { status, reviewNotes, responseMessage, feedback, rating, interviewDate } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    // Verify user owns this application
    const application = await getApplicationByIdService(applicationId)
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only update your own applications'
      })
    }

    const updateData = {
      reviewedBy: req.userId,
      reviewNotes,
      responseMessage,
      feedback,
      rating,
      interviewDate
    }

    const updatedApplication = await updateApplicationStatusService(applicationId, status, updateData)

    return res.status(200).json({
      success: true,
      message: `Application status updated to ${status} successfully`,
      data: updatedApplication
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Delete application
export const deleteApplicationController = async (req, res) => {
  try {
    const userId = req.userId
    const { applicationId } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const application = await getApplicationByIdService(applicationId)

    // Check if user owns this application
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only delete your own applications'
      })
    }

    // Prevent deleting if already submitted or in review
    if (['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete application with status: ${application.status}`
      })
    }

    await deleteApplicationService(applicationId)

    return res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get application statistics
export const getApplicationStatsController = async (req, res) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const stats = await getApplicationStatsService(userId)

    return res.status(200).json({
      success: true,
      message: 'Application statistics fetched successfully',
      data: stats
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Upload document to application
export const uploadDocumentController = async (req, res) => {
  try {
    const userId = req.userId
    const { applicationId } = req.params
    const documentType = req.body.documentType || 'resume'
    
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

    // Verify user owns this application
    const application = await getApplicationByIdService(applicationId)
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only upload documents to your own applications'
      })
    }

    const documentData = {
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    }

    const updatedApplication = await uploadDocumentService(applicationId, documentType, documentData)

    return res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: updatedApplication
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Remove document from application
export const removeDocumentController = async (req, res) => {
  try {
    const userId = req.userId
    const { applicationId } = req.params
    const { documentType } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: 'Document type is required'
      })
    }

    // Verify user owns this application
    const application = await getApplicationByIdService(applicationId)
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only remove documents from your own applications'
      })
    }

    const updatedApplication = await removeDocumentService(applicationId, documentType)

    return res.status(200).json({
      success: true,
      message: 'Document removed successfully',
      data: updatedApplication
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}