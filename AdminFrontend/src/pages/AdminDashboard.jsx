import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatCard from '../components/dashboard/StatCard';
import PipelineChart from '../components/dashboard/PipelineChart';
import UpcomingDrives from '../components/dashboard/UpcomingDrives';
import RecentApplicationsTable from '../components/dashboard/RecentApplicationsTable';
import { 
  FiUsers, FiSend, FiAward, FiHome, FiCalendar, 
  FiPlus, FiFileText, FiBriefcase, FiUserPlus 
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans antialiased text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* Professional Header & Quick Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Platform Overview</h1>
                <p className="text-sm text-slate-500 font-medium mt-0.5">Central hub for administrative operations</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                  <FiUserPlus className="w-3.5 h-3.5" /> Add Student
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md">
                  <FiPlus className="w-3.5 h-3.5" /> New Placement
                </button>
              </div>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Students" count="3,842" change="+8%" icon={<FiUsers />} />
              <StatCard title="Applications" count="1,209" change="+14%" icon={<FiSend />} />
              <StatCard title="Placed Students" count="872" change="+21%" icon={<FiAward />} />
              <StatCard title="Partner Companies" count="134" change="+5%" icon={<FiHome />} />
            </div>

            {/* Insights and Quick Utility Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PipelineChart />
              </div>
              
              {/* Added Utility Sidebar for rapid access to Documents & Apps */}
              <div className="space-y-6">
                <UpcomingDrives />
                
                {/* Secondary Action Cards for Docs and Applications */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-300 transition-colors text-left group">
                    <FiFileText className="w-5 h-5 text-emerald-600 mb-2" />
                    <span className="text-xs font-bold text-slate-900 block">Documents</span>
                    <span className="text-[10px] text-slate-400">View & Verify</span>
                  </button>
                  <button className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-300 transition-colors text-left group">
                    <FiBriefcase className="w-5 h-5 text-emerald-600 mb-2" />
                    <span className="text-xs font-bold text-slate-900 block">Applications</span>
                    <span className="text-[10px] text-slate-400">Manage Status</span>
                  </button>
                </div>
              </div>
            </div>

            <RecentApplicationsTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;