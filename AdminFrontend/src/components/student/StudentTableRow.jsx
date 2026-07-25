import React from 'react';

const StudentTableRow = ({ student, onView, onEdit, onDelete, isSelected, onSelect }) => {
  return (
    <tr className="group hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-transparent transition-all duration-200 text-xs font-medium text-gray-600 border-b border-gray-100 last:border-b-0">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect && onSelect(student._id, e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={student.avatar || '/default_user.png'} 
              alt={student.fullName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default_user.png';
              }}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 group-hover:border-emerald-200 transition-colors" 
            />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center`}>
              <div className={`w-2 h-2 rounded-full ${
                student.isActive ? 'bg-emerald-500' : 'bg-gray-400'
              }`} />
            </div>
          </div>
          <div>
            <span className="font-bold text-gray-900 tracking-tight block">{student.fullName}</span>
            <span className="text-[10px] text-gray-400">@{student.username}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all">{student.email}</span>
      </td>
      <td className="px-6 py-4 text-gray-600">{student.phone || <span className="text-gray-400">—</span>}</td>
      <td className="px-6 py-4 text-gray-600">{student.gender || <span className="text-gray-400">—</span>}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
          student.isActive 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-gray-100 text-gray-600 border-gray-200'
        }`}>
          {student.isActive ? 'Yes' : 'No'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
          student.isVerified 
            ? 'bg-blue-50 text-blue-700 border-blue-200' 
            : 'bg-gray-100 text-gray-600 border-gray-200'
        }`}>
          {student.isVerified ? 'Yes' : 'No'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => onView && onView(student)} 
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button 
            onClick={() => onEdit && onEdit(student)} 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete && onDelete(student._id)} 
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentTableRow;