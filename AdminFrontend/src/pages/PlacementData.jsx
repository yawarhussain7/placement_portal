import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar'; 
import Header from '../components/common/Header';   
import VerificationTabHeader from '../components/placement/VerificationTabHeader';
import AdminDocumentRow from '../components/placement/AdminDocumentRow';
import { FiCheck, FiX, FiFlag, FiDownload, FiArrowLeft, FiEye, FiEdit2, FiSave, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { getPlacements, getPlacementById, updatePlacementField, verifyDocument, rejectDocument } from '../api/placements.js';

const PlacementData = () => {
  const [activeTab, setActiveTab] = useState('application');
  const [currentSection, setCurrentSection] = useState('personal');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFinalApproval = () => {
    console.log('Final approval clicked for student:', selectedStudentId);
  };

  const handleDispatchQuery = () => {
    console.log('Dispatch query clicked');
  };

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        setLoading(true);
        const response = await getPlacements();
        
        if (response.success && response.data) {
          setStudentsList(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch placements:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  const currentStudent = studentsList.find(s => s._id === selectedStudentId);

  const getPendingDocsCount = (student) => {
    if (!student?.documents) return 0;
    const docs = [student.documents.resume, student.documents.photoId, student.documents.transcript, student.documents.certificates].filter(Boolean);
    return docs.length;
  };

  const getDocumentStatusColor = (status) => {
    const statusColors = {
      'Verified': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
      'Pending Approval': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Uploaded': 'bg-blue-50 text-blue-700 border-blue-200'
    };
    return statusColors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const handleFieldChange = async (section, fieldKey, val) => {
    if (!isEditing) return;
    
    try {
      await updatePlacementField(selectedStudentId, section, fieldKey, val);
      
      setStudentsList(prev => prev.map(student => {
        if (student._id !== selectedStudentId) return student;
        return {
          ...student,
          [section]: {
            ...student[section],
            [fieldKey]: val
          }
        };
      }));
    } catch (err) {
      console.error('Failed to update field:', err.message);
    }
  };

  const handleVerifyDoc = async (docId) => {
    try {
      await verifyDocument(selectedStudentId, docId);
      
      setStudentsList(prev => prev.map(student => {
        if (student._id !== selectedStudentId) return student;
        return {
          ...student,
          documents: { ...student.documents, [docId]: { ...student.documents[docId], status: 'Verified' } }
        };
      }));
    } catch (err) {
      console.error('Failed to verify document:', err.message);
    }
  };

  const handleRejectDoc = async (docId) => {
    try {
      await rejectDocument(selectedStudentId, docId);
      
      setStudentsList(prev => prev.map(student => {
        if (student._id !== selectedStudentId) return student;
        return {
          ...student,
          documents: { ...student.documents, [docId]: { ...student.documents[docId], status: 'Rejected' } }
        };
      }));
    } catch (err) {
      console.error('Failed to reject document:', err.message);
    }
  };

  const downloadStudentCSV = (student) => {
    const csvRows = [['Section Workspace Group', 'Registry Field Name Label', 'Verified Value Payload']];
    
    ['personal', 'course', 'preference'].forEach(section => {
      Object.entries(student[section]).forEach(([key, val]) => {
        const formattedLabel = key.replace(/([A-Z])/g, ' $1').toUpperCase();
        csvRows.push([section.toUpperCase(), formattedLabel, val]);
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", encodedUri);
    downloadLink.setAttribute("download", `Master_Record_Export_${student._id}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {/* INDEX WORKSPACE: Premium Optimized Placement Directory */}
          {!selectedStudentId ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">Placement Registry Directory</h1>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">Global system administrative hub for tracking, validation status, and pipeline filtering</p>
                </div>
                <div className="text-xs text-gray-400 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200/60">
                  Active Applications Count: <span className="text-gray-900 font-bold">{studentsList.length}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-slate-400 font-medium text-sm">
                    Loading placements...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
                      <thead>
                        <tr className="bg-[#F8FAFC] border-b border-gray-200/80 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4 pl-6">Student</th>
                          <th className="p-4">Enrollment No.</th>
                          <th className="p-4">Institution</th>
                          <th className="p-4">Course</th>
                          <th className="p-4">Study Status</th>
                          <th className="p-4">Documents</th>
                          <th className="p-4 text-right pr-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                        {studentsList.map((student) => {
                          const pendingCount = getPendingDocsCount(student);
                          const verifiedCount = student.documents ? 
                            Object.values(student.documents).filter(doc => doc && doc.status === 'Verified').length : 0;
                          
                          return (
                            <tr key={student._id} className="hover:bg-gray-50/60 transition-all group">
                              {/* Student Name */}
                              <td className="p-4 pl-6">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <img 
                                      src={student.personal?.avatar || '/default_user.png'} 
                                      alt={student.personal?.fullName}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default_user.png';
                                      }}
                                      className="w-9 h-9 rounded-lg object-cover border border-gray-200/80"
                                    />
                                  </div>
                                  <span className="font-bold text-gray-900 text-sm block tracking-tight">
                                    {student.personal?.fullName || 'N/A'}
                                  </span>
                                </div>
                              </td>

                              {/* Enrollment No. */}
                              <td className="p-4 vertical-align-middle">
                                <span className="font-mono text-[11px] text-gray-600 font-semibold">
                                  {student._id?.slice(-6) || 'N/A'}
                                </span>
                              </td>

                              {/* Institution */}
                              <td className="p-4 vertical-align-middle">
                                <span className="text-gray-800 font-semibold block max-w-[200px] truncate" title={student.course?.institution}>
                                  {student.course?.institution || 'N/A'}
                                </span>
                              </td>

                              {/* Course */}
                              <td className="p-4 vertical-align-middle">
                                <span className="text-gray-600 block max-w-[180px] truncate" title={student.course?.course}>
                                  {student.course?.course || 'N/A'}
                                </span>
                              </td>

                              {/* Study Status */}
                              <td className="p-4">
                                <span className={`px-2 py-0.5 font-bold rounded text-[11px] border ${
                                  student.course?.studyStatus === 'Currently Enrolled' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : student.course?.studyStatus === 'Final Semester' || student.course?.studyStatus === 'Final Year'
                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                    : student.course?.studyStatus === 'Recently Graduated'
                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                                }`}>
                                  {student.course?.studyStatus || 'N/A'}
                                </span>
                              </td>

                              {/* Documents */}
                              <td className="p-4">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-semibold">
                                      {verifiedCount}/{getPendingDocsCount(student) + verifiedCount}
                                    </span>
                                    <span className="text-gray-400 text-[10px]">verified</span>
                                  </div>
                                  {pendingCount > 0 && (
                                    <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded-full border border-yellow-200 w-fit">
                                      {pendingCount} pending
                                    </span>
                                  )}
                                  {pendingCount === 0 && verifiedCount > 0 && (
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 w-fit">
                                      Complete
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Actions Column */}
                              <td className="p-4 text-right pr-6">
                                <div className="flex items-center gap-1.5 justify-end">
                                  <button 
                                    onClick={() => downloadStudentCSV(student)}
                                    className="p-2 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all inline-flex items-center shadow-sm" 
                                    title="Export Master CSV File"
                                  >
                                    <FiDownload className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => { setSelectedStudentId(student._id); setCurrentSection('personal'); }}
                                    className="px-3 py-2 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-lg transition-all inline-flex items-center gap-1.5 shadow-sm"
                                  >
                                    <FiEye className="w-3.5 h-3.5" /> Open
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            
            /* WORKSPACE PANELS: Individual Focused Evaluation Area */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setSelectedStudentId(null); setIsEditing(false); }}
                    className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-500 transition-colors"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Verification Desk Workspace</span>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">{currentStudent?.personal?.fullName || 'N/A'}</h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 shadow-sm ${
                      isEditing 
                        ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {isEditing ? <><FiSave /> Save Field Changes</> : <><FiEdit2 /> Modify Form Fields</>}
                  </button>
                  <button 
                    onClick={() => downloadStudentCSV(currentStudent)}
                    className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FiDownload /> Export CSV Sheet
                  </button>
                  <button onClick={handleFinalApproval} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                    <FiCheck /> Final Approval
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* ACTIVE TAB MODULAR COMPONENT CONTROL VIEWPORTS */}
                <div className="lg:col-span-2 space-y-4">
                  <VerificationTabHeader 
                    activeTab={currentSection} 
                    setActiveTab={setCurrentSection} 
                    verificationStatus={{ pendingDocs: getPendingDocsCount(currentStudent) }}
                  />

                  <div className="bg-white p-6 rounded-b-xl border-x border-b border-gray-100 text-xs shadow-sm">
                    
                    {/* PERSONAL PORTAL WORKSPACE FIELDS */}
                    {currentSection === 'personal' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentStudent?.personal && Object.entries(currentStudent.personal).map(([key, val]) => (
                          <div key={key} className={`space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border border-gray-100 ${key === 'address' || key === 'suburb' ? 'sm:col-span-2' : ''}`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </label>
                            {isEditing ? (
                              key === 'address' || key === 'suburb' ? (
                                <textarea
                                  value={val || ''}
                                  rows={2}
                                  onChange={(e) => handleFieldChange('personal', key, e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded p-2 text-gray-800 font-semibold focus:outline-none focus:border-emerald-500 resize-none"
                                />
                              ) : (
                                <input 
                                  type="text"
                                  value={val || ''}
                                  onChange={(e) => handleFieldChange('personal', key, e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-gray-800 font-semibold focus:outline-none focus:border-emerald-500"
                                />
                              )
                            ) : (
                              <p className="text-gray-900 font-bold tracking-tight">{val || '—'}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ACADEMICS REGISTRY DATA MATRIX VIEWPORT */}
                    {currentSection === 'course' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentStudent?.course && Object.entries(currentStudent.course).map(([key, val]) => (
                          <div key={key} className={`space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border ${key === 'cgpa' ? 'border-emerald-100 bg-emerald-50/20' : 'border-gray-100'}`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </label>
                            {isEditing ? (
                              <input 
                                type="text"
                                value={val || ''}
                                onChange={(e) => handleFieldChange('course', key, e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-gray-800 font-semibold focus:outline-none focus:border-emerald-500"
                              />
                            ) : (
                              <p className={`font-bold tracking-tight ${key === 'cgpa' ? 'text-emerald-700 text-sm' : 'text-gray-900'}`}>{val || '—'}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* COMPREHENSIVE PLACEMENT PREFERENCE WORKSPACE */}
                    {currentSection === 'preference' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentStudent?.preference && Object.entries(currentStudent.preference).map(([key, val]) => (
                          <div key={key} className={`space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border ${key.startsWith('internship') ? 'border-blue-100 bg-blue-50/10' : 'border-gray-100'} ${['roles', 'skills'].includes(key) ? 'sm:col-span-2' : ''}`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </label>
                            {isEditing ? (
                              ['roles', 'skills'].includes(key) ? (
                                <textarea
                                  value={val || ''}
                                  rows={2}
                                  onChange={(e) => handleFieldChange('preference', key, e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded p-2 text-gray-800 font-semibold focus:outline-none focus:border-emerald-500 resize-none"
                                />
                              ) : (
                                <input 
                                  type="text"
                                  value={val || ''}
                                  onChange={(e) => handleFieldChange('preference', key, e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-gray-800 font-semibold focus:outline-none focus:border-emerald-500"
                                />
                              )
                            ) : (
                              <p className="text-gray-900 font-bold tracking-tight">{val || '—'}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SUBMITTED DOCUMENT VERIFICATION STACK */}
                    {currentSection === 'documents' && (
                      <div className="space-y-3">
                        {currentStudent?.documents && Object.entries(currentStudent.documents).map(([docType, doc]) => (
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
                              <span className="text-[10px] text-gray-500">{doc.fileName || 'No file uploaded'}</span>
                            </div>
                            {doc.status === 'Pending Approval' && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleVerifyDoc(docType)}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                  title="Verify"
                                >
                                  <FiCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectDoc(docType)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Reject"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {(!currentStudent?.documents || Object.keys(currentStudent.documents).length === 0) && (
                          <p className="text-xs text-gray-400 text-center py-4">No documents uploaded</p>
                        )}
                      </div>
                    )}

                  </div>
                </div>

                {/* APP ELIGIBILITY METRICS SIDEBAR WRAPPER */}
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 text-xs">
                    <h3 className="font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                      <FiFlag className="text-emerald-600" /> Automated Eligibility Checks
                    </h3>
                    <div className="space-y-2.5 font-medium text-gray-600">
                      <div className="flex items-center justify-between p-2 bg-emerald-50/40 border border-emerald-100 rounded-lg">
                        <span>Academic Performance Cutoff</span>
                        <span className="text-emerald-600 font-bold">Passed</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-amber-50/40 border border-amber-100 rounded-lg">
                        <span>Pending System Credentials</span>
                        <span className="text-amber-600 font-bold">{getPendingDocsCount(currentStudent)} Pending Verification</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3 text-xs">
                    <h3 className="font-bold text-gray-900 tracking-tight">Internal Evaluation Notes</h3>
                    <textarea
                      value={adminFeedback}
                      onChange={(e) => setAdminFeedback(e.target.value)}
                      placeholder="Write evaluation log notices here..."
                      rows={4}
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none"
                    />
                    <button onClick={handleDispatchQuery} className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors">
                      Dispatch Query to Student Portal
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default PlacementData;