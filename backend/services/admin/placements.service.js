import PlacementModel from '../../Model/portal/placement.model.js'

// Get all placements with pagination
export const getAllPlacementsService = async({ page = 1, limit = 10 } = {}) => {
    try {
        const skip = (page - 1) * limit
        
        // Get total count for pagination
        const totalCount = await PlacementModel.countDocuments()
        
        // Get placements with pagination
        const placements = await PlacementModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        
        return {
            success: true,
            data: placements,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        }
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch placements')
    }
}

// Get placement by ID
export const getPlacementByIdService = async (id) => {
    try {
        const placement = await PlacementModel.findById(id)
        
        if (!placement) {
            throw new Error('Placement not found')
        }
        
        return {
            success: true,
            data: placement
        }
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch placement')
    }
}

// Update placement field
export const updatePlacementFieldService = async (id, section, field, value) => {
    try {
        const placement = await PlacementModel.findById(id)
        
        if (!placement) {
            throw new Error('Placement not found')
        }
        
        // Update the specific field in the section
        if (placement[section] && placement[section][field] !== undefined) {
            placement[section][field] = value
            await placement.save()
            
            return {
                success: true,
                data: placement,
                message: 'Field updated successfully'
            }
        } else {
            throw new Error('Invalid field or section')
        }
    } catch (error) {
        throw new Error(error.message || 'Failed to update placement')
    }
}

// Verify document
export const verifyDocumentService = async (id, docId) => {
    try {
        const placement = await PlacementModel.findById(id)
        
        if (!placement) {
            throw new Error('Placement not found')
        }
        
        const document = placement.documents[docId]
        
        if (!document) {
            throw new Error('Document not found')
        }
        
        document.status = 'Verified'
        await placement.save()
        
        return {
            success: true,
            data: placement,
            message: 'Document verified successfully'
        }
    } catch (error) {
        throw new Error(error.message || 'Failed to verify document')
    }
}

// Reject document
export const rejectDocumentService = async (id, docId) => {
    try {
        const placement = await PlacementModel.findById(id)
        
        if (!placement) {
            throw new Error('Placement not found')
        }
        
        const document = placement.documents[docId]
        
        if (!document) {
            throw new Error('Document not found')
        }
        
        document.status = 'Rejected'
        await placement.save()
        
        return {
            success: true,
            data: placement,
            message: 'Document rejected successfully'
        }
    } catch (error) {
        throw new Error(error.message || 'Failed to reject document')
    }
}

// Delete placement
export const deletePlacementService = async (id) => {
    try {
        const placement = await PlacementModel.findById(id)
        
        if (!placement) {
            throw new Error('Placement not found')
        }
        
        await PlacementModel.findByIdAndDelete(id)
        
        return {
            success: true,
            message: 'Placement deleted successfully'
        }
    } catch (error) {
        throw new Error(error.message || 'Failed to delete placement')
    }
}
