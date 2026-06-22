import React from 'react';
import { FiUser, FiBell, FiLock, FiCpu } from 'react-icons/fi';

const navItems = [
  { id: 'profile', label: 'Admin Profile', icon: FiUser },
  { id: 'notifications', label: 'Notifications', icon: FiBell },
  { id: 'security', label: 'Security', icon: FiLock },
  { id: 'system', label: 'System Settings', icon: FiCpu },
];

const SettingsNavigation = ({ activeSection, setActiveSection }) => {
  return (
    <div className="w-full md:w-56 shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm space-y-1">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 pb-2 pt-1">
          Menu
        </h4>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
              activeSection === item.id
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsNavigation;