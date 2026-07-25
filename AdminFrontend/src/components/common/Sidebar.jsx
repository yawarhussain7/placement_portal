import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiSend,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiLogOut,
  FiUser,
  FiHelpCircle
} from 'react-icons/fi';
import logo from '../../assets/logo.png';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'students', path: '/admin/students', label: 'Students', icon: FiUsers },
    { id: 'placements', path: '/admin/placements', label: 'Placements', icon: FiBriefcase },
    { id: 'applications', path: '/admin/applications', label: 'Applications', icon: FiFileText },
    { id: 'documents', path: '/admin/documents', label: 'Documents', icon: FiFileText },
    { id: 'reports', path: '/admin/reports', label: 'Reports', icon: FiSend },
    { id: 'messages', path: '/admin/messages', label: 'Messages', icon: FiMessageSquare },
    { id: 'settings', path: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  const handleClick = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  const handleProfileClick = (action) => {
    setShowProfileMenu(false);
    switch(action) {
      case 'profile':
        toast.success('Profile page coming soon!');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      case 'help':
        toast.success('Help & Support coming soon!');
        break;
      case 'logout':
        toast.success('Logged out successfully!');
        navigate('/auth/admin-login');
        break;
      default:
        break;
    }
  };

  return (
    <aside
      className={`
        ${isCollapsed ? 'w-14' : 'w-48'}
        bg-white
        min-h-screen
        flex flex-col
        justify-between
        relative
        transition-all duration-500 ease-in-out
        shadow-lg
        border-r border-gray-200
        z-50
      `}
    >

      {/* TOP SECTION */}
      <div className="relative z-10">
        {/* BRAND */}
        <div className="flex items-center justify-between px-2.5 py-2.5 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={logo}
                alt="Webmantis"
                className="h-8 w-auto object-contain flex-shrink-0"
              />
            </div>
          )}
          {isCollapsed && (
            <img
              src={logo}
              alt="Webmantis"
              className="h-6 w-auto object-contain mx-auto"
            />
          )}
        </div>

        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-1.5 top-12 z-20 w-3.5 h-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110"
        >
          {isCollapsed ? <FiChevronRight className="w-2 h-2" /> : <FiChevronLeft className="w-2 h-2" />}
        </button>

        {/* NAVIGATION */}
        <nav className="px-1.5 py-2 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={`
                  w-full flex items-center gap-1.5 px-1.5 py-1.5 rounded-md
                  text-base font-medium
                  transition-all duration-200 ease-in-out
                  group relative
                  ${isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 bg-emerald-600 rounded-r-full"></div>
                )}

                {/* Icon Container */}
                <div className={`
                  flex items-center justify-center
                  w-6 h-6 rounded-md
                  transition-all duration-200
                  flex-shrink-0
                  ${isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700'
                  }
                `}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Label */}
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap text-sm">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION - PROFILE */}
      <div className="relative z-10 border-t border-gray-100 p-1.5">
        <div className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-md hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
             onClick={() => setShowProfileMenu(!showProfileMenu)}>
          {/* Avatar with Status */}
          <div className="relative flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
              A
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h4 className="text-gray-900 text-[11px] font-semibold leading-tight truncate">
                Admin User
              </h4>
              <span className="text-gray-500 text-[9px] font-medium">
                Super Admin
              </span>
            </div>
          )}
        </div>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute bottom-16 left-2 right-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-2 py-1.5 border-b border-gray-100 mb-1">
              <p className="text-xs font-semibold text-gray-900">Admin User</p>
              <p className="text-[10px] text-gray-500">admin@webmantis.com</p>
            </div>
            <button 
              onClick={() => handleProfileClick('profile')}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 transition-colors text-left rounded-md"
            >
              <FiUser className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-700">Profile</span>
            </button>
            <button 
              onClick={() => handleProfileClick('settings')}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 transition-colors text-left rounded-md"
            >
              <FiSettings className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-700">Settings</span>
            </button>
            <button 
              onClick={() => handleProfileClick('help')}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 transition-colors text-left rounded-md"
            >
              <FiHelpCircle className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-700">Help & Support</span>
            </button>
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button 
                onClick={() => handleProfileClick('logout')}
                className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-red-50 transition-colors text-left rounded-md text-red-600"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;