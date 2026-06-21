import React from 'react';

const DriveAlertPanel = () => {
  const alerts = [
    { company: 'Microsoft', deadline: 'Closing in 4 hrs', metric: 'CTC: 45 LPA' },
    { company: 'Adobe Systems', deadline: 'Closing Tomorrow', metric: 'CTC: 38 LPA' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-96 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-base tracking-tight">Urgent Invitations</h3>
          <p className="text-xs text-gray-400 font-medium">Matching your specific skill profile</p>
        </div>
        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
      </div>

      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {alerts.map((alert, idx) => (
          <div key={idx} className="p-4 border border-rose-100 rounded-xl bg-rose-50/10 hover:bg-rose-50/30 transition-all cursor-pointer flex justify-between items-center group">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900 tracking-tight">{alert.company}</h4>
              <p className="text-xs font-semibold text-rose-600">{alert.deadline}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-150 px-2 py-1 rounded-md block mb-1">
                {alert.metric}
              </span>
              <span className="text-[11px] text-[#22C55E] font-bold underline group-hover:text-[#16A34A]">Apply Now</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriveAlertPanel;