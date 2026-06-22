import React from 'react';
import { FiHome } from 'react-icons/fi';
const UpcomingDrives = () => {
  const drives = [
    { company: 'Wipro', details: '3 roles · 142 students', date: 'Jan 18' },
    { company: 'Amazon', details: '2 roles · 89 students', date: 'Jan 22' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full lg:w-96">
      <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-6">Upcoming Drives</h3>
      <div className="space-y-4">
        {drives.map((drive, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{drive.company}</h4>
              <p className="text-[11px] font-semibold text-slate-400">{drive.details}</p>
            </div>
            <span className="text-[10px] font-black text-green-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">{drive.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDrives;