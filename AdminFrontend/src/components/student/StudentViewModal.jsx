import React from 'react';

const StudentViewModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  const InfoCard = ({ icon, label, value, href }) => (
    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
          {href ? (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline break-all"
            >
              {value}
            </a>
          ) : (
            <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Student Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Student Header with Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="relative">
              <img 
                src={student.avatar || '/default_user.png'} 
                alt={student.fullName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default_user.png';
                }}
                className="w-20 h-20 rounded-full object-cover border-4 border-emerald-100"
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 ${
                student.isActive ? 'border-emerald-500' : 'border-gray-400'
              }`}>
                <div className={`w-3 h-3 rounded-full ${student.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{student.fullName}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                @{student.username}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  student.isActive 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${student.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {student.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  student.isVerified 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${student.isVerified ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  {student.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* Student Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard 
              icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>}
              label="Email Address"
              value={student.email}
            />

            <InfoCard 
              icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>}
              label="Phone Number"
              value={student.phone || 'Not provided'}
            />

            <InfoCard 
              icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>}
              label="Gender"
              value={student.gender || 'Not provided'}
            />

            <InfoCard 
              icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>}
              label="Date of Birth"
              value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}
            />

            <InfoCard 
              icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>}
              label="Theme Preference"
              value={student.theme ? student.theme.charAt(0).toUpperCase() + student.theme.slice(1) : 'Light'}
            />

            <InfoCard 
              icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              label="Member Since"
              value={student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
            />

            <InfoCard 
              icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>}
              label="Last Updated"
              value={student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : 'N/A'}
            />
          </div>

          {/* Website Section */}
          {student.website && (
            <div className="mt-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Website</label>
                  <a 
                    href={student.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline break-all"
                  >
                    {student.website}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Bio Section */}
          {student.bio && (
            <div className="mt-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Bio</label>
                  <p className="text-sm font-medium text-gray-900">{student.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewModal;
