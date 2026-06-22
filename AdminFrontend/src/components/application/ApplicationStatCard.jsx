import React from 'react';

const ApplicationStatCard = ({ label, count, colorConfig }) => {
  return (
    <div className={`p-5 rounded-xl border transition-all duration-200 flex-1 min-w-[150px] ${colorConfig.bg} ${colorConfig.border}`}>
      <span className={`text-2xl font-bold tracking-tight block ${colorConfig.text}`}>
        {count}
      </span>
      <span className="text-xs font-semibold text-gray-500 mt-1 block">
        {label}
      </span>
    </div>
  );
};

export default ApplicationStatCard;