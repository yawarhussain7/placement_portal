import React from 'react';

const ReadinessChecklist = () => {
  const steps = [
    { name: 'Profile Information & Resume Upload', completed: true, desc: 'Verified by Placement Officer' },
    { name: 'Pre-Assessment & Coding Test', completed: true, desc: 'Scored Tier 1 (Top 10%)' },
    { name: 'Technical & HR Mock Interview', completed: true, desc: 'Cleared with Good feedback' },
    { name: 'GD & Communication Workshop', completed: false, desc: 'Scheduled for June 24' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-base tracking-tight">Placement Eligibility</h3>
          <p className="text-xs text-gray-400 font-medium">Complete pre-requisites to open custom applications</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/40">75% Complete</span>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className={`mt-0.5 p-1 rounded-full shrink-0 border transition-all ${
              step.completed 
                ? 'bg-[#EFFDF4] text-[#22C55E] border-emerald-200' 
                : 'bg-gray-50 text-gray-300 border-gray-200'
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className={`text-sm font-bold tracking-tight transition-colors ${step.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                {step.name}
              </h4>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadinessChecklist;