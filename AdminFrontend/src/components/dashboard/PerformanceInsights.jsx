import React from 'react';
import { FiAward, FiTrendingUp, FiActivity, FiUsers, FiTarget } from 'react-icons/fi';

const PerformanceInsights = ({ dashboardData }) => {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 shadow-md text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold mb-1">Performance Insights</h3>
          <p className="text-blue-100 text-xs">Key metrics this month</p>
        </div>
        <FiAward className="w-6 h-6 text-yellow-300" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <FiTrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-[10px] text-blue-100">Success Rate</span>
          </div>
          <p className="text-xl font-bold">87.5%</p>
          <p className="text-[10px] text-green-300 mt-0.5">↑ 5.2% from last month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <FiActivity className="w-4 h-4 text-yellow-300" />
            <span className="text-[10px] text-blue-100">Avg. Time to Hire</span>
          </div>
          <p className="text-xl font-bold">14 Days</p>
          <p className="text-[10px] text-green-300 mt-0.5">↓ 2 days faster</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <FiUsers className="w-4 h-4 text-blue-300" />
            <span className="text-[10px] text-blue-100">Active Students</span>
          </div>
          <p className="text-xl font-bold">{dashboardData?.totalStudents || 0}</p>
          <p className="text-[10px] text-blue-200 mt-0.5">Currently enrolled</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <FiTarget className="w-4 h-4 text-purple-300" />
            <span className="text-[10px] text-blue-100">Placement Rate</span>
          </div>
          <p className="text-xl font-bold">
            {dashboardData?.totalApplications ? 
              `${Math.round((dashboardData.placedStudents / dashboardData.totalApplications) * 100)}%` : 
              '20%'}
          </p>
          <p className="text-[10px] text-green-300 mt-0.5">↑ 3.1% improvement</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;