import React from 'react';

const DocumentTable = ({ 
  documents, 
  loading, 
  selectedDocument, 
  onDocumentClick, 
  onDownload, 
  onVerify, 
  onReject,
  getStatusBadge,
  getInitials
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
            <th className="px-6 py-3.5">Student</th>
            <th className="px-6 py-3.5">Document Type</th>
            <th className="px-6 py-3.5">File</th>
            <th className="px-6 py-3.5">Submitted On</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium text-sm">
                Loading documents...
              </td>
            </tr>
          ) : documents.length > 0 ? (
            documents.map((doc) => (
              <tr 
                key={doc._id} 
                className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedDocument?._id === doc._id ? 'bg-emerald-50/30' : ''}`}
                onClick={() => onDocumentClick(doc)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                      {getInitials(doc.userId?.fullName || 'U')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{doc.userId?.fullName}</p>
                      <p className="text-xs text-gray-400">STU-2024-001</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {doc.documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-medium text-gray-600 max-w-xs truncate" title={doc.fileName}>
                    {doc.fileName}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {(doc.fileSize / 1024).toFixed(0)} KB
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-medium text-gray-600">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(doc.isVerified)}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => {
                      e.stopPropagation();
                      console.log('Action buttons clicked for doc:', doc._id, 'isVerified:', doc.isVerified);
                    }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Download clicked');
                          onDownload(doc);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      {doc.isVerified === false && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Verify button clicked in table');
                              onVerify(doc);
                            }}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Verify"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Reject button clicked in table');
                              onReject(doc);
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Reject"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-xs font-medium text-gray-400">
                No documents found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;