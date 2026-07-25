import PlacementModel from '../../Model/portal/placement.model.js'

//* */ Create a new placement application
export const createPlacementService = async (placementData) => {
  try {
    console.log('Creating placement with data:', JSON.stringify(placementData, null, 2))
    const placement = new PlacementModel(placementData)
    console.log('Placement model created, attempting to save...')
    const savedPlacement = await placement.save()
    console.log('Placement saved successfully:', savedPlacement._id)
    return savedPlacement
  } catch (error) {
    console.error('Full error details:', error)
    console.error('Error stack:', error.stack)
    throw new Error(`Error creating placement: ${error.message}`)
  }
}

// Get placement by ID
export const getPlacementByIdService = async (placementId) => {
  try {
    const placement = await PlacementModel.findById(placementId)
      .populate('userId', '_id name email phoneNumber')
      .populate('reviewedBy', 'name email')

    if (!placement) {
      throw new Error('Placement not found')
    }

    return placement
  } catch (error) {
    throw new Error(`Error fetching placement: ${error.message}`)
  }
}

// Get placements by user ID
export const getPlacementsByUserIdService = async (userId) => {
  try {
    const placements = await PlacementModel.find({ userId })
      .populate('userId', '_id name email phoneNumber')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })

    return placements
  } catch (error) {
    throw new Error(`Error fetching user placements: ${error.message}`)
  }
}

// Update placement
export const updatePlacementService = async (placementId, updateData) => {
  try {
    const placement = await PlacementModel.findByIdAndUpdate(
      placementId,
      updateData,
      { new: true, runValidators: true }
    )

    if (!placement) {
      throw new Error('Placement not found')
    }

    return placement
  } catch (error) {
    throw new Error(`Error updating placement: ${error.message}`)
  }
}

// Update placement status
export const updatePlacementStatusService = async (placementId, status, reviewData = {}) => {
  try {
    const { reviewedBy, reviewNotes } = reviewData
    const updateFields = { status }

    if (status === 'submitted') {
      updateFields.submittedAt = new Date()
    }

    if (['approved', 'rejected'].includes(status)) {
      updateFields.reviewedBy = reviewedBy
      updateFields.reviewedAt = new Date()
      updateFields.reviewNotes = reviewNotes
    }

    if (status === 'completed') {
      updateFields.completedAt = new Date()
      updateFields.completionNotes = reviewNotes
    }

    const placement = await PlacementModel.findByIdAndUpdate(
      placementId,
      updateFields,
      { new: true, runValidators: true }
    ).populate('userId', '_id name email')
      .populate('reviewedBy', 'name email')

    if (!placement) {
      throw new Error('Placement not found')
    }

    return placement
  } catch (error) {
    throw new Error(`Error updating placement status: ${error.message}`)
  }
}

// Delete placement
export const deletePlacementService = async (placementId) => {
  try {
    const placement = await PlacementModel.findByIdAndDelete(placementId)

    if (!placement) {
      throw new Error('Placement not found')
    }

    return placement
  } catch (error) {
    throw new Error(`Error deleting placement: ${error.message}`)
  }
}

// Upload document to placement
export const uploadDocumentService = async (placementId, documentType, documentData) => {
  try {
    const updateFields = {
      [`documents.${documentType}.fileName`]: documentData.fileName,
      [`documents.${documentType}.fileUrl`]: documentData.fileUrl,
      [`documents.${documentType}.uploadedAt`]: new Date()
    }

    const placement = await PlacementModel.findByIdAndUpdate(
      placementId,
      { $set: updateFields },
      { new: true, runValidators: true }
    )

    if (!placement) {
      throw new Error('Placement not found')
    }

    return placement
  } catch (error) {
    throw new Error(`Error uploading document: ${error.message}`)
  }
}

// Remove document from placement
export const removeDocumentService = async (placementId, documentType) => {
  try {
    const updateFields = {
      [`documents.${documentType}.fileName`]: null,
      [`documents.${documentType}.fileUrl`]: null,
      [`documents.${documentType}.uploadedAt`]: null
    }

    const placement = await PlacementModel.findByIdAndUpdate(
      placementId,
      { $set: updateFields },
      { new: true }
    )

    if (!placement) {
      throw new Error('Placement not found')
    }

    return placement
  } catch (error) {
    throw new Error(`Error removing document: ${error.message}`)
  }
}