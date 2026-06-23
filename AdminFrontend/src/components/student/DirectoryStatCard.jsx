import React from 'react';

const DirectoryStatCard = ({ title, metric, trend, isNegative, icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center flex-1 min-w-[220px]">
      <div className="space-y-3">
        <span className="text-xs font-semibold text-gray-400 tracking-tight">{title}</span>
        <div className="flex items-center gap-3">
          <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{metric}</h4>
          {trend && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
              isNegative 
                ? 'text-rose-600 bg-rose-50' 
                : 'text-emerald-600 bg-emerald-50'
            }`}>
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={`p-3 rounded-xl bg-gray-50 text-gray-500`}>
        {icon}
      </div>
    </div>
  );
};

export default DirectoryStatCard;