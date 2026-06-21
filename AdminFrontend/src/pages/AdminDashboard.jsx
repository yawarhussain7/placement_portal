import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatCard from '../components/dashboard/StatCard';
import PipelineChart from '../components/dashboard/PipelineChart';
import UpcomingDrives from '../components/dashboard/UpcomingDrives';
import RecentApplicationsTable from '../components/dashboard/RecentApplicationsTable';
import {
  FiUsers,
  FiSend,
  FiAward,
  FiHome
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased">
      {/* Structural Sidebar component */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main viewport frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        {/* Outer content matrix scroll layer */}
        <main className="p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          
          {/* Top Metric Strip Layout Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Students"
              count="3,842"
              change="+8%"
              icon={<FiUsers className="w-5 h-5" />}
            />
            <StatCard
              title="Applications"
              count="1,209"
              change="+14%"
              icon={<FiSend className="w-5 h-5" />}
            />
            <StatCard
              title="Placed Students"
              count="872"
              change="+21%"
              icon={<FiAward className="w-5 h-5" />}
            />
            <StatCard
              title="Partner Companies"
              count="134"
              change="+5%"
              icon={<FiHome className="w-5 h-5" />}
            />
          </div>

          {/* Core Insights Segment: Pipeline Chart & Upcoming Deadlines Grouping */}
          <div className="flex flex-col lg:flex-row gap-6">
            <PipelineChart />
            <UpcomingDrives />
          </div>

          {/* Detailed Structural Log Grid */}
          <RecentApplicationsTable />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;