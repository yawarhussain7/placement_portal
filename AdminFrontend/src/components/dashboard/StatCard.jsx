import React from 'react';
const StatCard = ({ title, count, change, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between">
    <div className="space-y-1">
      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">{title}</span>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-black text-slate-900">{count}</span>
        <span className="text-[11px] font-bold text-green-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
          {change}
        </span>
      </div>
    </div>
    <div className="p-3 bg-emerald-50 text-green-600 rounded-lg">
      {icon}
    </div>
  </div>
);

export default StatCard;