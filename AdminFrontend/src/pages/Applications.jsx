import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header';   
import ApplicationStatCard from '../components/application/ApplicationStatCard'
import ApplicationRowCard from '../components/application/ApplicationRowCard';

const Applications = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [currentFilter, setCurrentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Explicit design token config definitions from visual assets
  const cardColorConfigs = {
    total: { bg: 'bg-gray-50/60', border: 'border-gray-100', text: 'text-gray-900' },
    review: { bg: 'bg-blue-50/40', border: 'border-blue-100/60', text: 'text-blue-600' },
    selected: { bg: 'bg-emerald-50/40', border: 'border-emerald-100/60', text: 'text-emerald-600' },
    offered: { bg: 'bg-purple-50/40', border: 'border-purple-100/60', text: 'text-purple-600' },
    rejected: { bg: 'bg-rose-50/40', border: 'border-rose-100/60', text: 'text-rose-600' }
  };

  const tabs = [
    { label: 'All', count: 209 },
    { label: 'In Review', count: 54 },
    { label: 'Selected', count: 87 },
    { label: 'Offered', count: 31 },
    { label: 'Rejected', count: 37 }
  ];

  // Exact UI application records mapped directly from ApplicationsPage.jpg
  const applicationsData = [
    { company: 'Google', role: 'Software Engineer', package: '28 LPA', location: 'Hyderabad', date: 'Jan 12, 2025', status: 'In Review', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> },
    { company: 'Microsoft', role: 'Product Analyst', package: '24 LPA', location: 'Bangalore', date: 'Jan 9, 2025', status: 'Selected', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { company: 'Deloitte', role: 'Business Analyst', package: '14 LPA', location: 'Mumbai', date: 'Jan 6, 2025', status: 'Pending', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { company: 'Infosys', role: 'Systems Engineer', package: '7 LPA', location: 'Pune', date: 'Dec 28, 2024', status: 'Rejected', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg> },
    { company: 'Amazon', role: 'SDE I', package: '22 LPA', location: 'Bangalore', date: 'Dec 22, 2024', status: 'Offered', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 110 4 2 2 0 010-4z" /></svg> },
    { company: 'TCS', role: 'Associate Engineer', package: '8 LPA', location: 'Chennai', date: 'Dec 18, 2024', status: 'Selected', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> }
  ];

  const filteredApplications = applicationsData.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = currentFilter === 'All' || app.status === currentFilter;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Structural Header Section */}
        <Header />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {/* Applications Area Baseline Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Applications</h1>
              <p className="text-xs font-medium text-gray-400 mt-0.5">Track and manage all student placement applications</p>
            </div>
          </div>

          {/* Institutional Main Headline Content Header */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight">All Applications</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">209 applications across 134 companies this semester</p>
              </div>

              {/* Toolbar Actions Block Deck */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..." 
                    className="w-full md:w-48 bg-white pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:border-[#22C55E] transition-colors"
                  />
                </div>

                <button className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>

                  <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
              </div>
            </div>

            {/* Performance Metric Blocks Row Layer */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
              <ApplicationStatCard label="Total Applied" count="209" colorConfig={cardColorConfigs.total} />
              <ApplicationStatCard label="In Review" count="54" colorConfig={cardColorConfigs.review} />
              <ApplicationStatCard label="Selected" count="87" colorConfig={cardColorConfigs.selected} />
              <ApplicationStatCard label="Offered" count="31" colorConfig={cardColorConfigs.offered} />
              <ApplicationStatCard label="Rejected" count="37" colorConfig={cardColorConfigs.rejected} />
            </div>

            {/* Metric Secondary Horizontal Tab Bar Selector Layout */}
            <div className="flex border-b border-gray-100 pt-3 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setCurrentFilter(tab.label)}
                  className={`pb-2.5 px-2 text-xs font-bold transition-all relative -bottom-[1px] flex items-center gap-1.5 border-b-2 ${
                    currentFilter === tab.label
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    currentFilter === tab.label ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Core Application Row Mapping Loop Container */}
            <div className="space-y-3 pt-2">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app, idx) => (
                  <ApplicationRowCard key={idx} application={app} />
                ))
              ) : (
                <div className="text-center py-10 text-xs font-semibold text-gray-400">
                  No applications matched the tracking criteria.
                </div>
              )}
            </div>

            {/* Interface Footer Pagination Segment */}
            <div className="flex items-center justify-between pt-4 bg-white text-xs font-semibold text-gray-400">
              <span>Showing 1-{filteredApplications.length} of 209 applications</span>
              
              <div className="flex items-center gap-1">
                <button className="p-1.5 border border-gray-150 rounded-md hover:bg-gray-50 transition-colors text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-7 h-7 bg-emerald-600 text-white rounded-md text-xs font-bold shadow-sm shadow-emerald-500/10">1</button>
                <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">2</button>
                <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">3</button>
                <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">4</button>
                <button className="p-1.5 border border-gray-150 rounded-md hover:bg-gray-50 transition-colors text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Applications;