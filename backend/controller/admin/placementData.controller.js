import {
    getAllPlacementsService,
    getPlacementByIdService,
    updatePlacementFieldService,
    verifyDocumentService,
    rejectDocumentService,
    deletePlacementService
} from '../../services/admin/placements.service.js'

// Get all placements with pagination
export const getAllPlacementsController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await getAllPlacementsService({ page, limit })
        
        res.status(200).json({
            success: true,
            ...result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch placements'
        })
    }
}

// Get single placement by ID
export const getPlacementByIdController = async (req, res) => {
    try {
        const { id } = req.params
        
        const result = await getPlacementByIdService(id)
        
        res.status(200).json({
            success: true,
            data: result.data
        })
    } catch (error) {
        const statusCode = error.message === 'Placement not found' ? 404 : 500
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to fetch placement'
        })
    }
}

// Update placement fields
export const updatePlacementController = async (req, res) => {
    try {
        const { id } = req.params
        const { section, field, value } = req.body
        
        const result = await updatePlacementFieldService(id, section, field, value)
        
        res.status(200).json({
            success: true,
            data: result.data,
            message: result.message
        })
    } catch (error) {
        const statusCode = error.message === 'Invalid field or section' ? 400 : 500
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to update placement'
        })
    }
}

// Verify document
export const verifyDocumentController = async (req, res) => {
    try {
        const { id, docId } = req.params
        
        const result = await verifyDocumentService(id, docId)
        
        res.status(200).json({
            success: true,
            data: result.data,
            message: result.message
        })
    } catch (error) {
        const statusCode = (error.message === 'Placement not found' || error.message === 'Document not found') ? 404 : 500
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to verify document'
        })
    }
}

// Reject document
export const rejectDocumentController = async (req, res) => {
    try {
        const { id, docId } = req.params
        
        const result = await rejectDocumentService(id, docId)
        
        res.status(200).json({
            success: true,
            data: result.data,
            message: result.message
        })
    } catch (error) {
        const statusCode = (error.message === 'Placement not found' || error.message === 'Document not found') ? 404 : 500
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to reject document'
        })
    }
}

// Delete placement
export const deletePlacementController = async (req, res) => {
    try {
        const { id } = req.params
        
        const result = await deletePlacementService(id)
        
        res.status(200).json({
            success: true,
            message: result.message
        })
    } catch (error) {
        const statusCode = error.message === 'Placement not found' ? 404 : 500
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to delete placement'
        })
    }
}
