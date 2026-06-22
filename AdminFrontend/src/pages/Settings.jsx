import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar'; 
import Header from '../components/common/Header';    
import SettingsNavigation from '../components/settings/SettingsNavigation';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Platform Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Structural Context Header */}
        <Header />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {/* Main Top Header Line Row */}
          <div className="border-b border-gray-100 pb-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Settings</h1>
            <p className="text-xs font-medium text-gray-400 mt-0.5">Configure admin panel preferences and system options</p>
          </div>

          {/* Master 2-Column Responsive Split Content Grid Layout */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Left Hand Navigation Component Link Menu */}
            <div className="w-full md:w-64 shrink-0 md:sticky md:top-4">
              <SettingsNavigation />
            </div>

            {/* Right Hand Dynamic Settings Workspace Router */}
            <div className="flex-1 space-y-6 max-w-4xl w-full">
              <Outlet />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Settings;
