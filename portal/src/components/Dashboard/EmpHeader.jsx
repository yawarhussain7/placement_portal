import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, User, Settings, LogOut, HelpCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { usePortalData } from '../../context/PortalDataContext';
import { logoutUser } from '../../Api/auth.js';

const profileOptions = [
  { icon: User,       label: "My Profile", to: '/profile' },
  { icon: Settings,   label: "Settings", to: '/settings' },
  { icon: HelpCircle, label: "Help & Support", to: '/help' },
  { icon: LogOut,     label: "Sign Out", danger: true },
];

const EmpHeader = () => {
  const navigate = useNavigate();
  const { data } = usePortalData();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // fall through even if API fails
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('webmantisPortalData');
    navigate('/auth/login');
  };
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);
  const notifications = [
    ...data.tasks.filter((task) => !task.done).map((task) => ({ id: `task-${task.id}`, title: 'Task Pending', desc: task.title, time: task.due, unread: task.urgent })),
    ...data.threads.filter((thread) => thread.unread).map((thread) => ({ id: `thread-${thread.id}`, title: 'Unread Message', desc: thread.subject, time: thread.time, unread: true })),
  ].slice(0, 5);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="header-surface h-16 px-6 flex items-center justify-between sticky top-0 z-40 border-b">

      <div className="flex items-center space-x-3 md:invisible">
        <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm" style={{ color: '#fff' }}>W</div>
        <span className="font-bold text-lg text-primary tracking-tight">WebMantis</span>
      </div>

      <div className="flex items-center space-x-4 ml-auto">

        {/* Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
            className="relative p-1.5 hover:bg-subtle rounded-full transition-colors cursor-pointer"
          >
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-transparent" style={{ color: '#fff' }}>
              {notifications.length}
            </span>
            <Bell size={20} className="text-secondary" />
          </button>

          {notifOpen && (
            <div className="dropdown-surface absolute right-0 mt-2 w-80 rounded-xl shadow-xl border overflow-hidden">
              <div className="px-4 py-3 border-b border-base flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">Notifications</span>
                <span className="text-xs text-accent cursor-pointer hover:underline">Mark all read</span>
              </div>
              {notifications.length === 0 && (
                <div className="px-4 py-4 text-xs text-muted">No new notifications.</div>
              )}
              {notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3 flex gap-3 hover:bg-subtle cursor-pointer transition-colors ${n.unread ? "bg-accent-subtle" : ""}`}>
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary">{n.title}</p>
                    <p className="text-xs text-muted truncate">{n.desc}</p>
                  </div>
                  <span className="text-[10px] text-muted shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
            className="flex items-center space-x-1.5 hover:bg-subtle rounded-lg px-1.5 py-1 transition-colors cursor-pointer"
          >
            <img
              src={data.account.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-base"
            />
            <ChevronDown size={14} className={`text-muted transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="dropdown-surface absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden">
              <div className="px-4 py-3 border-b border-base">
                <p className="text-xs font-semibold text-primary">{data.account.fullName}</p>
                <p className="text-xs text-muted">{data.account.email}</p>
              </div>
              {profileOptions.map(({ icon: Icon, label, danger, to }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (label === 'Sign Out') {
                      handleLogout();
                    } else if (to) {
                      navigate(to);
                    }
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-subtle transition-colors cursor-pointer ${danger ? "text-danger" : "text-secondary"}`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default EmpHeader;
