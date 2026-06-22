import React from 'react';
const PipelineChart = () => {
  const pipelineData = [
    { label: 'Applied', value: 480, width: '100%' },
    { label: 'Shortlisted', value: 310, width: '64%' },
    { label: 'Interviewed', value: 195, width: '40%' },
    { label: 'Offered', value: 130, width: '27%' },
    { label: 'Joined', value: 98, width: '20%' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Placement Pipeline</h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">2024-25</span>
      </div>
      <div className="space-y-6">
        {pipelineData.map((item, idx) => (
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