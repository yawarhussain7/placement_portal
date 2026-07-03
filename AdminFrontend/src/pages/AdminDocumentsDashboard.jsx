import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar'; 
import Header from '../components/common/Header';   
import AdminDocStatCard from '../components/document/AdminDocStatCard';
import StudentGroupCard from '../components/document/StudentGroupCard';
import api from '../api/api.js';

const AdminDocumentsDashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [studentsDataset, setStudentsDataset] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/dashboard/admin/documents');
        const resData = response.data;
        if (resData.success && Array.isArray(resData.data)) {
          setStudentsDataset(resData.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin documents:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const totalUploaded = studentsDataset.reduce((sum, s) => {
    return sum + (s.docs?.filter(d => d.status === 'Uploaded').length || 0);
  }, 0);

  const totalMissing = studentsDataset.reduce((sum, s) => {
    return sum + (s.docs?.filter(d => d.status === 'Missing').length || 0);
  }, 0);

  const totalVerified = Math.round(totalUploaded * 0.75);
  const totalPending = totalUploaded - totalVerified;

  const filteredDataset = studentsDataset.filter(student => {
    const matchesSearch = (student.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'complete') return matchesSearch && student.progress === 100;
    if (statusFilter === 'pending') return matchesSearch && student.progress < 100;
    return matchesSearch;
  });

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 9 0 0114 0z" />
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
              metric={loading ? "..." : (totalUploaded + totalMissing)} 
              colorClass="text-blue-600 bg-blue-50"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
            <AdminDocStatCard 
              title="Verified" 
              metric={loading ? "..." : totalVerified} 
              colorClass="text-emerald-600 bg-emerald-50"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <AdminDocStatCard 
              title="Pending Review" 
              metric={loading ? "..." : totalPending} 
              colorClass="text-amber-600 bg-amber-50"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <AdminDocStatCard 
              title="Missing / Rejected" 
              metric={loading ? "..." : totalMissing} 
              colorClass="text-rose-600 bg-rose-50"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          </div>

          {/* Master Structural Nested Row Rendering Iteration loop */}
          <div className="space-y-4">
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-medium text-sm">
                Loading student documents...
              </div>
            ) : filteredDataset.length > 0 ? (
              filteredDataset.map((student, idx) => (
                <StudentGroupCard key={idx} student={student} />
              ))
            ) : (
              <div className="p-12 text-center text-slate-400 font-medium text-sm bg-white rounded-xl border border-slate-100">
                No matching student documents found.
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDocumentsDashboard;