import React from 'react';

const DocumentDetailsPanel = ({ 
  selectedDocument, 
  onClose, 
  onDownload, 
  onVerify, 
  onReject,
  getInitials,
  actionLoading = false
}) => {
  if (!selectedDocument) return null;

  return (
    <div className="w-96 border-l border-gray-100 bg-white p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Document Details</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Student Info */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold">
          {getInitials(selectedDocument.userId?.fullName || 'U')}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{selectedDocument.userId?.fullName}</p>
          <p className="text-xs text-gray-400">STU-2024-001</p>
        </div>
      </div>

      {/* Document Info */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Document Type</p>
          <p className="text-sm font-semibold text-gray-900">
            {selectedDocument.documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Document Submitted On</p>
          <p className="text-sm font-semibold text-gray-900">
            {selectedDocument.createdAt ? new Date(selectedDocument.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {selectedDocument.createdAt ? new Date(selectedDocument.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
          </p>
        </div>
      </div>

      {/* Document Preview */}
      <div className="mb-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Document Preview</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          {selectedDocument.fileType?.includes('image') ? (
            <img 
              src={selectedDocument.fileUrl} 
              alt={selectedDocument.fileName}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs text-gray-400">Preview not available</p>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={() => onDownload(selectedDocument)}
          className="mt-2 w-full flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Document
        </button>
      </div>

      {/* Review Actions */}
      {selectedDocument.isVerified === false && (
        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Review Action</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={onVerify}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Verify
                </>
              )}
            </button>
            <button 
              onClick={onReject}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Approve or reject this document</p>
        </div>
      )}

      {/* Notes */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Notes (Optional)</p>
        <textarea 
          placeholder="Add notes here..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
          rows="4"
        />
      </div>
    </div>
  );
};

export default DocumentDetailsPanel;