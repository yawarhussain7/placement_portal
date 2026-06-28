import React from 'react';

const PipelineChart = ({ data = [] }) => {
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;
  const formattedData = data.map(item => ({
    label: item.label,
    value: item.value,
    width: `${((item.value) / maxValue) * 100}%`
  }));

  const displayData = formattedData.length > 0 ? formattedData : [
    { label: 'Applied', value: 0, width: '0%' },
    { label: 'Shortlisted', value: 0, width: '0%' },
    { label: 'Interviewed', value: 0, width: '0%' },
    { label: 'Offered', value: 0, width: '0%' },
    { label: 'Joined', value: 0, width: '0%' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Placement Pipeline</h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">2026-27</span>
      </div>
      <div className="space-y-6">
        {displayData.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500">
              <span>{item.label}</span>
              <span className="text-slate-900">{item.value}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-green-600 h-full rounded-full transition-all duration-700" style={{ width: item.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineChart;