import React from 'react';
import { FiFile, FiCheckCircle, FiXCircle, FiAlertCircle, FiEye } from 'react-icons/fi';

const AdminDocumentRow = ({ doc, onVerify, onReject, onView }) => {
  const getStatusMarkup = (status) => {
    switch (status) {
      case 'Verified': 
        return <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600"><FiCheckCircle /> Verified</span>;
      case 'Rejected': 
        return <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600"><FiXCircle /> Rejected</span>;
      case 'Pending Approval': 
        return <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500"><FiAlertCircle /> Pending Review</span>;
      default: 
        return <span className="text-[11px] font-bold text-gray-400">Missing</span>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="p-3 bg-gray-50 rounded-xl text-gray-400 border border-gray-100">
          <FiFile className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-800">{doc.name}</h4>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{doc.meta || 'No file uploaded yet'}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-between sm:justify-end">
        {getStatusMarkup(doc.status)}
        
        {doc.status !== 'Missing' && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => onView && onView(doc)} className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors" title="View Document">
              <FiEye className="w-3.5 h-3.5" />
            </button>
            {doc.status === 'Pending Approval' && (
              <>
                <button 
                  onClick={() => onVerify(doc.id)} 
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded transition-colors"
                >
                  Approve
                </button>
                <button 
                  onClick={() => onReject(doc.id)} 
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded transition-colors"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocumentRow;