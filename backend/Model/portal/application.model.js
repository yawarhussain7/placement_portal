import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  // User reference (links to the student who submitted the application)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Students',
    required: [true, 'User reference is required']
  },

  // Placement reference (links to the placement being applied for)
  placementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Placement',
    required: [true, 'Placement reference is required']
  },

  // Application details
  coverLetter: {
    type: String,
    trim: true,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },

  // Additional information
  additionalInfo: {
    type: String,
    trim: true,
    maxlength: [1000, 'Additional information cannot exceed 1000 characters']
  },

  // Documents
  documents: {
    resume: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    portfolio: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    certificates: [{
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    }]
  },

  // Application status
  status: {
    type: String,
    enum: {
      values: ['draft', 'submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn'],
      message: 'Invalid application status'
    },
    default: 'draft'
  },

  // Important dates
  submittedAt: {
    type: Date
  },

  reviewedAt: {
    type: Date
  },

  interviewDate: {
    type: Date
  },

  respondedAt: {
    type: Date
  },

  // Review information
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Students'
  },

  reviewNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Review notes cannot exceed 500 characters']
  },

  // Response details
  responseMessage: {
    type: String,
    trim: true,
    maxlength: [1000, 'Response message cannot exceed 1000 characters']
  },

  // Feedback
  feedback: {
    type: String,
    trim: true,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },

  // Rating (if applicable)
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },

  // Additional metadata
  source: {
    type: String,
    trim: true,
    enum: {
      values: ['portal', 'email', 'referral', 'career_fair', 'other'],
      message: 'Invalid application source'
    },
    default: 'portal'
  },

  isViewed: {
    type: Boolean,
    default: false
  },

  isStarred: {
    type: Boolean,
    default: false
  },

  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Invalid priority level'
    },
    default: 'medium'
  }

}, {
  timestamps: true,
  versionKey: false
})

// Indexes for better query performance
applicationSchema.index({ userId: 1, status: 1 })
applicationSchema.index({ placementId: 1, status: 1 })
applicationSchema.index({ createdAt: -1 })
applicationSchema.index({ submittedAt: -1 })
applicationSchema.index({ status: 1, priority: 1 })

// Virtual for application ID
applicationSchema.virtual('applicationId').get(function() {
  return this._id.toString()
})

// Ensure virtuals are included in JSON
applicationSchema.set('toJSON', { virtuals: true })
applicationSchema.set('toObject', { virtuals: true })

// Pre-save middleware to set submittedAt when status changes to submitted
applicationSchema.pre('save', function() {
  if (this.isModified('status') && this.status === 'submitted' && !this.submittedAt) {
    this.submittedAt = new Date()
  }
})

// Pre-save middleware to set reviewedAt when status changes
applicationSchema.pre('save', function() {
  if (this.isModified('status') && ['under_review', 'shortlisted', 'accepted', 'rejected'].includes(this.status) && !this.reviewedAt) {
    this.reviewedAt = new Date()
  }
})

// Pre-save middleware to set respondedAt when final decision is made
applicationSchema.pre('save', function() {
  if (this.isModified('status') && ['accepted', 'rejected', 'withdrawn'].includes(this.status) && !this.respondedAt) {
    this.respondedAt = new Date()
  }
})

const ApplicationModel = mongoose.model('Application', applicationSchema)

export default ApplicationModel