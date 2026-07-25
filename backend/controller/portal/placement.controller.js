import {
  createPlacementService,
  getPlacementByIdService,
  getPlacementsByUserIdService,
  updatePlacementService,
  updatePlacementStatusService,
  deletePlacementService,
  uploadDocumentService,
  removeDocumentService
} from '../../services/portal/placement.service.js'

// Create placement application
export const createPlacementController = async (req, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    // Process uploaded files from multer
    const documents = {}
    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, fileArray]) => {
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0]
          documents[fieldName] = {
            fileName: file.originalname,
            fileUrl: file.filename,
            uploadedAt: new Date()
          }
        }
      })
    }

    // Helper function to parse dates safely
    const parseDate = (dateStr) => {
      if (!dateStr) return undefined
      
      // If it's already a valid date string, parse it
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return date
      }
      
      // Try parsing DD/MM/YYYY format
      if (typeof dateStr === 'string' && dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/')
        const parsedDate = new Date(`${year}-${month}-${day}`)
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate
        }
      }
      
      return undefined
    }

    // Parse the placement data from req.body
    const placementData = {
      personal: {
        fullName: req.body.p_fullName,
        email: req.body.p_email,
        phoneNumber: req.body.p_phoneNumber,
        phoneCountry: req.body.p_phoneCountry || '+61',
        dob: parseDate(req.body.p_dob),
        gender: req.body.p_gender,
        address: req.body.p_address,
        suburb: req.body.p_suburb,
        state: req.body.p_state,
        postcode: req.body.p_postcode,
        isCitizen: req.body.p_isCitizen
      },
      course: {
        course: req.body.c_course,
        institution: req.body.c_institution,
        courseCode: req.body.c_courseCode,
        studyStatus: req.body.c_studyStatus,
        completionDate: parseDate(req.body.c_completionDate),
        studyMode: req.body.c_studyMode,
        placementReason: req.body.c_placementReason
      },
      preference: {
        industry: req.body.r_industry,
        role: req.body.r_role,
        location: req.body.r_location,
        relocate: req.body.r_relocate,
        availability: req.body.r_availability,
        workingHours: req.body.r_workingHours,
        notes: req.body.r_notes,
        availableDays: req.body.r_days ? (() => {
          try {
            return JSON.parse(req.body.r_days)
          } catch (error) {
            console.error('Error parsing availableDays:', error)
            return []
          }
        })() : [],
        placementType: req.body.r_placementType
      },
      documents: documents,
      userId: userId,
      status: 'draft'
    }

    // Validate required fields
    const requiredFields = {
      personal: ['fullName', 'email', 'phoneNumber', 'dob', 'gender', 'address', 'suburb', 'state', 'postcode', 'isCitizen'],
      course: ['course', 'institution', 'studyStatus', 'completionDate', 'studyMode', 'placementReason'],
      preference: ['industry', 'location', 'relocate', 'availability', 'placementType']
    }

    const missingFields = []
    
    for (const [section, fields] of Object.entries(requiredFields)) {
      for (const field of fields) {
        const value = placementData[section]?.[field]
        if (!value || (typeof value === 'string' && !value.trim())) {
          missingFields.push(`${section}.${field}`)
        }
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    console.log('Received placement data:', JSON.stringify(placementData, null, 2))

    const placement = await createPlacementService(placementData)

    return res.status(201).json({
      success: true,
      message: 'Placement application created successfully',
      data: placement
    })
  } catch (error) {
    console.error('Error creating placement:', error)
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get placement by ID
export const getPlacementByIdController = async (req, res) => {
  try {
    const { placementId } = req.params

    const placement = await getPlacementByIdService(placementId)

    return res.status(200).json({
      success: true,
      message: 'Placement fetched successfully',
      data: placement
    })
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    })
  }
}

// Get current user's placements
export const getMyPlacementsController = async (req, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const placements = await getPlacementsByUserIdService(userId)

    return res.status(200).json({
      success: true,
      message: 'Your placements fetched successfully',
      data: placements
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Update placement
export const updatePlacementController = async (req, res) => {
  try {
    const userId = req.userId
    const { placementId } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const placement = await getPlacementByIdService(placementId)

    // Check if user owns this placement
    if (placement.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only update your own placements'
      })
    }

    // Prevent updating if already submitted or approved
    if (['submitted', 'under_review', 'approved', 'completed'].includes(placement.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update placement with status: ${placement.status}`
      })
    }

    const updatedPlacement = await updatePlacementService(placementId, req.body)

    return res.status(200).json({
      success: true,
      message: 'Placement updated successfully',
      data: updatedPlacement
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Submit placement for review
export const submitPlacementController = async (req, res) => {
  try {
    const { placementId } = req.params

    const placement = await getPlacementByIdService(placementId)

    // Check if placement is in draft status
    if (placement.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: `Cannot submit placement with status: ${placement.status}`
      })
    }

    const updatedPlacement = await updatePlacementStatusService(placementId, 'submitted')

    return res.status(200).json({
      success: true,
      message: 'Placement submitted for review successfully',
      data: updatedPlacement
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Delete placement
export const deletePlacementController = async (req, res) => {
  try {
    const userId = req.userId
    const { placementId } = req.params

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      })
    }

    const placement = await getPlacementByIdService(placementId)

    // Check if user owns this placement
    if (placement.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only delete your own placements'
      })
    }

    // Prevent deleting if already submitted or approved
    if (['submitted', 'under_review', 'approved', 'completed'].includes(placement.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete placement with status: ${placement.status}`
      })
    }

    await deletePlacementService(placementId)

    return res.status(200).json({
      success: true,
      message: 'Placement deleted successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Upload document
export const uploadDocumentController = async (req, res) => {
  try {
    const userId = req.userId
    const { placementId } = req.params
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

    const validDocumentTypes = ['resume', 'photoId', 'studentId', 'transcript', 'certificates', 'additional']
    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      })
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a file to upload.'
      })
    }

    const placement = await getPlacementByIdService(placementId)

    // Check if user owns this placement
    if (placement.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only upload documents to your own placements'
      })
    }

    // Get file data from multer
    const documentData = {
      fileName: req.file.originalname,
      fileUrl: req.file.filename // Store the generated filename
    }

    const updatedPlacement = await uploadDocumentService(placementId, documentType, documentData)

    return res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: updatedPlacement
    })
  } catch (error) {
    console.error('Error uploading document:', error)
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Remove document
export const removeDocumentController = async (req, res) => {
  try {
    const userId = req.userId
    const { placementId } = req.params
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

    const placement = await getPlacementByIdService(placementId)

    // Check if user owns this placement
    if (placement.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only remove documents from your own placements'
      })
    }

    const updatedPlacement = await removeDocumentService(placementId, documentType)

    return res.status(200).json({
      success: true,
      message: 'Document removed successfully',
      data: updatedPlacement
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}