import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  // Document details
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
    trim: true
  },
  
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    trim: true
  },
  
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  
  // Document category/type
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    trim: true,
    enum: {
      values: [
        'resume',
        'cv',
        'cover_letter',
        'portfolio',
        'transcript',
        'certificate',
        'photo_id',
        'student_id',
        'reference_letter',
        'additional'
      ],
      message: 'Please select a valid document type'
    }
  },
  
  // User reference (who uploaded the document)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Students',
    required: [true, 'User reference is required']
  },
  
  // Optional references to link documents to specific entities
  placementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Placement'
  },
  
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  
  // Document metadata
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  // Document status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  verifiedAt: {
    type: Date
  },
  
  // Version control
  version: {
    type: Number,
    default: 1
  },
  
  isLatest: {
    type: Boolean,
    default: true
  },
  
  // Access control
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Download tracking
  downloadCount: {
    type: Number,
    default: 0
  },
  
  lastDownloadedAt: {
    type: Date
  }
  
}, {
  timestamps: true,
  versionKey: false
})

// Indexes for better query performance
documentSchema.index({ userId: 1, documentType: 1 })
documentSchema.index({ userId: 1, createdAt: -1 })
documentSchema.index({ placementId: 1 })
documentSchema.index({ applicationId: 1 })
documentSchema.index({ documentType: 1, isVerified: 1 })
documentSchema.index({ createdAt: -1 })

// Virtual for document ID
documentSchema.virtual('documentId').get(function() {
  return this._id.toString()
})

// Ensure virtuals are included in JSON
documentSchema.set('toJSON', { virtuals: true })
documentSchema.set('toObject', { virtuals: true })

const DocumentModel = mongoose.model('Document', documentSchema)

// Pre-save middleware to update version when creating new version
documentSchema.pre('save', function(next) {
  if (this.isNew && this.isLatest) {
    // If this is marked as latest, unmark other versions
    DocumentModel.updateMany(
      { 
        userId: this.userId, 
        documentType: this.documentType,
        _id: { $ne: this._id }
      },
      { isLatest: false }
    ).exec()
  }
  next()
})

export default DocumentModel