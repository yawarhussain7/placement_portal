import React from 'react';

const ApplicationRowCard = ({ application, onView }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Review': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Offered': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-hover hover:shadow-md">
      {/* Company Branding Meta */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 shrink-0">
          {application.icon}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 tracking-tight text-sm">{application.company}</h4>
          <p className="text-xs text-gray-400 font-medium">{application.role}</p>
        </div>
      </div>

      {/* Metrics Row Section */}
      <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto text-xs font-medium text-gray-500">
        <div className="text-center sm:text-left">
          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Package</span>
          <span className="font-bold text-gray-800 mt-0.5 block">{application.package}</span>
        </div>
        
        <div className="text-center sm:text-left">
          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Location</span>
          <span className="text-gray-600 mt-0.5 block">{application.location}</span>
        </div>

        <div className="text-center sm:text-left">
          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Applied</span>
          <span className="text-gray-400 font-mono mt-0.5 block">{application.date}</span>
        </div>

        {/* Action Tray */}
        <div className="flex items-center gap-3 pl-2">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(application.status)}`}>
            {application.status}
          </span>
          <button onClick={() => onView && onView(application)} className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors text-xs">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationRowCard;