import React from 'react';

const DocumentFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  documentTypeFilter, 
  setDocumentTypeFilter,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
      <div className="flex items-center gap-2.5 flex-1">
        <div className="relative flex-1 md:flex-none">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or document..." 
            className="w-full md:w-80 bg-slate-50 pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          />
        </div>

        <select 
          value={documentTypeFilter}
          onChange={(e) => setDocumentTypeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors cursor-pointer"
        >
          <option value="all">All Document Types</option>
          <option value="resume">Resume</option>
          <option value="cv">CV</option>
          <option value="transcript">Transcript</option>
          <option value="certificate">Certificate</option>
          <option value="photo_id">Photo ID</option>
          <option value="student_id">Student ID</option>
        </select>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>

        <div className="relative">
          <input 
            type="text" 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="Select Date Range" 
            className="w-48 bg-slate-50 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            readOnly
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        </div>

        <button className="px-4 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>
    </div>
  );
};

export default DocumentFilters;