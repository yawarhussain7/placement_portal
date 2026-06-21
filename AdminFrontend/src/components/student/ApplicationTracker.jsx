import React from 'react';

const ApplicationTracker = () => {
  const loops = [
    { company: 'Google', role: 'Software Engineer Intern', date: 'June 18, 2026', status: 'Interview' },
    { company: 'Microsoft', role: 'Technical Consultant', date: 'June 12, 2026', status: 'Offered' },
    { company: 'Amazon', role: 'AWS Cloud Associate', date: 'June 05, 2026', status: 'In Review' },
    { company: 'Deloitte', role: 'Business Analyst', date: 'May 28, 2026', status: 'Rejected' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Offered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Interview': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'In Review': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900 text-base tracking-tight">Your Job Applications</h3>
          <p className="text-xs text-gray-400 font-medium">Real-time status updates of your hiring rounds</p>
        </div>
        <button className="text-xs font-bold text-[#22C55E] hover:text-[#16A34A] bg-[#EFFDF4] px-2.5 py-1 rounded-lg transition-colors">
          Explore Open Jobs
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EFF3F0]/60 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4">Hiring Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-600 font-medium">
            {loops.map((loop, idx) => (
              <tr key={idx} className="hover:bg-gray-50/40 transition-colors duration-150">
                <td className="px-6 py-4 font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full" />
                  {loop.company}
                </td>
                <td className="px-6 py-4 font-medium text-gray-600">{loop.role}</td>
                <td className="px-6 py-4 text-gray-400">{loop.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(loop.status)}`}>
                    {loop.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50/20 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 px-3 py-1.5 rounded-lg transition-all">
                    Track Journey
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

export default ApplicationTracker;