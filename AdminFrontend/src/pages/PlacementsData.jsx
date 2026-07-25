import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header';
import { getPlacements, verifyDocument, rejectDocument, deletePlacement } from '../api/placements.js'
import UpdatePlacementModal from '../components/placement/UpdatePlacementModal.jsx'

const PlacementsData = () => {
  const [activeTab, setActiveTab] = useState('placements');
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatePlacement, setUpdatePlacement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchPlacements();
  }, [currentPage]);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const data = await getPlacements({ page: currentPage, limit: 10 });
      if (data.success && Array.isArray(data.data)) {
        setPlacements(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch placements:', err);
      showNotification('Failed to fetch placements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewPlacement = (placement) => {
    setSelectedPlacement(placement);
    setShowDetailModal(true);
  };

  const handleEditPlacement = (placement) => {
    setUpdatePlacement(placement);
    setShowUpdateModal(true);
  };

  const handleUpdatePlacement = (id, updatedData) => {
    setPlacements(placements.map(p => 
      p._id === id ? { ...p, ...updatedData } : p
    ));
    showNotification('Placement updated successfully');
  };

  const handleDeletePlacement = async (placement) => {
    try {
      await deletePlacement(placement._id);
      showNotification('Placement deleted successfully');
      setPlacements(placements.filter(p => p._id !== placement._id));
      setDeleteConfirm(null);
    } catch (err) {
      showNotification('Failed to delete placement', 'error');
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending Approval': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getDocumentCount = (placement) => {
    if (!placement?.documents) return 0;
    return Object.keys(placement.documents).filter(key => 
      placement.documents[key]?.fileName || placement.documents[key]?.fileUrl
    ).length;
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title="Placements"
          breadcrumbs={[
            { label: 'Home', path: '/admin/dashboard' },
            { label: 'Placements', path: '/admin/placements' }
          ]}
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {notification && (
            <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${
              notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {notification.type === 'error' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                )}
              </svg>
              <span className="text-sm font-semibold">{notification.message}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Placement Management</h1>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Review and manage student placement applications</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search placements..." 
                  className="w-64 bg-white pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Total Applications</span>
                <h4 className="text-3xl font-bold text-gray-900 tracking-tight">{pagination?.totalCount || 0}</h4>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Documents Pending</span>
                <h4 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {placements.length}
                </h4>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-300">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Verified</span>
                <h4 className="text-3xl font-bold text-gray-900 tracking-tight">
                  0
                </h4>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-100 transition-all duration-300">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Rejected</span>
                <h4 className="text-3xl font-bold text-gray-900 tracking-tight">
                  0
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-slate-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Enrollment No.</th>
                    <th className="px-6 py-4">Institution</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Study Status</th>
                    <th className="px-6 py-4">Documents</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs font-medium text-gray-500">Loading placements...</span>
                        </div>
                      </td>
                    </tr>
                  ) : placements.length > 0 ? (
                    placements.map((placement, idx) => (
                      <tr key={placement._id || idx} className="group hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent transition-all duration-200 text-xs font-medium text-gray-600 border-b border-gray-100 last:border-b-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img 
                                src={placement.personal?.avatar || '/default_user.png'} 
                                alt={placement.personal?.fullName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/default_user.png';
                                }}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                              />
                            </div>
                            <span className="font-bold text-gray-900 tracking-tight">
                              {placement.personal?.fullName || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-md">{placement._id?.slice(-6) || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{placement.course?.institution || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-600">{placement.course?.course || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md inline-block">{placement.course?.studyStatus || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{getDocumentCount(placement)} docs</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleViewPlacement(placement)} 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="View Details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleEditPlacement(placement)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(placement)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-xs font-medium text-gray-400">
                        No placement applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modern Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-600">
                Showing <span className="font-semibold text-gray-900">{(pagination.currentPage - 1) * 10 + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(pagination.currentPage * 10, pagination.totalCount)}</span> of <span className="font-semibold text-gray-900">{pagination.totalCount}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 text-xs font-semibold rounded-lg transition-all ${
                          pagination.currentPage === pageNum
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                >
                  Next
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Update Placement Modal */}
      <UpdatePlacementModal 
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setUpdatePlacement(null);
        }}
        placement={updatePlacement}
        onUpdate={handleUpdatePlacement}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Placement</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this placement? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeletePlacement(deleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placement Detail Modal */}
      {showDetailModal && selectedPlacement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Placement Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">{selectedPlacement._id?.slice(-6)}</p>
              </div>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedPlacement(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Full Name</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.personal?.fullName || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Email</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.personal?.email || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Phone</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.personal?.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Gender</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.personal?.gender || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  Course Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Institution</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.course?.institution || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Course</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.course?.course || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Study Status</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.course?.studyStatus || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Study Mode</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.course?.studyMode || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Placement Preferences
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Industry</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.preference?.industry || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Role</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.preference?.role || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Location</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.preference?.location || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Placement Type</span>
                    <span className="font-semibold text-gray-900">{selectedPlacement.preference?.placementType || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documents
                </h3>
                <div className="space-y-2">
                  {selectedPlacement.documents && Object.entries(selectedPlacement.documents).map(([docType, doc]) => (
                    <div key={docType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-xs">{docType.toUpperCase()}</span>
                          {doc.status && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getDocumentStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500">{doc.fileName || 'No file'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementsData;