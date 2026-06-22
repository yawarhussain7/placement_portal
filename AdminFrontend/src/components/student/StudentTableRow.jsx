import React from 'react';

const StudentTableRow = ({ student }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Placed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Active': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Offered': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Inactive': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <tr className="hover:bg-gray-50/40 transition-colors duration-150 text-xs font-medium text-gray-600 border-b border-gray-100">
      <td className="px-6 py-4 flex items-center gap-3 font-bold text-gray-900 tracking-tight">
        <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover border border-gray-150" />
        {student.name}
      </td>
      <td className="px-6 py-4 font-mono text-gray-400 uppercase">{student.enrollmentNo}</td>
      <td className="px-6 py-4 text-gray-500">{student.course}</td>
      <td className="px-6 py-4 font-bold text-gray-900">{student.cgpa.toFixed(2)}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(student.status)}`}>
          {student.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-700">{student.placedAt || '—'}</td>
      <td className="px-6 py-4 text-right space-x-2">
        <button className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">View</button>
        <span className="text-gray-200">|</span>
        <button className="text-gray-400 hover:text-gray-600 font-bold transition-colors">Edit</button>
      </td>
    </tr>
  );
};

export default StudentTableRow;