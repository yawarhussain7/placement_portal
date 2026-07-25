import ApplicationModel from '../../Model/portal/application.model.js'

// Get all applications with filters
export const getAllApplicationsService = async (filters = {}, pagination = {}) => {
    try {
        const { page = 1, limit = 15 } = pagination
        const skip = (page - 1) * limit
        
        // Build query
        const query = {}
        
        if (filters.status) {
            query.status = filters.status
        }
        
        if (filters.search) {
            query.$or = [
                { 'userId.fullName': { $regex: filters.search, $options: 'i' } },
                { 'placementId.personal.fullName': { $regex: filters.search, $options: 'i' } },
                { 'placementId.course.course': { $regex: filters.search, $options: 'i' } }
            ]
        }
        
        // Get total count
        const total = await ApplicationModel.countDocuments(query)
        
        // Get applications with pagination
        const applications = await ApplicationModel.find(query)
            .populate('userId', 'fullName username email phone')
            .populate('placementId', 'personal.fullName course.course preference.industry preference.location')
            .populate('reviewedBy', 'fullName username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        
        // Get stats
        const stats = await ApplicationModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ])
        
        const statsObj = {
            total: await ApplicationModel.countDocuments(),
            inReview: 0,
            selected: 0,
            offered: 0,
            rejected: 0
        }
        
        stats.forEach(stat => {
            switch(stat._id) {
                case 'under_review':
                case 'shortlisted':
                    statsObj.inReview += stat.count
                    break
                case 'accepted':
                    statsObj.offered += stat.count
                    break
                case 'rejected':
                case 'withdrawn':
                    statsObj.rejected += stat.count
                    break
            }
        })
        
        return {
            applications,
            total,
            totalPages: Math.ceil(total / limit),
            stats: statsObj
        }
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch applications')
    }
}

// Get application by ID
export const getApplicationByIdService = async (id) => {
    try {
        const application = await ApplicationModel.findById(id)
            .populate('userId', 'fullName username email phone')
            .populate('placementId', 'personal.fullName course.course preference.industry preference.location')
            .populate('reviewedBy', 'fullName username')
        
        if (!application) {
            throw new Error('Application not found')
        }
        
        return application
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch application')
    }
}

// Update application status
export const updateApplicationStatusService = async (applicationId, status, updateData = {}) => {
    try {
        const { reviewedBy, reviewNotes, responseMessage, feedback, rating, interviewDate } = updateData
        const updateFields = { status }
        
        // Set timestamps based on status
        if (status === 'submitted') {
            updateFields.submittedAt = new Date()
        }
        
        if (['under_review', 'shortlisted', 'accepted', 'rejected'].includes(status)) {
            updateFields.reviewedBy = reviewedBy
            updateFields.reviewedAt = new Date()
            if (reviewNotes) updateFields.reviewNotes = reviewNotes
        }
        
        if (status === 'interview_scheduled') {
            updateFields.interviewDate = interviewDate
        }
        
        if (['accepted', 'rejected', 'withdrawn'].includes(status)) {
            updateFields.respondedAt = new Date()
            if (responseMessage) updateFields.responseMessage = responseMessage
            if (feedback) updateFields.feedback = feedback
            if (rating) updateFields.rating = rating
        }
        
        const application = await ApplicationModel.findByIdAndUpdate(
            applicationId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).populate('userId', 'fullName username email')
          .populate('placementId', 'personal.fullName course.course')
          .populate('reviewedBy', 'fullName username')
        
        if (!application) {
            throw new Error('Application not found')
        }
        
        return application
    } catch (error) {
        throw new Error(error.message || 'Failed to update application status')
    }
}