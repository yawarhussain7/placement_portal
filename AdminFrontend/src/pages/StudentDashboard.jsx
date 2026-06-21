import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header';   // Uses your minimal header core from earlier
import StudentStatCard from '../components/student/StudentStatCard';
import ReadinessChecklist from '../components/student/ReadinessChecklist';
import DriveAlertPanel from '../components/student/DriveAlertPanel';
import ApplicationTracker from '../components/student/ApplicationTracker';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Structural Sidebar wrapper set with specific student parameters */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {/* Top Metric Strip Layout Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StudentStatCard 
              title="Cumulative CGPA"
              metric="3.84"
              context="Top 5% of CSE department"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>}
            />
            <StudentStatCard 
              title="Overall Attendance"
              metric="92%"
              context="Minimum required: 80%"
              progress={92}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StudentStatCard 
              title="Total Job Offers"
              metric="01"
              context="Microsoft (Technical Consultant)"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"/></svg>}
            />
            <StudentStatCard 
              title="Verified Credits"
              metric="126"
              context="Ready for final clearance"
              progress={100}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
          </div>

          {/* Central Structural Matrix Split: Readiness Progress & Deadline Cards */}
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            <ReadinessChecklist />
            <DriveAlertPanel />
          </div>

          {/* Main Logs Table Segment */}
          <ApplicationTracker />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;