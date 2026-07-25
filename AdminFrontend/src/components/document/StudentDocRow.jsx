import React from 'react';

const StudentDocRow = ({ name, size, date, isRequired, status, onUpload, onReupload }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Uploaded': 
        return 'text-emerald-600 bg-emerald-50 border border-emerald-100';
      case 'Pending': 
        return 'text-amber-600 bg-amber-50 border border-amber-100';
      case 'Missing': 
        return 'text-rose-600 bg-rose-50 border border-rose-100';
      default: 
        return 'text-gray-500 bg-gray-50 border border-gray-100';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 bg-gray-50/50 rounded-xl border border-gray-100 text-sm gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 text-gray-400 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{name}</span>
            {isRequired && <span className="text-[10px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded">Required</span>}
          </div>
          <span className="text-xs text-gray-400 font-medium">{size} • {date}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:self-center self-end">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getStatusBadge(status)}`}>
          {status}
        </span>
        {status === 'Uploaded' ? (
          <button onClick={() => onReupload && onReupload(name)} className="text-xs font-bold text-gray-600 hover:text-gray-800 border border-gray-200 bg-white px-2.5 py-1 rounded-lg transition-colors">
            Re-upload
          </button>
        ) : (
          <button onClick={() => onUpload && onUpload(name)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 border border-emerald-100 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors">
            Upload
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentDocRow;