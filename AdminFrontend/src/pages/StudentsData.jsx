import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header';   // Uses your minimal header core from earlier
import DirectoryStatCard from '../components/student/DirectoryStatCard';
import StudentTableRow from '../components/student/StudentTableRow';
const StudentsData = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [currentFilter, setCurrentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filterTabs = ['All', 'Active', 'Placed', 'Offered', 'Inactive'];

  // Exact dataset fully mapped from StudentsPage.jpg
  const studentsData = [
    { name: 'Aarav Mehta', enrollmentNo: 'CSE2021010', course: 'B.Tech CSE', cgpa: 8.74, status: 'Placed', placedAt: 'Google', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80' },
    { name: 'Priya Sharma', enrollmentNo: 'MBA2022034', course: 'MBA Finance', cgpa: 8.10, status: 'Active', placedAt: '', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
    { name: 'Leo Thompson', enrollmentNo: 'ECE2021019', course: 'B.Tech ECE', cgpa: 7.40, status: 'Active', placedAt: '', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
    { name: 'Nia Osei', enrollmentNo: 'MCA2022008', course: 'MCA', cgpa: 9.01, status: 'Placed', placedAt: 'TCS', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
    { name: 'Carlos Rivera', enrollmentNo: 'IT2021045', course: 'B.Tech IT', cgpa: 7.92, status: 'Offered', placedAt: 'Microsoft', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
    { name: 'Aisha Khan', enrollmentNo: 'CSE2022021', course: 'B.Tech CSE', cgpa: 8.50, status: 'Active', placedAt: '', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80' },
    { name: 'Rahul Das', enrollmentNo: 'CSE2021033', course: 'B.Tech CSE', cgpa: 6.80, status: 'Inactive', placedAt: '', avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=100&q=80' }
  ];

  // Structural dynamic processing for search syntax filters
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = currentFilter === 'All' || student.status === currentFilter;
    const matchesDept = deptFilter === 'all' || student.course.includes(deptFilter);
    
    return matchesSearch && matchesTab && matchesDept;
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Global Framework Sidebar Core Section Navigation wrapper */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Architecture Master Layout Header */}
        <Header />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {/* Top Section Descriptive Directory Header Grid Setup */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Student Directory</h1>
              <p className="text-xs font-medium text-gray-400 mt-0.5">3,842 students enrolled across all departments</p>
            </div>
            
            {/* Direct Interaction Actions Control Deck */}
            <div className="flex items-center gap-2.5 self-end md:self-auto w-full md:w-auto">
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
                  placeholder="Search by name or ID..." 
                  className="w-full md:w-56 bg-white pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:border-[#22C55E] transition-colors shadow-sm"
                />
              </div>

              <select 
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 focus:outline-none focus:border-[#22C55E] transition-colors cursor-pointer shadow-sm"
              >
                <option value="all">Department</option>
                <option value="CSE">CSE</option>
                <option value="MBA">MBA</option>
                <option value="ECE">ECE</option>
              </select>

              <button className="px-3 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-sm shadow-emerald-500/10">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Add Student
              </button>
            </div>
          </div>

          {/* Core Analytics Metric Row Blocks matching layout reference data fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DirectoryStatCard title="Total Students" metric="3,842" trend="+8%" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
            <DirectoryStatCard title="Placed" metric="872" trend="+21%" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>} />
            <DirectoryStatCard title="Awaiting Placement" metric="2,611" trend="+3%" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <DirectoryStatCard title="Inactive / Opted Out" metric="359" trend="-4%" isNegative icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
          </div>

          {/* Directory Status Table Matrix Element */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            
            {/* Secondary Segment Filter Tabs Strip */}
            <div className="flex border-b border-gray-100 px-6 bg-white pt-2.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentFilter(tab)}
                  className={`px-4 py-2.5 text-xs font-bold tracking-tight transition-all border-b-2 relative -bottom-[1px] ${
                    currentFilter === tab
                      ? 'border-[#22C55E] text-[#22C55E]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dense Data Layout Grid Panel */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#EFF3F0]/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-3.5">Student</th>
                    <th className="px-6 py-3.5">Enrollment No.</th>
                    <th className="px-6 py-3.5">Course</th>
                    <th className="px-6 py-3.5">CGPA</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Placed At</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, idx) => (
                      <StudentTableRow key={idx} student={student} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-xs font-medium text-gray-400">
                        No students matching current filter parameters found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Interface Footer Pagination Segment bar configuration matches design matrix */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-50 text-xs font-semibold text-gray-400">
              <span>Showing 1-{filteredStudents.length} of 3,842 students</span>
              
              <div className="flex items-center gap-1">
                <button className="p-1.5 border border-gray-150 rounded-md hover:bg-gray-50 transition-colors text-gray-400 disabled:opacity-50">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-7 h-7 bg-[#22C55E] text-white rounded-md text-xs font-bold shadow-sm shadow-emerald-500/10">1</button>
                <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">2</button>
                <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">3</button>
                <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">4</button>
                <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">5</button>
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

export default StudentsData;