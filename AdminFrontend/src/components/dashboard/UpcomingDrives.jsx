import React from 'react';
import { FiHome } from 'react-icons/fi';

const UpcomingDrives = () => {
  const drives = [
    { company: 'Wipro', details: '3 roles · 142 students', date: 'Jan 18' },
    { company: 'Amazon', details: '2 roles · 89 students', date: 'Jan 22' },
    { company: 'Cognizant', details: '5 roles · 211 students', date: 'Feb 1' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full lg:w-80 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-base">Upcoming Drives</h3>
        <button className="text-xs font-bold text-[#22C55E] hover:underline">See all</button>
      </div>
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        {drives.map((drive, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 border border-gray-50 rounded-lg hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#EFFDF4] text-[#22C55E] rounded-md">
                <FiHome className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{drive.company}</h4>
                <p className="text-xs text-gray-400 font-medium">{drive.details}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100/50 px-2 py-1 rounded">
              {drive.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDrives;