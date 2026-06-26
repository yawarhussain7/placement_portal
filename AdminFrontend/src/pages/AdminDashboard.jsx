import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatCard from '../components/dashboard/StatCard';
import PipelineChart from '../components/dashboard/PipelineChart';
import UpcomingDrives from '../components/dashboard/UpcomingDrives';
import RecentApplicationsTable from '../components/dashboard/RecentApplicationsTable';
import { 
  FiUsers, FiSend, FiAward, FiHome, FiCalendar, 
  FiPlus, FiFileText, FiBriefcase, FiUserPlus, FiLoader 
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: '...',
    totalApplications: '...',
    placedStudents: '...',
    partnerCompanies: '...',
    recentApplications: [],
    pipelineData: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:2000/dashboard/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await response.json();
        if (resData.success && resData.data) {
          setStats(resData.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans antialiased text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-300">
            
            {/* Professional Header & Quick Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Platform Overview</h1>
                <p className="text-sm text-slate-500 font-medium mt-0.5">Central hub for administrative operations</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
                  <FiUserPlus className="w-3.5 h-3.5" /> Add Student
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md cursor-pointer">
                  <FiPlus className="w-3.5 h-3.5" /> New Placement
                </button>
              </div>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Students" count={stats.totalStudents} change="+8%" icon={<FiUsers />} />
              <StatCard title="Applications" count={stats.totalApplications} change="+14%" icon={<FiSend />} />
              <StatCard title="Placed Students" count={stats.placedStudents} change="+21%" icon={<FiAward />} />
              <StatCard title="Partner Companies" count={stats.partnerCompanies} change="+5%" icon={<FiHome />} />
            </div>

            {/* Insights and Quick Utility Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PipelineChart data={stats.pipelineData} />
              </div>
              
              <div className="space-y-6">
                <UpcomingDrives />
                
                {/* Secondary Action Cards for Docs and Applications */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-300 transition-colors text-left cursor-pointer group">
                    <FiFileText className="w-5 h-5 text-emerald-600 mb-2" />
                    <span className="text-xs font-bold text-slate-900 block">Documents</span>
                    <span className="text-[10px] text-slate-400">View & Verify</span>
                  </button>
                  <button className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-300 transition-colors text-left cursor-pointer group">
                    <FiBriefcase className="w-5 h-5 text-emerald-600 mb-2" />
                    <span className="text-xs font-bold text-slate-900 block">Applications</span>
                    <span className="text-[10px] text-slate-400">Manage Status</span>
                  </button>
                </div>
              </div>
            </div>

            <RecentApplicationsTable applications={stats.recentApplications} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;