import React from 'react';
import StudentTableRow from './StudentTableRow';

const StudentTable = ({ 
  students, 
  loading, 
  currentFilter, 
  setCurrentFilter, 
  onViewStudent, 
  onEditStudent,
  onDeleteStudent,
  selectedStudents,
  onSelectStudent,
  onSelectAll 
}) => {
  const filterTabs = ['All', 'Active', 'Inactive'];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Secondary Segment Filter Tabs Strip */}
      <div className="flex items-center gap-0 px-6 bg-white pt-3">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab;
          const count = tab === 'All' 
            ? students.length 
            : students.filter(s => (tab === 'Active' ? s.isActive : !s.isActive)).length;

          return (
            <button
              key={tab}
              onClick={() => setCurrentFilter(tab)}
              className={`relative px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                isActive 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              <span className="ml-1.5 text-[10px] font-medium text-gray-400">({count})</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dense Data Layout Grid Panel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-slate-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === students.length && students.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4">Active</th>
              <th className="px-6 py-4">Verified</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {loading ? (
               <tr>
                 <td colSpan="8" className="px-6 py-10 text-center">
                   <div className="flex items-center justify-center gap-2">
                     <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                     <span className="text-xs font-medium text-gray-500">Loading students...</span>
                   </div>
                 </td>
               </tr>
              ) : students.length > 0 ? (
                students.map((student, idx) => (
                  <StudentTableRow 
                    key={student._id || idx} 
                    student={student} 
                    onView={onViewStudent} 
                    onEdit={onEditStudent}
                    onDelete={onDeleteStudent}
                    isSelected={selectedStudents.includes(student._id)}
                    onSelect={onSelectStudent}
                  />
                ))
             ) : (
               <tr>
                 <td colSpan="8" className="px-6 py-10 text-center text-xs font-medium text-gray-400">
                   No students matching current filter parameters found.
                 </td>
               </tr>
             )}
          </tbody>
        </table>
      </div>

      {/* Interface Footer Pagination Segment */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-gray-600">
            Showing <span className="text-gray-900 font-bold">{students.length}</span> students
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-8 h-8 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-500/20 hover:bg-emerald-700 transition-colors">1</button>
          <button className="w-8 h-8 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors hover:border-gray-200 border border-transparent">2</button>
          <button className="w-8 h-8 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors hover:border-gray-200 border border-transparent">3</button>
          <button className="w-8 h-8 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors hover:border-gray-200 border border-transparent">4</button>
          <button className="w-8 h-8 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors hover:border-gray-200 border border-transparent">5</button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;