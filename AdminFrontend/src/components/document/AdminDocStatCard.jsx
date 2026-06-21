import React from 'react';

const AdminDocStatCard = ({ title, metric, icon, colorClass }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 flex-1">
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
        {icon}
      </div>
      <div>
        <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{metric}</h4>
        <p className="text-xs font-medium text-gray-400 mt-0.5">{title}</p>
      </div>
    </div>
  );
};

export default AdminDocStatCard;