import React from 'react';
import { FiActivity } from 'react-icons/fi';

const WelcomeBanner = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-emerald-50 text-xs">Welcome back! Here's what's happening with your placements today.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
          <FiActivity className="w-4 h-4" />
          <span className="text-xs font-medium">Live Updates</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;