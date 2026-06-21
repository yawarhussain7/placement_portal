import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiSend,
  FiHome,
  FiBarChart2,
  FiSettings,
  FiHexagon
} from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate(); // ✅ INSIDE COMPONENT

  const menuItems = [
    { id: 'dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'students', path: '/admin/students', label: 'Students', icon: FiUsers },
    { id: 'placement', path: '/admin/placement', label: 'New Placement', icon: FiBriefcase },
    { id: 'documents', path: '/admin/documents', label: 'Documents', icon: FiFileText },
    { id: 'applications', path: '/admin/applications', label: 'Applications', icon: FiSend },
    { id: 'companies', path: '/admin/companies', label: 'Companies', icon: FiHome },
    { id: 'reports', path: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
    { id: 'settings', path: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  const handleClick = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="w-64 bg-white min-h-screen flex flex-col justify-between p-4 shadow-2xl shadow-gray-200/60 rounded-r-2xl">

      {/* BRAND */}
      <div>
        <div className="flex items-center gap-2 px-3 py-4 mb-4 border-b border-gray-100/60">
          <div className="bg-[#22C55E] p-1.5 rounded-lg text-white">
            <FiHexagon className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">
            Webmantis
          </span>
        </div>

        {/* NAV */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#EFFDF4] text-[#22C55E]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* PROFILE */}
      <div className="border-t border-gray-100 pt-4 flex items-center gap-3 px-3">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
          A
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900 leading-none">
            Admin User
          </h4>
          <span className="text-xs text-gray-400 font-medium">
            Super Admin
          </span>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;