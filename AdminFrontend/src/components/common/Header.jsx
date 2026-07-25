import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiBell, FiChevronRight, FiMenu, FiX, FiLogOut, FiUser, FiSettings, FiHelpCircle } from 'react-icons/fi';

const Header = ({ 
  title = 'Dashboard', 
  breadcrumbs,
  onSearch,
  showSearch = true 
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New application received', message: 'John Doe applied for Software Engineer', time: '2 min ago', unread: true },
    { id: 2, title: 'Placement drive scheduled', message: 'Wipro drive on 18th May', time: '1 hour ago', unread: true },
    { id: 3, title: 'Document uploaded', message: 'Resume uploaded by Jane Smith', time: '3 hours ago', unread: true },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-3 md:px-6 py-3">
        
        {/* LEFT SECTION - Title & Breadcrumb */}
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
          </button>

          <div>
            {/* Breadcrumb */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 text-xs mb-0.5">
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <FiChevronRight className="w-2.5 h-2.5 text-gray-400" />}
                    <Link
                      to={item.path}
                      className={`${
                        index === breadcrumbs.length - 1
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-500 hover:text-emerald-600 transition-colors'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </React.Fragment>
                ))}
              </nav>
            )}

            {/* Page Title */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
        </div>

        {/* RIGHT SECTION - Actions */}
        <div className="flex items-center gap-1.5 md:gap-3">
          
          {/* Search Bar - Hidden on mobile */}
          {showSearch && (
            <div className="hidden md:block relative">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-56 lg:w-64 transition-all"
              />
            </div>
          )}

          {/* Mobile Search Icon */}
          <button className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <FiSearch className="w-4 h-4 text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiBell className="w-4 h-4 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                  <p className="text-xs text-gray-500 mt-0.5">You have {unreadCount} unread notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notification.unread ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          notification.unread ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                          <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3 py-2 border-t border-gray-100">
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium w-full text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-gray-200"></div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                SA
              </div>
              <div className="hidden lg:block text-left">
                <h4 className="text-xs font-semibold text-gray-900 leading-tight">
                  System Admin
                </h4>
                <p className="text-[10px] text-gray-500">Administrator</p>
              </div>
              <FiChevronRight className="hidden lg:block w-3.5 h-3.5 text-gray-400 rotate-90" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">System Admin</p>
                  <p className="text-xs text-gray-500 mt-0.5">admin@webmantis.com</p>
                </div>
                <div className="py-2">
                  <button 
                    onClick={() => handleProfileClick('profile')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Profile</span>
                  </button>
                  <button 
                    onClick={() => handleProfileClick('settings')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiSettings className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Settings</span>
                  </button>
                  <button 
                    onClick={() => handleProfileClick('help')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiHelpCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Help & Support</span>
                  </button>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <button 
                    onClick={() => handleProfileClick('logout')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-left text-red-600"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Mobile menu content can be added here */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
