import React from 'react';
import { Outlet } from 'react-router-dom';
const SettingsCardLayout = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5 transition-all duration-200 hover:shadow-md/5 w-full">
      
      {/* Structural Card Sub-Header */}
      <div className="border-b border-gray-50 pb-3">
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
          {description}
        </p>
      </div>

      {/* Internal Content Workspace Slot */}
      <div className="space-y-4">
        {children}
      </div>
      <Outlet/>
    </div>
  );
};

export default SettingsCardLayout;