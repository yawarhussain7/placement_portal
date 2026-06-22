import React from 'react';

const DepartmentProgressCard = ({ data = [] }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Distribution</h4>
      </div>

      <div className="space-y-6 flex-1">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">{item.dept}</span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400">{item.count} students</span>
                <span className="text-[11px] font-black text-emerald-600 w-8 text-right">{item.percentage}%</span>
              </div>
            </div>
            
            {/* Progress Track */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentProgressCard;