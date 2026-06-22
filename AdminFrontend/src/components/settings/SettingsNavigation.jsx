import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiBell, FiLock, FiSun } from 'react-icons/fi';

const navItems = [
  { id: 'profile', label: 'Admin Profile', icon: FiUser, path: '/admin/settings/profile' },
  { id: 'notifications', label: 'Notifications', icon: FiBell, path: '/admin/settings/notifications' },
  { id: 'security', label: 'Security', icon: FiLock, path: '/admin/settings/security' },
  { id: 'appearance', label: 'Appearance', icon: FiSun, path: '/admin/settings/appearance' },
];

const SettingsNavigation = () => {
  const { pathname } = useLocation();

  return (
    <div className="w-full md:w-56 shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm space-y-1">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 pb-2 pt-1">
          Menu
        </h4>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left focus:outline-none ${
                isActive
                  ? 'bg-green-600 text-white shadow-sm cursor-default'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsNavigation;
