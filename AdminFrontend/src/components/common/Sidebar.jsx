import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiBriefcase, FiFileText, FiSend, 
  FiBarChart2, FiSettings, FiHexagon, FiLogOut, FiChevronRight
} from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'students', path: '/admin/students', label: 'Students', icon: FiUsers },
    { id: 'placement', path: '/admin/placement', label: 'New Placement', icon: FiBriefcase },
    { id: 'documents', path: '/admin/documents', label: 'Documents', icon: FiFileText },
    { id: 'applications', path: '/admin/applications', label: 'Applications', icon: FiSend },
    { id: 'reports', path: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
    { id: 'settings', path: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    // Add your auth logic here (e.g., clear localStorage, etc.)
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between py-6">
      
      {/* BRAND & NAV */}
      <div>
        <div className="flex items-center gap-3 px-6 mb-8">
          <div className="bg-green-600 p-2 rounded-xl text-white">
            <FiHexagon className="w-5 h-5" />
          </div>
          <span className="font-black text-slate-900 tracking-tight text-xl">Webmantis</span>
        </div>

        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); navigate(item.path); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
                {isActive && <FiChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* FOOTER: PROFILE & LOGOUT */}
      <div className="px-4 space-y-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700">
            AD
          </div>
          <div className="overflow-hidden">
            <h4 className="text-[11px] font-black text-slate-900 truncate">Admin User</h4>
            <p className="text-[10px] font-bold text-slate-400">Super Admin</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;