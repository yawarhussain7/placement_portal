import DocumentModel from '../../Model/portal/document.model.js'

// Get all documents with population
export const getAllDocumentService = async()=>{
    return await DocumentModel.find()
        .populate('userId', '_id fullName email phone enrollmentNo')
        .populate('verifiedBy', '_id fullName email')
        .sort({ createdAt: -1 })
}

// Get single document by ID
export const SelectedDocumentService = async({file_id})=>{
    const file = await DocumentModel.findById(file_id)
        .populate('userId', '_id fullName email phone enrollmentNo')
        .populate('verifiedBy', '_id fullName email')
    
    if(!file){
        throw new Error('File not found')
    }
    return file;
}

// Verify document
export const verifyDocumentService = async(documentId, verifiedBy)=>{
    const document = await DocumentModel.findByIdAndUpdate(
        documentId,
        {
            isVerified: true,
            verifiedBy: verifiedBy,
            verifiedAt: new Date()
        },
        { new: true }
    )
    
    if(!document){
        throw new Error('Document not found')
    }
    
    return document;
}

// Reject document
export const rejectDocumentService = async(documentId, rejectedBy)=>{
    const document = await DocumentModel.findByIdAndUpdate(
        documentId,
        {
            isVerified: false,
            verifiedBy: rejectedBy,
            verifiedAt: new Date()
        },
        { new: true }
    )
    
    if(!document){
        throw new Error('Document not found')
    }
    
    return document;
}
