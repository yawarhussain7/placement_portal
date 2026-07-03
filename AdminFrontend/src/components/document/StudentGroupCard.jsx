import React, { useState } from 'react';
import StudentDocRow from './StudentDocRow';

const StudentGroupCard = ({ student }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-4">
      {/* Accordion Header row matching DocumentsPage.jpg */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <img src={student.avatar} alt={student.name} className="w-11 h-11 rounded-full object-cover border border-gray-100" />
          <div>
            <h4 className="font-bold text-gray-900 tracking-tight">{student.name}</h4>
            <p className="text-xs font-semibold text-gray-400 uppercase">{student.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-1 justify-end max-w-md w-full">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{student.uploadedCount} docs uploaded</span>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${student.progress}%` }} />
              </div>
            <span className="text-xs font-bold text-gray-700 w-8 text-right">{student.progress}%</span>
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
          >
            {isOpen ? 'Hide Details' : 'View All'}
          </button>
        </div>
      </div>

      {/* Expanded Document Grid Area */}
      {isOpen && (
        <div className="pt-2 space-y-2 border-t border-gray-50 animate-fadeIn">
          {student.docs.map((doc, idx) => (
            <StudentDocRow key={idx} {...doc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentGroupCard;