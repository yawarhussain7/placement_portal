import ApplicationModel from '../../Model/portal/application.model.js'

// Create a new application
export const createApplicationService = async (applicationData) => {
  try {
    console.log('Creating application with data:', JSON.stringify(applicationData, null, 2))
    const application = new ApplicationModel(applicationData)
    console.log('Application model created, attempting to save...')
    const savedApplication = await application.save()
    console.log('Application saved successfully:', savedApplication._id)
    return savedApplication
  } catch (error) {
    console.error('Full error details:', error)
    console.error('Error stack:', error.stack)
    throw new Error(`Error creating application: ${error.message}`)
  }
}

// Get application by ID
export const getApplicationByIdService = async (applicationId) => {
  try {
    const application = await ApplicationModel.findById(applicationId)
      .populate('userId', 'fullName username email phone')
      .populate('placementId', 'personal.fullName course.course preference.industry')
      .populate('reviewedBy', 'fullName username email')

    if (!application) {
      throw new Error('Application not found')
    }

    return application
  } catch (error) {
    throw new Error(`Error fetching application: ${error.message}`)
  }
}

// Get applications by user ID
export const getApplicationsByUserIdService = async (userId, filters = {}) => {
  try {
    const query = { userId, ...filters }
    let applications = await ApplicationModel.find(query)
      .populate('placementId', 'personal.fullName course.course preference.industry preference.location')
      .populate('reviewedBy', 'fullName username')
      .sort({ createdAt: -1 })

    // If no applications found, return default sample data for the user
    if (applications.length === 0) {
      console.log('No applications found for user, creating sample applications')
      // Create sample applications for the current user
      applications = await getOrCreateSampleApplications(userId)
    }

    return applications
  } catch (error) {
    throw new Error(`Error fetching user applications: ${error.message}`)
  }
}

// Helper function to get or create sample applications
const getOrCreateSampleApplications = async (userId) => {
  try {
    console.log('Creating sample applications for user:', userId)
    
    // Import PlacementModel
    const PlacementModel = (await import('../../Model/portal/placement.model.js')).default
    
    console.log('Models loaded successfully')

    const sampleData = [
      {
        role: 'Frontend Developer Internship',
        company: 'Northbridge Digital',
        status: 'draft',
        notes: 'Prepare portfolio examples and a short intro.',
      },
      {
        role: 'Junior QA Analyst',
        company: 'BrightLabs Studio',
        status: 'draft',
        notes: 'Waiting for transcript verification.',
      },
      {
        role: 'UI/UX Design Assistant',
        company: 'Crafton Systems',
        status: 'draft',
        notes: 'Initial application submitted.',
      },
    ]

    const applications = []

    for (const appData of sampleData) {
      try {
        // Find or create placement
        let placement = await PlacementModel.findOne({ 
          'personal.fullName': appData.company 
        })
        
        if (!placement) {
          placement = await PlacementModel.create({
            personal: {
              fullName: appData.company,
              email: `contact@${appData.company.toLowerCase().replace(/\s/g, '')}.com`,
              phoneNumber: '+61212345678',
              phoneCountry: '+61',
              dob: new Date('1995-01-01'),
              gender: 'Prefer not to say',
              address: '123 Business Street',
              suburb: 'Sydney',
              state: 'NSW',
              postcode: '2000',
              isCitizen: 'Yes'
            },
            course: {
              course: appData.role,
              institution: 'University of Technology',
              courseCode: 'CS101',
              studyStatus: 'Final Year',
              completionDate: new Date('2026-12-01'),
              studyMode: 'full-time',
              placementReason: 'mandatory'
            },
            preference: {
              industry: 'Technology',
              role: appData.role,
              location: 'Sydney',
              relocate: 'no',
              availability: 'Immediate',
              workingHours: 'Full-time',
              placementType: 'on-site'
            },
            userId: userId,
            status: 'approved'
          })
          console.log('Created placement:', placement._id)
        }
        
        // Create application
        const application = await ApplicationModel.create({
          userId: userId,
          placementId: placement._id,
          status: appData.status,
          coverLetter: appData.notes,
          submittedAt: appData.status !== 'draft' ? new Date() : undefined,
          reviewedAt: ['under_review', 'interview_scheduled'].includes(appData.status) ? new Date() : undefined
        })

        console.log('Created application:', application._id)

        // Populate the application before adding to array
        await application.populate('placementId', 'personal.fullName course.course')
        await application.populate('reviewedBy', 'fullName username')
        
        applications.push(application)
      } catch (appError) {
        console.error('Error creating sample application:', appData, appError)
        // Continue with next sample even if one fails
      }
    }

    console.log(`Created ${applications.length} sample applications`)
    return applications
  } catch (error) {
    console.error('Error creating sample applications:', error)
    console.error('Error stack:', error.stack)
    return []
  }
}

// Get applications by placement ID
export const getApplicationsByPlacementIdService = async (placementId, filters = {}) => {
  try {
    const query = { placementId, ...filters }
    const applications = await ApplicationModel.find(query)
      .populate('userId', 'fullName username email phone')
      .populate('reviewedBy', 'fullName username')
      .sort({ createdAt: -1 })

    return applications
  } catch (error) {
    throw new Error(`Error fetching placement applications: ${error.message}`)
  }
}

// Get all applications with filters
export const getAllApplicationsService = async (filters = {}, pagination = {}) => {
  try {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = pagination
    const skip = (page - 1) * limit

    const applications = await ApplicationModel.find(filters)
      .populate('userId', 'fullName username email')
      .populate('placementId', 'personal.fullName course.course')
      .populate('reviewedBy', 'fullName username')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    const total = await ApplicationModel.countDocuments(filters)

    return {
      applications,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    throw new Error(`Error fetching applications: ${error.message}`)
  }
}

// Update application
export const updateApplicationService = async (applicationId, updateData) => {
  try {
    const application = await ApplicationModel.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName username email')
      .populate('placementId', 'personal.fullName course.course')

    if (!application) {
      throw new Error('Application not found')
    }

    return application
  } catch (error) {
    throw new Error(`Error updating application: ${error.message}`)
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
    throw new Error(`Error updating application status: ${error.message}`)
  }
}

// Delete application
export const deleteApplicationService = async (applicationId) => {
  try {
    const application = await ApplicationModel.findByIdAndDelete(applicationId)

    if (!application) {
      throw new Error('Application not found')
    }

    return application
  } catch (error) {
    throw new Error(`Error deleting application: ${error.message}`)
  }
}

// Upload document to application
export const uploadDocumentService = async (applicationId, documentType, documentData) => {
  try {
    const updateFields = {
      [`documents.${documentType}.fileName`]: documentData.fileName,
      [`documents.${documentType}.fileUrl`]: documentData.fileUrl,
      [`documents.${documentType}.uploadedAt`]: new Date()
    }

    const application = await ApplicationModel.findByIdAndUpdate(
      applicationId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('userId', 'fullName username')
      .populate('placementId', 'personal.fullName course.course')

    if (!application) {
      throw new Error('Application not found')
    }

    return application
  } catch (error) {
    throw new Error(`Error uploading document: ${error.message}`)
  }
}

// Remove document from application
export const removeDocumentService = async (applicationId, documentType) => {
  try {
    const updateFields = {
      [`documents.${documentType}.fileName`]: null,
      [`documents.${documentType}.fileUrl`]: null,
      [`documents.${documentType}.uploadedAt`]: null
    }

    const application = await ApplicationModel.findByIdAndUpdate(
      applicationId,
      { $set: updateFields },
      { new: true }
    ).populate('userId', 'fullName username')
      .populate('placementId', 'personal.fullName course.course')

    if (!application) {
      throw new Error('Application not found')
    }

    return application
  } catch (error) {
    throw new Error(`Error removing document: ${error.message}`)
  }
}

// Mark application as viewed
export const markAsViewedService = async (applicationId) => {
  try {
    const application = await ApplicationModel.findByIdAndUpdate(
      applicationId,
      { $set: { isViewed: true } },
      { new: true }
    ).populate('userId', 'fullName username email')

    if (!application) {
      throw new Error('Application not found')
    }

    return application
  } catch (error) {
    throw new Error(`Error marking application as viewed: ${error.message}`)
  }
}

// Toggle star on application
export const toggleStarService = async (applicationId) => {
  try {
    const application = await ApplicationModel.findById(applicationId)
    
    if (!application) {
      throw new Error('Application not found')
    }

    const updatedApplication = await ApplicationModel.findByIdAndUpdate(
      applicationId,
      { $set: { isStarred: !application.isStarred } },
      { new: true }
    ).populate('userId', 'fullName username email')
      .populate('placementId', 'personal.fullName course.course')

    return updatedApplication
  } catch (error) {
    throw new Error(`Error toggling star: ${error.message}`)
  }
}

// Update application priority
export const updatePriorityService = async (applicationId, priority) => {
  try {
    const application = await ApplicationModel.findByIdAndUpdate(
      applicationId,
      { $set: { priority } },
      { new: true, runValidators: true }
    ).populate('userId', 'fullName username email')
      .populate('placementId', 'personal.fullName course.course')

    if (!application) {
      throw new Error('Application not found')
    }

    return application
  } catch (error) {
    throw new Error(`Error updating priority: ${error.message}`)
  }
}

// Get application statistics
export const getApplicationStatsService = async (userId) => {
  try {
    const stats = await ApplicationModel.aggregate([
      { $match: { userId: new (await import('mongoose')).default.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const totalApplications = await ApplicationModel.countDocuments({ userId })
    const pendingApplications = await ApplicationModel.countDocuments({
      userId,
      status: { $in: ['draft', 'submitted', 'under_review'] }
    })

    return {
      total: totalApplications,
      pending: pendingApplications,
      byStatus: stats
    }
  } catch (error) {
    throw new Error(`Error fetching application statistics: ${error.message}`)
  }
}

// Check if user has already applied to a placement
export const checkExistingApplicationService = async (userId, placementId) => {
  try {
    const existingApplication = await ApplicationModel.findOne({
      userId,
      placementId,
      status: { $nin: ['withdrawn'] }
    })

    return existingApplication
  } catch (error) {
    throw new Error(`Error checking existing application: ${error.message}`)
  }
}

// Withdraw application
export const withdrawApplicationService = async (applicationId, userId) => {
  try {
    const application = await ApplicationModel.findOneAndUpdate(
      { _id: applicationId, userId },
      { 
        $set: { 
          status: 'withdrawn',
          respondedAt: new Date()
        } 
      },
      { new: true, runValidators: true }
    ).populate('userId', 'fullName username')
      .populate('placementId', 'personal.fullName course.course')

    if (!application) {
      throw new Error('Application not found or unauthorized')
    }

    return application
  } catch (error) {
    throw new Error(`Error withdrawing application: ${error.message}`)
  }
}