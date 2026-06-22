import React from 'react';

const MetricCard = ({ title, description, icon: Icon, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5 animate-fadeIn">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        {Icon && <Icon className="text-gray-400 w-4 h-4 shrink-0" />}
        <div>
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">{title}</h3>
          <p className="text-[10px] text-gray-400 font-medium">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default MetricCard;