import React from 'react';
import { FiUser, FiBookOpen, FiBriefcase, FiFileText } from 'react-icons/fi';

const VerificationTabHeader = ({ activeTab, setActiveTab, verificationStatus }) => {
  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: <FiUser /> },
    { id: 'course', label: 'Course Info', icon: <FiBookOpen /> },
    { id: 'preference', label: 'Placement Preference', icon: <FiBriefcase /> },
    { id: 'documents', label: 'Documents & Verification', icon: <FiFileText />, badge: true },
  ];

  return (
    <div className="flex border-b border-gray-100 bg-white px-6 pt-2 gap-2 rounded-t-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-3.5 px-3 text-xs font-bold transition-all relative -bottom-[1px] flex items-center gap-2 border-b-2 ${
            activeTab === tab.id
              ? 'border-[#22C55E] text-[#22C55E]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.icon}
          {tab.label}
          {tab.badge && (
            <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">
              {verificationStatus.pendingDocs} Pending
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default VerificationTabHeader;