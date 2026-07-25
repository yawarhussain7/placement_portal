import React from 'react';
import { FiClock, FiChevronRight } from 'react-icons/fi';

const UpcomingDrives = ({ upcomingDrives }) => {
  if (!upcomingDrives || upcomingDrives.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">Upcoming Drives</h3>
          <p className="text-xs text-gray-500 mt-0.5">Recent applications</p>
        </div>
        <button className="text-emerald-600 hover:text-emerald-700 transition-colors">
          <FiClock className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5">
        {upcomingDrives.map((drive, index) => (
          <div
            key={index}
            className="group flex items-center gap-3 bg-gray-50 rounded-lg p-2.5 hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all duration-200 cursor-pointer"
          >
            <div className={`w-11 h-11 bg-${drive.color}-100 rounded-lg flex flex-col items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0`}>
              <span className="text-xs font-bold text-gray-900">{drive.date.split(' ')[0]}</span>
              <span className="text-[8px] font-semibold text-gray-600">{drive.date.split(' ')[1]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                {drive.company}
              </h4>
              <p className="text-[10px] text-gray-500 mt-0.5">{drive.roles} • {drive.students}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-semibold text-gray-700">{drive.time}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                  drive.status === 'Active' ? 'bg-green-100 text-green-700' :
                  drive.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {drive.status}
                </span>
              </div>
            </div>
            <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>

      <button className="w-full mt-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-xs font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md">
        View All Drives
      </button>
    </div>
  );
};

export default UpcomingDrives;