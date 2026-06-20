import React from "react";
import SidebarTab from './SlidebarTab'
import {
  LayoutDashboard, UserPlus, FileText, FolderOpen,
  MessageSquare, User, Settings, HelpCircle,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar-surface w-64 border-r hidden lg:flex flex-col justify-between p-4 sticky top-0 h-screen flex-shrink-0">
      <div className="space-y-1">
        <div className="flex items-center space-x-3 px-3 py-4 mb-4">
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm" style={{ color: '#fff' }}>
            W
          </div>
          <span className="font-bold text-xl text-primary tracking-tight">WebMantis</span>
        </div>

        <SidebarTab icon={<LayoutDashboard size={18} />} label="Dashboard"       to="/dashboard" />
        <SidebarTab icon={<UserPlus size={18} />}        label="New Placement"   to="/new-placement" />
        <SidebarTab icon={<FileText size={18} />}        label="My Applications" to="/applications" />
        <SidebarTab icon={<FolderOpen size={18} />}      label="Documents"       to="/documents" />
        <SidebarTab icon={<MessageSquare size={18} />}   label="Messages"        to="/messages" />
        <SidebarTab icon={<User size={18} />}            label="Profile"         to="/profile" />
        <SidebarTab icon={<Settings size={18} />}        label="Settings"        to="/settings" />
        <SidebarTab icon={<HelpCircle size={18} />}      label="Help Center"     to="/help" />
      </div>

      <div className="bg-accent-subtle rounded-xl p-4 border border-base text-center mt-auto">
        <HelpCircle size={22} className="mx-auto text-accent mb-1.5" />
        <h4 className="text-xs font-bold text-primary">Need Help?</h4>
        <p className="text-[11px] text-muted mt-0.5">Contact our team</p>
      </div>
    </aside>
  );
}