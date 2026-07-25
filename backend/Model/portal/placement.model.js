import mongoose from 'mongoose'

const placementSchema = new mongoose.Schema({
  //* Personal Details
  personal: {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    phoneCountry: {
      type: String,
      default: '+61'
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female', 'Prefer not to say'],
        message: 'Please select a valid gender'
      }
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    suburb: {
      type: String,
      required: [true, 'Suburb is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      enum: {
        values: ['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
        message: 'Please select a valid state'
      }
    },
    postcode: {
      type: String,
      required: [true, 'Postcode is required'],
      trim: true
    },
    isCitizen: {
      type: String,
      required: [true, 'Citizenship status is required'],
      enum: {
        values: ['Yes', 'No'],
        message: 'Please select Yes or No'
      }
    }
  },

  // Course/Education Details
  course: {
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true
    },
    courseCode: {
      type: String,
      trim: true
    },
    studyStatus: {
      type: String,
      required: [true, 'Study status is required'],
      enum: {
        values: ['Currently Enrolled', 'Final Semester', 'Final Year', 'Awaiting Results', 'Recently Graduated'],
        message: 'Please select a valid study status'
      }
    },
    completionDate: {
      type: Date,
      required: [true, 'Completion date is required']
    },
    studyMode: {
      type: String,
      required: [true, 'Study mode is required'],
      enum: {
        values: ['full-time', 'part-time', 'online'],
        message: 'Please select a valid study mode'
      }
    },
    placementReason: {
      type: String,
      required: [true, 'Placement reason is required'],
      enum: {
        values: ['mandatory', 'voluntary'],
        message: 'Please select a valid placement reason'
      }
    }
  },

  // Placement Preferences
  preference: {
    industry: {
      type: String,
      required: [true, 'Preferred industry is required'],
      trim: true
    },
    role: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Preferred location is required'],
      trim: true
    },
    relocate: {
      type: String,
      required: [true, 'Relocation preference is required'],
      enum: {
        values: ['yes', 'no'],
        message: 'Please select Yes or No'
      }
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
      trim: true
    },
    workingHours: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    availableDays: [{
      type: String,
      enum: {
        values: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        message: 'Invalid day'
      }
    }],
    placementType: {
      type: String,
      required: [true, 'Placement type is required'],
      enum: {
        values: ['on-site', 'hybrid', 'remote'],
        message: 'Please select a valid placement type'
      }
    }
  },

  // Documents
  documents: {
    resume: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    photoId: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    studentId: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    transcript: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    certificates: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    additional: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    }
  },

  // User reference (links to the user who submitted the placement)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Students',
    required: [true, 'User reference is required']
  },

  // Application status
  status: {
    type: String,
    enum: {
      values: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'completed'],
      message: 'Invalid status'
    },
    default: 'draft'
  },

  // Submission tracking
  submittedAt: {
    type: Date
  },

  // Review information
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Students'
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String,
    trim: true
  },

  // Completion tracking
  completedAt: {
    type: Date
  },
  completionNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// this is for easy find search query use for fast searching
placementSchema.index({ userId: 1, status: 1 })
placementSchema.index({ createdAt: -1 })

// Virtual for full name which is not store in DB but show and access
placementSchema.virtual('fullName').get(function() {
  return this.personal?.fullName
})

// Ensure virtuals are included in JSON
placementSchema.set('toJSON', { virtuals: true })
placementSchema.set('toObject', { virtuals: true })

// Pre-save middleware to set submittedAt when status changes to submitted
placementSchema.pre('save', function() {
  if (this.isModified('status') && this.status === 'submitted' && !this.submittedAt) {
    this.submittedAt = new Date()
  }
})

const PlacementModel = mongoose.model('Placement', placementSchema)

export default PlacementModel