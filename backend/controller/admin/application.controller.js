import {
    getAllApplicationsService,
    getApplicationByIdService,
    updateApplicationStatusService
} from '../../services/admin/application.service.js'

// Get all applications with filters
export const getAllApplicationsController = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 15 } = req.query
        
        const filters = {}
        if (status) filters.status = status
        if (search) filters.search = search
        
        const result = await getAllApplicationsService(filters, { page, limit })
        
        res.status(200).json({
            success: true,
            data: result.applications,
            stats: result.stats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: result.totalPages,
                totalCount: result.total
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch applications'
        })
    }
}

// Get application by ID
export const getApplicationByIdController = async (req, res) => {
    try {
        const { id } = req.params
        
        const application = await getApplicationByIdService(id)
        
        res.status(200).json({
            success: true,
            data: application
        })
    } catch (error) {
        const statusCode = error.message === 'Application not found' ? 404 : 500
        res.status(statusCode).json({
            success: false,
            message: error.message || 'Failed to fetch application'
        })
    }
}

// Update application status
export const updateApplicationStatusController = async (req, res) => {
    try {
        const { id } = req.params
        const { status, reviewNotes, responseMessage, feedback, rating, interviewDate } = req.body
        
        const updateData = {
            reviewedBy: req.adminId,
            reviewNotes,
            responseMessage,
            feedback,
            rating,
            interviewDate
        }
        
        const application = await updateApplicationStatusService(id, status, updateData)
        
        res.status(200).json({
            success: true,
            message: `Application status updated to ${status} successfully`,
            data: application
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update application status'
        })
    }
}