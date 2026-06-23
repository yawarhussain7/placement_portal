import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiBell, FiUser, FiX, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  onProfile = () => {}, 
  onSettings = () => {}, 
  onLogout = () => {} 
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate()
  // Safely close user popover menu when clicking outside component bounds
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (callback) => {
    setShowUserDropdown(false);
    callback();
  };

  return (
    <header className="relative bg-white border-b border-gray-100 shadow-2xs z-30 antialiased selection:bg-green-100 selection:text-green-900">
      <div className="flex items-center justify-between px-6 md:px-8 py-3.5">
        
        {/* LEFT BRANDING PANEL: Dynamic visibility layout control */}
        <div className={`transition-all duration-200 ${showMobileSearch ? 'hidden xs:block opacity-0 xs:opacity-100' : 'block'}`}>
          <h2 className="text-sm md:text-base font-black text-gray-900 tracking-tight">
            Dashboard Control Panel
          </h2>
          <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest block">
            System Overview & Central Operations
          </p>
        </div>

        {/* RIGHT CORE CONTROLS PANEL */}
        <div className={`flex items-center gap-3.5 sm:gap-5 ${showMobileSearch ? 'w-full xs:w-auto justify-between xs:justify-end' : ''}`}>

          {/* DESKTOP SECURE SEARCH MODULE */}
          <div className="relative w-64 hidden sm:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
              <FiSearch className="w-4 h-4 stroke-[2.5]" />
            </span>
            <input
              type="text"
              placeholder="Search system metrics..."
              className="w-full bg-gray-50/70 pl-9 pr-4 py-2 rounded-xl text-xs text-gray-800 placeholder-gray-400
              border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 focus:bg-white
              shadow-2xs transition-all font-semibold"
            />
          </div>

          {/* RESPONSIVE MOBILE CONTEXT SEARCH FIELD */}
          {showMobileSearch ? (
            <div className="flex items-center gap-2 w-full xs:w-60 sm:hidden animate-fadeIn">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiSearch className="w-4 h-4 stroke-[2.5]" />
                </span>
                <input
                  type="text"
                  autoFocus
                  placeholder="Search portal..."
                  className="w-full bg-gray-50 pl-9 pr-4 py-2 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400
                  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 bg-white"
                />
              </div>
              <button 
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              >
                <FiX className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            /* MOBILE SEACH ENTRY TRIGGER */
            <button 
              type="button"
              onClick={() => setShowMobileSearch(true)}
              className="p-2.5 bg-gray-50 hover:bg-gray-100/80 text-gray-500 rounded-xl border border-gray-100 sm:hidden transition-all focus:outline-none cursor-pointer"
            >
              <FiSearch className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* REAL-TIME NOTIFICATION SYSTEM GATE */}
          <button className="relative p-2.5 bg-gray-50 hover:bg-gray-100/80 text-gray-500 hover:text-gray-900 rounded-xl border border-gray-100 transition-all focus:outline-none cursor-pointer group">
            <FiBell className="w-4 h-4 stroke-[2.5] group-hover:scale-105 transition-transform" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-600 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>

          {/* Structural Content Divider Rule */}
          <div className="h-6 w-px bg-gray-200/70 hidden xs:block" />

          {/* ADMINISTRATIVE IDENTITY BLOCK WITH INTERACTIVE OVERLAY */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 pl-1 shrink-0 focus:outline-none group cursor-pointer text-left select-none"
            >
              {/* Identity Avatar Capsule */}
              <div className="relative w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-700 font-black shrink-0 shadow-2xs group-hover:bg-green-100/60 transition-colors">
                <FiUser className="w-4 h-4 stroke-[2.5]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              
              {/* Profile Context Text Metadata */}
              <div className="hidden md:block">
                <h4 className="text-xs font-black text-gray-800 leading-none flex items-center gap-1.5">
                  System Admin
                  <FiChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180 text-green-600' : ''}`} />
                </h4>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">Primary Session</p>
              </div>
            </button>

            {/* FLOATING DROPDOWN OPTIONS CONTEXT POP-UP */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-fadeIn origin-top-right z-40">
                
                {/* Identity Header Snapshot */}
                <div className="px-3 py-2 bg-gray-50/50 border-b border-gray-100 rounded-t-xl mb-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Signed In As</p>
                  <p className="text-xs font-bold text-gray-800 truncate mt-0.5">admin@university.edu</p>
                </div>

                {/* Dropdown Navigation Actions */}
                <button
                  type="button"
                  onClick={() => handleAction(onProfile)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-left cursor-pointer focus:outline-none group"
                >
                  <FiUser className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => {handleAction(onSettings);navigate('/admin/settings')}}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-left cursor-pointer focus:outline-none group"
                >
                  <FiSettings className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  Settings
                </button>

                {/* Destructive Action Security Divider */}
                <div className="border-t border-gray-100 my-1 pt-1" />

                <button
                  type="button"
                  onClick={() => handleAction(onLogout)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50/60 transition-all text-left cursor-pointer focus:outline-none"
                >
                  <FiLogOut className="w-3.5 h-3.5 text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;