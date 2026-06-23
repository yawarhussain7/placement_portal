import React from 'react';
import { FiHexagon } from 'react-icons/fi';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="h-screen flex bg-[#F8FAFC] overflow-hidden">
      {/* Left Side: Branding & Info Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#EFFDF4] p-12 flex-col justify-between border-r border-gray-100 overflow-y-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-[#22C55E] p-2 rounded-lg text-white">
            <FiHexagon className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">Webmantis</span>
        </div>

        {/* Decorative Graphic/Text */}
        <div className="max-w-md my-auto">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            Manage student placements and partnerships effortlessly.
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Track applications, monitor real-time pipeline status, and connect your students with top tier global companies all from a single dashboard.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-gray-400 font-medium">
          &copy; 2026 Webmantis Platform. All rights reserved.
        </div>
      </div>

      {/* Right Side: Authentication Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          {/* Mobile Logo View */}
          <div className="flex items-center gap-2 lg:hidden mb-4">
            <div className="bg-[#22C55E] p-1.5 rounded-md text-white">
              <FiHexagon className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-gray-900">Webmantis</span>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;