import React from 'react';

const RecentApplicationsTable = () => {
  const applications = [
    { student: 'Aarav Mehta', course: 'B.Tech CSE', company: 'Google', status: 'Selected' },
    { student: 'Priya Sharma', course: 'MBA Finance', company: 'Deloitte', status: 'Pending' },
    { student: 'Leo Thompson', course: 'B.Tech ECE', company: 'Infosys', status: 'Rejected' },
    { student: 'Nia Osei', course: 'MCA', company: 'TCS', status: 'Selected' },
    { student: 'Carlos Rivera', course: 'B.Tech IT', company: 'Microsoft', status: 'In Review' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Selected': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'In Review': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-50">
        <h3 className="font-bold text-gray-900 text-base">Recent Applications</h3>
        <button className="text-xs font-bold text-[#22C55E] hover:underline">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EFF3F0] text-gray-600 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {applications.map((app, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3.5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500 border border-gray-200">
                    {app.student.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900">{app.student}</span>
                </td>
                <td className="px-6 py-3.5 text-gray-500 font-medium">{app.course}</td>
                <td className="px-6 py-3.5 font-medium text-gray-800">{app.company}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold border ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <button className="text-xs font-bold text-green-600 hover:text-emerald-800 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/30 px-2.5 py-1 rounded transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplicationsTable;