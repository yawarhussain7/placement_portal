import React from 'react';

const DirectoryStatCard = ({ title, metric, trend, isNegative, icon }) => {
  return (
    <div className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 flex justify-between items-center flex-1 min-w-[220px] overflow-hidden">
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 group-hover:from-emerald-50/30 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
      
      <div className="relative z-10 space-y-3">
        <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">{title}</span>
        <div className="flex items-center gap-3">
          <h4 className="text-3xl font-bold text-gray-900 tracking-tight">{metric}</h4>
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-0.5 ${
              isNegative 
                ? 'text-rose-600 bg-rose-50' 
                : 'text-emerald-600 bg-emerald-50'
            }`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isNegative ? "M19 14l-7 7m0 0l-7-7m7 7V3" : "M5 10l7-7m0 0l7 7m-7-7v18"} />
              </svg>
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={`relative z-10 p-3.5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 text-gray-600 group-hover:from-emerald-50 group-hover:to-emerald-100/50 group-hover:text-emerald-600 transition-all duration-300`}>
        {icon}
      </div>
    </div>
  );
};

export default DirectoryStatCard;