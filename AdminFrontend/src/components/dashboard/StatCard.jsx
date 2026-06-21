import React from 'react';

const StatCard = ({ title, count, change, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div className="space-y-2">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-gray-900">{count}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            {change}
          </span>
        </div>
      </div>
      <div className="p-2.5 bg-[#EFFDF4] text-[#22C55E] rounded-lg">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;