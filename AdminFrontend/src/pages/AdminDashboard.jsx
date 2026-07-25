import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import SummaryCards from '../components/dashboard/SummaryCards';
import ChartsSection from '../components/dashboard/ChartsSection';
import SummaryTable from '../components/dashboard/SummaryTable';
import UpcomingDrives from '../components/dashboard/UpcomingDrives';
import PerformanceInsights from '../components/dashboard/PerformanceInsights';
import RecentStudentUploads from '../components/dashboard/RecentStudentUploads';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/admin/dashboard', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setDashboardData(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Calculate summary data from real API data
  const summaryData = dashboardData ? [
    {
      title: 'Total Students',
      value: dashboardData.totalStudents?.toString() || '0',
      current: dashboardData.totalStudents || 0,
      total: 1000,
      percentage: `${Math.min(100, Math.round((dashboardData.totalStudents || 0) / 10))}%`,
      icon: 'FiUsers',
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Total Applications',
      value: dashboardData.totalApplications?.toString() || '0',
      current: dashboardData.totalApplications || 0,
      total: 500,
      percentage: `${Math.min(100, Math.round((dashboardData.totalApplications || 0) / 5))}%`,
      icon: 'FiFileText',
      color: 'purple',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Placed Students',
      value: dashboardData.placedStudents?.toString() || '0',
      current: dashboardData.placedStudents || 0,
      total: 200,
      percentage: `${Math.min(100, Math.round((dashboardData.placedStudents || 0) / 2))}%`,
      icon: 'FiCheckCircle',
      color: 'green',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Partner Companies',
      value: dashboardData.partnerCompanies?.toString() || '0',
      current: dashboardData.partnerCompanies || 0,
      total: 100,
      percentage: `${Math.min(100, dashboardData.partnerCompanies || 0)}%`,
      icon: 'FiShoppingBag',
      color: 'orange',
      trend: '+5%',
      trendUp: true
    }
  ] : [];

  // Pipeline data for charts
  const pipelineData = dashboardData?.pipelineData || [
    { name: 'Applied', value: 120, fill: '#3b82f6' },
    { name: 'Shortlisted', value: 85, fill: '#8b5cf6' },
    { name: 'Interviewed', value: 42, fill: '#f59e0b' },
    { name: 'Offered', value: 18, fill: '#10b981' },
    { name: 'Placed', value: 12, fill: '#06b6d4' }
  ];

  // Weekly trend data
  const weeklyTrendData = [
    { name: 'Mon', applications: 45, interviews: 28 },
    { name: 'Tue', applications: 52, interviews: 35 },
    { name: 'Wed', applications: 38, interviews: 22 },
    { name: 'Thu', applications: 65, interviews: 42 },
    { name: 'Fri', applications: 48, interviews: 31 },
    { name: 'Sat', applications: 25, interviews: 15 },
    { name: 'Sun', applications: 32, interviews: 19 }
  ];

  // Category distribution for pie chart
  const categoryData = [
    { name: 'Technology', value: 35, fill: '#10b981' },
    { name: 'Finance', value: 25, fill: '#3b82f6' },
    { name: 'Healthcare', value: 20, fill: '#8b5cf6' },
    { name: 'Engineering', value: 12, fill: '#f59e0b' },
    { name: 'Others', value: 8, fill: '#6b7280' }
  ];

  // Upcoming drives from recent applications
  const upcomingDrives = dashboardData?.recentApplications ? 
    dashboardData.recentApplications.slice(0, 3).map((app, index) => ({
      company: app.institution || 'Company',
      date: new Date(app.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase(),
      roles: 'Multiple Roles',
      students: `${Math.floor(Math.random() * 200) + 50} Students`,
      time: ['10:00 AM', '11:00 AM', '02:00 PM'][index],
      color: ['emerald', 'blue', 'purple'][index],
      status: ['Active', 'Pending', 'Confirmed'][index]
    })) : [
    {
      company: 'Wipro',
      date: '18 MAY',
      roles: '3 Roles',
      students: '142 Students',
      time: '10:00 AM',
      color: 'emerald',
      status: 'Active'
    },
    {
      company: 'Amazon',
      date: '22 MAY',
      roles: '2 Roles',
      students: '89 Students',
      time: '11:00 AM',
      color: 'blue',
      status: 'Pending'
    },
    {
      company: 'TCS',
      date: '28 MAY',
      roles: '4 Roles',
      students: '210 Students',
      time: '02:00 PM',
      color: 'purple',
      status: 'Confirmed'
    }
  ];

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen font-sans antialiased text-gray-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans antialiased text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title="Dashboard"
          breadcrumbs={[
            { label: 'Home', path: '/admin/dashboard' }
          ]}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[1400px] mx-auto space-y-4">
            
            <WelcomeBanner />
            
            <SummaryCards summaryData={summaryData} />
            
            <ChartsSection 
              weeklyTrendData={weeklyTrendData} 
              categoryData={categoryData} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <SummaryTable 
                  pipelineData={pipelineData} 
                  totalApplications={dashboardData?.totalApplications} 
                />
              </div>
              <UpcomingDrives upcomingDrives={upcomingDrives} />
            </div>
            
            <RecentStudentUploads />
            
            <PerformanceInsights dashboardData={dashboardData} />

            {/* Footer */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">© 2025 Webmantis — Empowering Placements, Enabling Futures</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-gray-600 font-medium">All systems operational</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;