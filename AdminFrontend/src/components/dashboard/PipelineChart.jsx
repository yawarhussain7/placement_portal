import React from 'react';

const PipelineChart = () => {
  const pipelineData = [
    { label: 'Applied', value: 480, max: 480, width: 'w-full' },
    { label: 'Shortlisted', value: 310, max: 480, width: 'w-[64.5%]' },
    { label: 'Interviewed', value: 195, max: 480, width: 'w-[40.6%]' },
    { label: 'Offered', value: 130, max: 480, width: 'w-[27.1%]' },
    { label: 'Joined', value: 98, max: 480, width: 'w-[20.4%]' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-base">Placement Pipeline</h3>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">2024-25</span>
      </div>
      <div className="space-y-4">
        {pipelineData.map((item, idx) => (
          <div key={idx} className="flex items-center">
            <span className="w-24 text-sm font-medium text-gray-500">{item.label}</span>
            <div className="flex-1 bg-gray-50 rounded-md h-7 relative overflow-hidden border border-gray-100/50">
              <div className={`bg-[#22C55E] h-full ${item.width} transition-all duration-500 ease-out flex items-center justify-end px-3 rounded-md`}>
                <span className="text-xs font-bold text-white z-10">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineChart;