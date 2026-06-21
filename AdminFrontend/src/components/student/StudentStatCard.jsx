import React from 'react';

const StudentStatCard = ({ title, metric, context, icon, progress }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-gray-200/60 group relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
          <h4 className="text-3xl font-bold text-gray-900 tracking-tight">{metric}</h4>
        </div>
        <div className="p-3 bg-[#EFFDF4] text-[#22C55E] rounded-xl group-hover:bg-[#22C55E] group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
      </div>
      
      <div>
        <p className="text-xs text-gray-500 font-medium">{context}</p>
        {progress !== undefined && (
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#22C55E] h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentStatCard;