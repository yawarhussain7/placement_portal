import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  FolderOpen,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  ChevronUp,
  LogOut,
} from "lucide-react";

import SidebarTab from "./SlidebarTab";
import { usePortalData } from "../../context/PortalDataContext";
import { useNavigate } from 'react-router-dom';

// Import your logo correctly
import logo from "../../assets/logo.png"; // Change to your actual logo filename

export default function Sidebar() {
  const { data, logout } = usePortalData();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('../../Api/auth.js');
      await logoutUser();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Backend clears the httpOnly cookie, just clear cached data
      localStorage.removeItem('webmantisPortalData');
      logout();
      navigate('/auth/login');
    }
  };

  const profileOptions = [
    { icon: User, label: "My Profile", to: '/profile' },
    { icon: Settings, label: "Settings", to: '/settings' },
    { icon: HelpCircle, label: "Help & Support", to: '/help' },
  ];

  const bottomOptions = [
    { icon: LogOut, label: "Sign Out", action: handleLogout, danger: true },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between bg-surface sticky top-0 h-screen flex-shrink-0 shadow-pro-md">
        <div className="p-6 space-y-1">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <img
            src={logo}
            alt="Webmantis"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <SidebarTab
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            to="/dashboard"
          />
          <SidebarTab
            icon={<UserPlus size={20} />}
            label="New Placement"
            to="/new-placement"
          />
          <SidebarTab
            icon={<FileText size={20} />}
            label="My Applications"
            to="/applications"
          />
          <SidebarTab
            icon={<FolderOpen size={20} />}
            label="Documents"
            to="/documents"
          />
          <SidebarTab
            icon={<MessageSquare size={20} />}
            label="Messages"
            to="/messages"
          />
          <SidebarTab
            icon={<User size={20} />}
            label="Profile"
            to="/profile"
          />
          <SidebarTab
            icon={<Settings size={20} />}
            label="Settings"
            to="/settings"
          />
          <SidebarTab
            icon={<HelpCircle size={20} />}
            label="Help Center"
            to="/help"
          />
        </nav>
      </div>

      {/* Help Card */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-accent-subtle to-success-subtle rounded-2xl p-4 shadow-pro-md">
          <HelpCircle size={24} className="mx-auto text-accent mb-2" />
          <h4 className="text-sm font-bold text-primary text-center">Need Help?</h4>
          <p className="text-xs text-secondary mt-1 text-center">
            Contact our support team anytime.
          </p>
        </div>
      </div>

      {/* User Profile at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(p => !p)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
          >
            <img 
              src={data.account.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={data.account.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-accent"
            />
            <div className="flex-1 min-w-0 text-left">
              <h3 className="text-sm font-semibold text-primary truncate">
                {data.account.fullName}
              </h3>
              <p className="text-xs text-secondary truncate">
                {data.account.email}
              </p>
            </div>
            <ChevronUp size={16} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-pro-xl overflow-hidden border border-gray-200">
              <div className="py-2">
                {profileOptions.map(({ icon: Icon, label, to }) => (
                  <button
                    key={label}
                    onClick={() => {
                      navigate(to);
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Icon size={16} />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  {bottomOptions.map(({ icon: Icon, label, action, danger }) => (
                    <button
                      key={label}
                      onClick={() => {
                        action();
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        danger 
                          ? "text-red-600 hover:bg-red-50" 
                          : "text-secondary hover:bg-gray-50 hover:text-primary"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
