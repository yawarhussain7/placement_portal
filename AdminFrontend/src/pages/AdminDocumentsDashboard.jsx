import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar'; 
import Header from '../components/common/Header';   
import AdminDocStatCard from '../components/document/AdminDocStatCard';
import StudentGroupCard from '../components/document/StudentGroupCard';

const AdminDocumentsDashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Exact dataset mapped directly from DocumentsPage.jpg layout reference
  const studentsDataset = [
    {
      name: 'Aarav Mehta',
      id: 'CSE2021010',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
      uploadedCount: '5/7',
      progress: 71,
      docs: [
        { name: 'Resume / CV', size: '312 KB', date: 'Jan 14, 2025', isRequired: true, status: 'Uploaded' },
        { name: '10th Marksheet', size: '1.1 MB', date: 'Jan 14, 2025', isRequired: true, status: 'Uploaded' },
        { name: 'College ID Card', size: 'Required', date: '---', isRequired: true, status: 'Pending' }
      ]
    },
    {
      name: 'Priya Sharma',
      id: 'MBA2022034',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      uploadedCount: '7/7',
      progress: 100,
      docs: [
        { name: 'Resume / CV', size: '312 KB', date: 'Jan 14, 2025', isRequired: true, status: 'Uploaded' },
        { name: '10th Marksheet', size: '1.1 MB', date: 'Jan 14, 2025', isRequired: true, status: 'Uploaded' },
        { name: 'College ID Card', size: '540 KB', date: 'Jan 12, 2025', isRequired: true, status: 'Uploaded' }
      ]
    },
    {
      name: 'Leo Thompson',
      id: 'ECE2021019',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      uploadedCount: '3/7',
      progress: 43,
      docs: [
        { name: 'Resume / CV', size: 'Required', date: '---', isRequired: true, status: 'Missing' },
        { name: '10th Marksheet', size: '1.1 MB', date: 'Jan 14, 2025', isRequired: true, status: 'Uploaded' },
        { name: 'College ID Card', size: 'Required', date: '---', isRequired: true, status: 'Pending' }
      ]
    },
    {
      name: 'Nia Osei',
      id: 'MCA2022008',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      uploadedCount: '6/7',
      progress: 86,
      docs: [
        { name: 'Resume / CV', size: '312 KB', date: 'Jan 14, 2025', isRequired: true, status: 'Uploaded' },
        { name: '10th Marksheet', size: '1.1 MB', date: 'Jan 14, 2025', isRequired: true, status: 'Uploaded' },
        { name: 'College ID Card', size: '540 KB', date: 'Jan 12, 2025', isRequired: true, status: 'Uploaded' }
      ]
    }
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Global Navigation Sidebar component injection */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Structural Layout Top Header */}
        <Header />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {/* Document Section Page Title Header + Live Context Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Document Management</h1>
              <p className="text-xs font-medium text-gray-400 mt-0.5">Review, verify and download student documents</p>
            </div>
            
            {/* Context Filters inline tracking block setup */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student..." 
                  className="w-full sm:w-52 bg-white pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <option value="all">Filter by status</option>
                <option value="complete">100% Uploaded</option>
                <option value="pending">Action Required</option>
              </select>
            </div>
          </div>

          {/* Analytical Stat Metrics Layer - Re-configured from Image Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminDocStatCard 
              title="Total Documents" 
              metric="4,812" 
              colorClass="text-blue-600 bg-blue-50"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
            <AdminDocStatCard 
              title="Verified" 
              metric="3,540" 
              colorClass="text-emerald-600 bg-emerald-50"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <AdminDocStatCard 
              title="Pending Review" 
              metric="892" 
              colorClass="text-amber-600 bg-amber-50"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <AdminDocStatCard 
              title="Missing / Rejected" 
              metric="380" 
              colorClass="text-rose-600 bg-rose-50"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          </div>

          {/* Master Structural Nested Row Rendering Iteration loop */}
          <div className="space-y-4">
            {studentsDataset
              .filter(student => student.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((student, idx) => (
                <StudentGroupCard key={idx} student={student} />
              ))
            }
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDocumentsDashboard;