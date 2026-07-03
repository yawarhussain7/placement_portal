import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar'; 
import Header from '../components/common/Header';   
import VerificationTabHeader from '../components/placement/VerificationTabHeader';
import AdminDocumentRow from '../components/placement/AdminDocumentRow';
import { FiCheck, FiX, FiFlag, FiDownload, FiArrowLeft, FiEye, FiEdit2, FiSave, FiFileText, FiAlertCircle } from 'react-icons/fi';

const PlacementData = () => {
  const [activeTab, setActiveTab] = useState('application');
  const [currentSection, setCurrentSection] = useState('personal');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Deeply constructed mock master state ensuring no field is omitted
  const [studentsList, setStudentsList] = useState([
    {
      id: 'CSE2021087',
      personal: {
        firstName: 'Rohan',
        lastName: 'Kapoor',
        email: 'rohan.kapoor@university.edu',
        phone: '+91 98200 34567',
        dob: '15/04/2002',
        gender: 'Male',
        nationality: 'Indian',
        address: 'Skyline Towers, Andheri West, Mumbai, Maharashtra',
        fathersName: 'Suresh Kapoor',
        emergencyContact: '+91 98200 00001'
      },
      course: {
        department: 'Computer Science & Engineering',
        program: 'B.Tech',
        specialization: 'Artificial Intelligence',
        enrollmentNo: 'CSE2021087',
        batch: '2021-2025',
        semester: '7th Semester',
        cgpa: '8.74',
        backlogs: '0',
        twelfth: '91.4%',
        tenth: '88.0%',
        gapDuration: 'None'
      },
      preference: {
        roles: 'Software Development, Data Science / ML, Research & Development',
        locations: 'Bangalore / Remote',
        mode: 'Hybrid',
        ctc: '12-18 LPA',
        noticePeriod: 'Immediate',
        skills: 'Python, React.js, Machine Learning, SQL, Node.js, AWS, Docker',
        internshipCompany: 'Flipkart',
        internshipRole: 'SDE Intern',
        internshipDuration: '2 months (Summer 2024)'
      },
      documents: [
        { id: 'doc1', name: 'Resume / CV', status: 'Pending Approval', meta: '312 KB • Jan 14, 2026' },
        { id: 'doc2', name: '10th Marksheet', status: 'Verified', meta: '1.2 MB • Jan 14, 2026' },
        { id: 'doc3', name: '12th Marksheet', status: 'Verified', meta: '980 KB • Jan 14, 2026' },
        { id: 'doc4', name: 'College ID Card', status: 'Pending Approval', meta: '440 KB • Jan 15, 2026' },
        { id: 'doc5', name: 'Aadhar / National ID', status: 'Rejected', meta: '1.1 MB • Jan 12, 2026' }
      ]
    },
    {
      id: 'CSE2021045',
      personal: {
        firstName: 'Ananya',
        lastName: 'Sharma',
        email: 'ananya.sharma@university.edu',
        phone: '+91 98111 22233',
        dob: '22/11/2003',
        gender: 'Female',
        nationality: 'Indian',
        address: 'Green Glen Layout, Bangalore, Karnataka',
        fathersName: 'Rajesh Sharma',
        emergencyContact: '+91 98111 00000'
      },
      course: {
        department: 'Information Technology',
        program: 'B.Tech',
        specialization: 'Cloud Computing',
        enrollmentNo: 'CSE2021045',
        batch: '2021-2025',
        semester: '7th Semester',
        cgpa: '9.12',
        backlogs: '0',
        twelfth: '94.2%',
        tenth: '92.5%',
        gapDuration: 'None'
      },
      preference: {
        roles: 'Cloud Engineer, DevOps, Frontend Developer',
        locations: 'Bangalore / Pune',
        mode: 'On-site',
        ctc: '10-15 LPA',
        noticePeriod: 'Immediate',
        skills: 'Java, AWS, Docker, Kubernetes, React.js, JavaScript, Linux',
        internshipCompany: 'Amazon',
        internshipRole: 'Cloud Intern',
        internshipDuration: '3 months (Summer 2024)'
      },
      documents: [
        { id: 'doc1', name: 'Resume / CV', status: 'Verified', meta: '245 KB • Jan 12, 2026' },
        { id: 'doc2', name: '10th Marksheet', status: 'Verified', meta: '1.1 MB • Jan 12, 2026' },
        { id: 'doc3', name: '12th Marksheet', status: 'Verified', meta: '890 KB • Jan 12, 2026' }
      ]
    }
  ]);

  const currentStudent = studentsList.find(s => s.id === selectedStudentId);

  const getPendingDocsCount = (student) => student?.documents?.filter(d => d.status === 'Pending Approval').length || 0;
  const getVerifiedDocsCount = (student) => student?.documents?.filter(d => d.status === 'Verified').length || 0;

  const handleFieldChange = (section, fieldKey, val) => {
    setStudentsList(prev => prev.map(student => {
      if (student.id !== selectedStudentId) return student;
      return {
        ...student,
        [section]: {
          ...student[section],
          [fieldKey]: val
        }
      };
    }));
  };

  const handleVerifyDoc = (docId) => {
    setStudentsList(prev => prev.map(student => {
      if (student.id !== selectedStudentId) return student;
      return {
        ...student,
        documents: student.documents.map(d => d.id === docId ? { ...d, status: 'Verified' } : d)
      };
    }));
  };

  const handleRejectDoc = (docId) => {
    setStudentsList(prev => prev.map(student => {
      if (student.id !== selectedStudentId) return student;
      return {
        ...student,
        documents: student.documents.map(d => d.id === docId ? { ...d, status: 'Rejected' } : d)
      };
    }));
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
    downloadLink.setAttribute("download", `Master_Record_Export_${student.id}.csv`);
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
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-gray-200/80 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4 pl-6">Student Details & Roll</th>
                        <th className="p-4">Academic Program</th>
                        <th className="p-4">Metrics Status</th>
                        <th className="p-4">Registry Credentials</th>
                        <th className="p-4 text-right pr-6">Operational Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                      {studentsList.map((student) => {
                        const pendingCount = getPendingDocsCount(student);
                        const verifiedCount = getVerifiedDocsCount(student);
                        return (
                          <tr key={student.id} className="hover:bg-gray-50/60 transition-all group">
                            {/* Student Primary Column */}
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200/80 flex items-center justify-center font-bold text-gray-700 text-[11px] group-hover:bg-white transition-colors">
                                  {student.personal.firstName[0]}{student.personal.lastName[0]}
                                </div>
                                <div className="space-y-0.5">
                                  <span className="font-bold text-gray-900 text-sm block tracking-tight">{student.personal.firstName} {student.personal.lastName}</span>
                                  <span className="font-mono text-[11px] text-gray-400 block">{student.id}</span>
                                </div>
                              </div>
                            </td>

                            {/* Department Info */}
                            <td className="p-4 vertical-align-middle">
                              <div className="space-y-0.5">
                                <span className="text-gray-800 font-semibold block">{student.course.department}</span>
                                <span className="text-gray-400 text-[11px] block">{student.course.program} • {student.course.batch}</span>
                              </div>
                            </td>

                            {/* CGPA and Backlog Badges */}
                            <td className="p-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[11px] border border-emerald-100">
                                  {student.course.cgpa} CGPA
                                </span>
                                {student.course.backlogs === '0' ? (
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[10px] border border-blue-100 uppercase tracking-wide">
                                    Clear
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded text-[10px] border border-rose-100 uppercase tracking-wide flex items-center gap-1">
                                    <FiAlertCircle /> {student.course.backlogs} Backlog
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Documents Status counters */}
                            <td className="p-4">
                              <div className="flex items-center gap-3 text-gray-500 font-semibold">
                                <div className="flex items-center gap-1" title="Verified Items">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  <span>{verifiedCount} Verified</span>
                                </div>
                                {pendingCount > 0 && (
                                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-100 text-[10px]" title="Pending Verification">
                                    <span>{pendingCount} Pending</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="p-4 text-right pr-6 space-x-1.5">
                              <button 
                                onClick={() => downloadStudentCSV(student)}
                                className="p-2 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all inline-flex items-center shadow-sm" 
                                title="Export Master CSV File"
                              >
                                <FiDownload className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => { setSelectedStudentId(student.id); setCurrentSection('personal'); }}
                                className="px-3 py-2 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-lg transition-all inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <FiEye className="w-3.5 h-3.5" /> Open Workspace
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">{currentStudent.personal.firstName} {currentStudent.personal.lastName}</h1>
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
                  <button className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm">
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
                        {Object.entries(currentStudent.personal).map(([key, val]) => (
                          <div key={key} className={`space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border border-gray-100 ${key === 'address' ? 'sm:col-span-2' : ''}`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </label>
                            {isEditing ? (
                              key === 'address' ? (
                                <textarea
                                  value={val}
                                  rows={2}
                                  onChange={(e) => handleFieldChange('personal', key, e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded p-2 text-gray-800 font-semibold focus:outline-none focus:border-emerald-500 resize-none"
                                />
                              ) : (
                                <input 
                                  type="text"
                                  value={val}
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
                        {Object.entries(currentStudent.course).map(([key, val]) => (
                          <div key={key} className={`space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border ${key === 'cgpa' ? 'border-emerald-100 bg-emerald-50/20' : 'border-gray-100'}`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </label>
                            {isEditing ? (
                              <input 
                                type="text"
                                value={val}
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
                        {Object.entries(currentStudent.preference).map(([key, val]) => (
                          <div key={key} className={`space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border ${key.startsWith('internship') ? 'border-blue-100 bg-blue-50/10' : 'border-gray-100'} ${['roles', 'skills'].includes(key) ? 'sm:col-span-2' : ''}`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </label>
                            {isEditing ? (
                              ['roles', 'skills'].includes(key) ? (
                                <textarea
                                  value={val}
                                  rows={2}
                                  onChange={(e) => handleFieldChange('preference', key, e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded p-2 text-gray-800 font-semibold focus:outline-none focus:border-emerald-500 resize-none"
                                />
                              ) : (
                                <input 
                                  type="text"
                                  value={val}
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
                        {currentStudent.documents.map((doc) => (
                          <AdminDocumentRow 
                            key={doc.id} 
                            doc={doc} 
                            onVerify={handleVerifyDoc}
                            onReject={handleRejectDoc}
                          />
                        ))}
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
                        <span className="text-emerald-600 font-bold">Passed ({currentStudent.course.cgpa})</span>
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
                    <button className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors">
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