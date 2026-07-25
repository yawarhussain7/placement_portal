import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header';   
import ApplicationStatCard from '../components/application/ApplicationStatCard'
import ApplicationRowCard from '../components/application/ApplicationRowCard';
import { getApplications } from '../api/applications.js';

const Applications = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [currentFilter, setCurrentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inReview: 0,
    selected: 0,
    offered: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  const handleViewApplication = (app) => {
    console.log('View application:', app);
    // Navigate to application details
  };

  const handleExport = () => {
    console.log('Export clicked');
    // Implement export functionality
  };

  const handleFilters = () => {
    console.log('Filters clicked');
    // Implement filters functionality
  };

  // Explicit design token config definitions from visual assets
  const cardColorConfigs = {
    total: { bg: 'bg-gray-50/60', border: 'border-gray-100', text: 'text-gray-900' },
    review: { bg: 'bg-blue-50/40', border: 'border-blue-100/60', text: 'text-blue-600' },
    selected: { bg: 'bg-emerald-50/40', border: 'border-emerald-100/60', text: 'text-emerald-600' },
    offered: { bg: 'bg-purple-50/40', border: 'border-purple-100/60', text: 'text-purple-600' },
    rejected: { bg: 'bg-rose-50/40', border: 'border-rose-100/60', text: 'text-rose-600' }
  };

  const tabs = [
    { label: 'All', count: stats.total },
    { label: 'In Review', count: stats.inReview },
    { label: 'Selected', count: stats.selected },
    { label: 'Offered', count: stats.offered },
    { label: 'Rejected', count: stats.rejected }
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const filters = {};
        
        if (currentFilter !== 'All') {
          filters.status = currentFilter.toLowerCase().replace('in review', 'in-review');
        }
        if (searchQuery) {
          filters.search = searchQuery;
        }
        
        const response = await getApplications(filters);
        
        if (response.success && response.data) {
          // Transform backend data to match ApplicationRowCard component format
          const transformedApps = (response.data.applications || []).map(app => ({
            id: app.id,
            company: app.institution || 'Unknown Institution',
            role: app.course || 'Placement Application',
            package: 'N/A',
            location: 'N/A',
            date: app.date,
            status: app.status,
            icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 18h.01M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
            studentName: app.studentName,
            email: app.email,
            phone: app.phone
          }));
          
          setApplications(transformedApps);
          setStats(response.data.stats || stats);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentFilter, searchQuery]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.institution?.toLowerCase().includes(searchQuery.toLowerCase());
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

                <button onClick={handleFilters} className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>

                  <button onClick={handleExport} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
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
                 {loading ? (
                   <div className="text-center py-10 text-xs font-semibold text-gray-400">
                     Loading applications...
                   </div>
                 ) : filteredApplications.length > 0 ? (
                   filteredApplications.map((app, idx) => (
                     <ApplicationRowCard key={app.id || idx} application={app} onView={handleViewApplication} />
                   ))
               ) : (
                 <div className="text-center py-10 text-xs font-semibold text-gray-400">
                   No applications matched the tracking criteria.
                 </div>
               )}
            </div>

            {/* Interface Footer Pagination Segment */}
            {!loading && filteredApplications.length > 0 && (
              <div className="flex items-center justify-between pt-4 bg-white text-xs font-semibold text-gray-400">
                <span>Showing {filteredApplications.length} of {applications.length} applications</span>
                 
                 <div className="flex items-center gap-1">
                   <button onClick={() => console.log('Previous page')} className="p-1.5 border border-gray-150 rounded-md hover:bg-gray-50 transition-colors text-gray-400 disabled:opacity-50">
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
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Applications;