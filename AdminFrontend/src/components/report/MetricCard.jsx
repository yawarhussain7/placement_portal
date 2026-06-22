import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const MetricCard = ({ label, value, change, icon: Icon }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-start group">
      <div className="space-y-1">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-black text-slate-900">{value}</h3>
        <div className="pt-1">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            <FiTrendingUp className="w-3 h-3" /> 
            {change}
          </span>
        </div>
      </div>
      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
        <Icon className="w-5 h-5 stroke-[2.5]" />
      </div>
    </div>
  );
};

export default MetricCard;