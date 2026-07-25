import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar'; 
import Header from '../components/common/Header'; 
import { 
  FiPercent, 
  FiDollarSign, 
  FiAward, 
  FiBriefcase, 
  FiDownload, 
  FiCalendar,
  FiTrendingUp,
  FiFilter
} from 'react-icons/fi';
import { getReportsData, exportReport } from '../api/reports.js';

const Report = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { id: 1, label: 'Placement Rate', value: '0%', change: '+0%', icon: FiPercent },
    { id: 2, label: 'Avg. CTC (LPA)', value: '0', change: '+0', icon: FiDollarSign },
    { id: 3, label: 'Highest CTC (LPA)', value: '0', change: '+0', icon: FiAward },
    { id: 4, label: 'Companies Visited', value: '0', change: '+0', icon: FiBriefcase },
  ]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const handleExport = async () => {
    try {
      await exportReport('pdf');
      console.log('Report exported successfully');
    } catch (err) {
      console.error('Failed to export report:', err.message);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await getReportsData({ academicYear });
        
        if (response.success && response.data) {
          const data = response.data;
          
          // Update stats
          setStats([
            { id: 1, label: 'Placement Rate', value: data.stats.placementRate, change: '+4.2%', icon: FiPercent },
            { id: 2, label: 'Avg. CTC (LPA)', value: data.stats.avgCTC, change: '+2.1', icon: FiDollarSign },
            { id: 3, label: 'Highest CTC (LPA)', value: data.stats.highestCTC, change: '+8.5', icon: FiAward },
            { id: 4, label: 'Companies Visited', value: data.stats.companiesVisited, change: '+22', icon: FiBriefcase },
          ]);
          
          setMonthlyData(data.monthlyPlacements || []);
          setDeptData(data.departments || []);
          setCompanyData(data.companyData || []);
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [academicYear]);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans antialiased text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-[1600px] w-full mx-auto">
          
          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Placement Analytics</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">Strategic overview of academic recruitment performance</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-slate-200 text-sm font-semibold pl-10 pr-10 py-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer shadow-sm"
                  value={academicYear} 
                  onChange={(e) => setAcademicYear(e.target.value)}
                >
                  <option>2024-25</option>
                  <option>2023-24</option>
                </select>
                <FiCalendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <FiFilter className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>

              <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-all shadow-md active:scale-95">
                <FiDownload className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>

          {/* KPI GRID */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((card) => (
                <div key={card.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</span>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <card.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-extrabold text-slate-900">{card.value}</h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-1.5 flex items-center gap-1">
                      <FiTrendingUp className="w-3 h-3" /> {card.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MAIN CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Placement Velocity</h4>
              {loading ? (
                <div className="flex items-end justify-between h-56 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-3">
                      <div className="w-full bg-slate-100 rounded-t-lg animate-pulse" style={{ height: '100%' }}></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-end justify-between h-56 gap-2">
                  {monthlyData.length > 0 ? monthlyData.map((m, i) => {
                    const maxValue = Math.max(...monthlyData.map(item => item.value));
                    const heightPercentage = maxValue > 0 ? (m.value / maxValue) * 100 : 0;
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 gap-3">
                        <div className="w-full bg-slate-100 rounded-t-lg relative group flex items-end justify-center" style={{ height: '100%' }}>
                          <div className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500 group-hover:bg-emerald-600" style={{ height: `${heightPercentage}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-400">{m.month}</span>
                      </div>
                    );
                  }) : (
                    <div className="w-full text-center text-slate-400 text-sm py-20">
                      No monthly data available
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Department Output</h4>
              {loading ? (
                <div className="space-y-5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-200 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {deptData.length > 0 ? deptData.map((d, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-600">{d.dept}</span>
                        <span className="text-slate-900">{d.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${d.percentage}%` }} />
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-slate-400 text-sm py-10">
                      No department data available
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recruitment Performance Metrics</h4>
            </div>
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 bg-slate-100 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4 text-center">Students Hired</th>
                    <th className="px-6 py-4">Avg. CTC</th>
                    <th className="px-6 py-4">Market Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                  {companyData.length > 0 ? companyData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-400">{row.rank}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-900">{row.hired}</td>
                      <td className="px-6 py-4 font-bold text-slate-700">{row.ctc}</td>
                      <td className="px-6 py-4 pr-10">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${row.share * 5}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-900">{row.share}%</span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-sm text-slate-400">
                        No company data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Report;