import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, User, Settings, LogOut, HelpCircle, Search, Plus, Calendar, Briefcase } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { usePortalData } from '../../context/PortalDataContext';
import { logoutUser } from '../../Api/auth.js';
import Placement_Route from '../../routes/Placement_Route.jsx';

const EmpHeader = () => {
  const navigate = useNavigate();
  const { data, logout } = usePortalData();

  const handleLogout = async () => {
    try {
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
    { icon: LogOut, label: "Sign Out", danger: true, action: handleLogout },
  ];

const handleNewPlacement =()=>{
 
  navigate('/new-placement/personal-details')
}

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const notifications = [
    ...data.tasks.filter((task) => !task.done).map((task) => ({ id: `task-${task.id}`, title: 'Task Pending', desc: task.title, time: task.due, unread: task.urgent })),
    ...data.threads.filter((thread) => thread.unread).map((thread) => ({ id: `thread-${thread.id}`, title: 'Unread Message', desc: thread.subject, time: thread.time, unread: true })),
  ].slice(0, 5);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);




  const nextInterview = data.applications.find(a => a.status === "Interview Scheduled");

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md shadow-pro-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

        {/* Logo - Hidden on desktop, visible on mobile */}
        <div className="flex items-center space-x-3 lg:hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-hover rounded-lg flex items-center justify-center font-bold text-white shadow-pro-sm">
            W
          </div>
          <span className="font-bold text-lg text-primary tracking-tight">WebMantis</span>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted outline-none border-none" size={18} />
            <input
              type="text"
              placeholder="Search applications, documents, messages..."
              className="border-1px-gray outline-none border-none w-full pl-10 pr-4 py-2 bg-subtle  border-base rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Next Interview Badge */}
          {nextInterview && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-accent-subtle rounded-lg shadow-pro-sm">
              <Calendar size={16} className="text-accent" />
              <div className="flex flex-col">
                <span className="text-[10px] text-accent-text font-medium">Next Interview</span>
                <span className="text-xs text-primary font-semibold">{nextInterview.date}</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <button onClick={handleNewPlacement} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-medium transition-all shadow-pro-sm hover:shadow-pro-md bg-green-500">
            <Plus size={16} />
            New Application
          </button>

          {/* Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
              className="relative p-2 hover:bg-subtle rounded-xl transition-all duration-200 cursor-pointer group"
            >
              <Bell size={20} className="text-secondary group-hover:text-primary transition-colors" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-surface" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-2xl shadow-pro-xl overflow-hidden animate-in fade-in z-50">
                <div className="px-4 py-3 flex items-center justify-between bg-subtle/50">
                  <span className="text-sm font-bold text-primary">Notifications</span>
                  <span className="text-xs text-accent cursor-pointer hover:text-accent-hover font-medium">Mark all read</span>
                </div>
                {notifications.length === 0 && (
                  <div className="px-4 py-8 text-xs text-muted text-center">No new notifications</div>
                )}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 flex gap-3 hover:bg-subtle cursor-pointer transition-colors ${n.unread ? "bg-accent-subtle/50" : ""}`}>
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-accent shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary">{n.title}</p>
                        <p className="text-xs text-secondary truncate">{n.desc}</p>
                      </div>
                      <span className="text-[10px] text-muted shrink-0">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
              className="flex items-center space-x-2 hover:bg-subtle rounded-xl px-2 py-1.5 transition-all duration-200 cursor-pointer"
            >
              <img
                src={data.account.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-primary leading-tight">{data.account.fullName.split(' ')[0]}</p>
                <p className="text-[10px] text-secondary leading-tight">Student</p>
              </div>
              <ChevronDown size={14} className={`text-muted transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl shadow-pro-xl overflow-hidden animate-in fade-in z-50">
                <div className="px-4 py-3 bg-subtle/50">
                  <p className="text-sm font-bold text-primary">{data.account.fullName}</p>
                  <p className="text-xs text-secondary mt-0.5">{data.account.email}</p>
                </div>
                <div className="py-2">
                  {profileOptions.map(({ icon: Icon, label, danger, to, action }) => (
                    <button
                      key={label}
                      onClick={() => {
                        if (action) {
                          action();
                        } else if (to) {
                          navigate(to);
                        }
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-subtle transition-colors cursor-pointer ${danger ? "text-danger hover:text-danger" : "text-secondary hover:text-primary"}`}
                    >
                      <Icon size={16} />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default EmpHeader;
