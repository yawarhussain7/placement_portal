import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  User, Bell, Shield, Paintbrush, Save, LogOut,
  Eye, EyeOff, Trash2, Monitor, Sun, Moon,
  Smartphone, Mail, MessageSquare, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppearance } from '../../context/AppearanceContext';
import { logoutUser } from '../../Api/auth.js';

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${checked ? 'bg-accent' : 'bg-muted'}`}
  >
    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);



const Section = ({ title, subtitle, children }) => (
  <div className="p-6 space-y-5 border-b border-base last:border-0">
    <div>
      <h2 className="text-base font-semibold text-primary">{title}</h2>
      {subtitle && <p className="text-muted text-xs mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const PasswordField = ({ label, required, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full">
      <label className="block text-primary font-semibold mb-2">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className="input-base w-full border rounded-xl px-4 py-3 pr-11 transition-colors"
          {...props}
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, required, type = 'text', ...props }) => (
  <div className="w-full">
    <label className="block text-primary font-semibold mb-2">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <input
      type={type}
      className="input-base w-full border rounded-xl px-4 py-3 transition-colors"
      {...props}
    />
  </div>
);

const strengthLabel = pwd => {
  if (!pwd) return null;
  const s = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter(r => r.test(pwd)).length + (pwd.length >= 8 ? 1 : 0);
  if (s <= 2) return { label: 'Weak',   color: 'bg-red-500',    w: 'w-1/4' };
  if (s === 3) return { label: 'Fair',   color: 'bg-yellow-400', w: 'w-2/4' };
  if (s === 4) return { label: 'Good',   color: 'bg-blue-500',   w: 'w-3/4' };
  return              { label: 'Strong', color: 'bg-emerald-500',w: 'w-full' };
};

const Setting = () => {
  const navigate = useNavigate();
  const { logout } = usePortalData();
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    fullName: 'Jane Doe', email: 'jane.doe@example.com', phone: '+1 555 000 0000', bio: ''
  });

  const [notif, setNotif] = useState({
    emailApplications: true,  emailMessages: true,  emailUpdates: false,
    pushApplications: true,   pushMessages: false,   pushUpdates: false,
    smsApplications: false,   smsMessages: false,
  });

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [sessions, setSessions]   = useState([
    { device: 'Chrome · Windows', location: 'Karachi, PK',  time: 'Active now',  current: true  },
    { device: 'Safari · iPhone',  location: 'Lahore, PK',   time: '2 hours ago', current: false },
    { device: 'Firefox · macOS',  location: 'Dubai, AE',    time: '3 days ago',  current: false },
  ]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  const { appearance, setAppearance } = useAppearance();

  const SaveFooter = ({ onCancel }) => (
    <div className="px-6 py-4 bg-subtle flex items-center justify-end gap-3 border-t border-base">
      <button type="button" onClick={onCancel ?? (() => toast.error('No changes made.'))}
        className="px-4 py-2 border border-base text-secondary font-medium rounded-lg hover:bg-surface transition-colors text-sm">
        Cancel
      </button>
      <button type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover shadow-sm transition-colors text-sm">
        <Save size={15} /> Save Changes
      </button>
    </div>
  );

  const navItems = [
    { id: 'profile',       label: 'Public Profile',    icon: User      },
    { id: 'notifications', label: 'Notifications',     icon: Bell      },
    { id: 'security',      label: 'Security & Privacy',icon: Shield    },
    { id: 'appearance',    label: 'Appearance',        icon: Paintbrush},
  ];

  const strength = strengthLabel(passwords.next);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 text-sm">

      <div className="flex flex-col md:flex-row gap-6">

        {/* sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="card space-y-1 p-3 rounded-xl border shadow-sm">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors
                    ${active ? 'bg-accent-subtle text-accent' : 'text-secondary hover:bg-subtle hover:text-primary'}`}>
                  <Icon size={17} className={active ? 'text-accent' : 'text-muted'} />
                  {label}
                </button>
              );
            })}
            <hr className="my-2 border-base" />
            <button 
              onClick={async () => {
                try {
                  await logoutUser();
                } catch {
                  // fall through even if API fails
                }
                // Backend clears the httpOnly cookie, just clear cached data
                localStorage.removeItem('webmantisPortalData');
                logout();
                toast.success('Logged out successfully. See you soon!');
                setTimeout(() => navigate('/auth/login'), 500);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-danger hover:bg-danger-subtle transition-colors">
              <LogOut size={17} className="text-danger" /> Log Out
            </button>
          </nav>
        </aside>

        {/* main */}
        <main className="card flex-1 rounded-xl border shadow-sm overflow-hidden">

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <form onSubmit={e => { e.preventDefault(); toast.success('Profile updated successfully.'); }}>
              <Section title="Profile Information" subtitle="Update your primary account contact details.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Full Name" required placeholder="Jane Doe"
                    value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} />
                  <InputField label="Email Address" required type="email" placeholder="name@example.com"
                    value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                  <InputField label="Phone Number" type="tel" placeholder="+1 555 000 0000"
                    value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </Section>
              <Section title="Bio" subtitle="A short description visible on your public profile.">
                <textarea rows={3} placeholder="Write something about yourself…"
                  value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  className="input-base w-full border rounded-xl px-4 py-3 resize-none transition-colors" />
              </Section>
              <SaveFooter />
            </form>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === 'notifications' && (
            <form onSubmit={e => { e.preventDefault(); toast.success('Notification preferences saved.'); }}>
              {[
                { key: 'email', Icon: Mail,        label: 'Email Notifications',  desc: 'Sent to your registered email address.' },
                { key: 'push',  Icon: Monitor,     label: 'Push Notifications',   desc: 'Browser / desktop push alerts.'          },
                { key: 'sms',   Icon: Smartphone,  label: 'SMS Notifications',    desc: 'Sent to your registered phone number.'   },
              ].map(({ key, Icon, label, desc }) => (
                <Section key={key} title={label} subtitle={desc}>
                  <div className="space-y-3">
                    {[
                      { field: `${key}Applications`, label: 'Application status updates'      },
                      { field: `${key}Messages`,     label: 'New messages from advisors'       },
                      ...(key !== 'sms' ? [{ field: `${key}Updates`, label: 'Platform news & announcements' }] : []),
                    ].map(({ field, label: lbl }) => (
                      <div key={field} className="flex items-center justify-between">
                        <span className="text-secondary">{lbl}</span>
                        <Toggle checked={!!notif[field]} onChange={v => setNotif(n => ({ ...n, [field]: v }))} />
                      </div>
                    ))}
                  </div>
                </Section>
              ))}
              <SaveFooter />
            </form>
          )}

          {/* ── SECURITY ── */}
          {activeTab === 'security' && (
            <div>
              <form onSubmit={e => {
                e.preventDefault();
                if (!passwords.current) return toast.error('Enter your current password.');
                if (passwords.next.length < 8) return toast.error('New password must be at least 8 characters.');
                if (passwords.next !== passwords.confirm) return toast.error('Passwords do not match.');
                setPasswords({ current: '', next: '', confirm: '' });
                toast.success('Password changed successfully.');
              }}>
                <Section title="Change Password" subtitle="Use a strong password you don't use elsewhere.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <PasswordField label="Current Password" required placeholder="••••••••"
                      value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
                    <div className="space-y-2">
                      <PasswordField label="New Password" required placeholder="Min. 8 characters"
                        value={passwords.next} onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))} />
                      {strength && (
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${strength.color} ${strength.w}`} />
                          </div>
                          <p className="text-xs text-muted">Strength: <span className="font-medium text-secondary">{strength.label}</span></p>
                        </div>
                      )}
                    </div>
                    <PasswordField label="Confirm New Password" required placeholder="Repeat new password"
                      value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                  </div>
                </Section>
                <SaveFooter />
              </form>

              <Section title="Active Sessions" subtitle="Devices currently signed into your account.">
                <div className="space-y-3">
                  {sessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-base bg-subtle">
                      <div>
                        <p className="font-medium text-primary">{s.device}
                          {s.current && <span className="ml-2 text-xs bg-accent-subtle text-accent px-2 py-0.5 rounded-full">This device</span>}
                        </p>
                        <p className="text-xs text-muted mt-0.5">{s.location} · {s.time}</p>
                      </div>
                      {!s.current && (
                        <button type="button"
                          onClick={() => { setSessions(prev => prev.filter((_, idx) => idx !== i)); toast.success('Session revoked.'); }}
                          className="text-xs text-danger hover:underline font-medium">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account.">
                <div className="flex items-center justify-between p-4 rounded-xl border border-base bg-subtle">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-muted" />
                    <div>
                      <p className="font-medium text-primary">Authenticator App</p>
                      <p className="text-xs text-muted">Use Google Authenticator or similar.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => toast.info('2FA setup coming soon.')}
                    className="px-4 py-1.5 text-xs font-semibold border border-accent text-accent rounded-lg hover:bg-accent-subtle transition-colors">
                    Enable
                  </button>
                </div>
              </Section>

              <Section title="Delete Account" subtitle="Permanently remove your account and all associated data.">
                {!showDeleteConfirm ? (
                  <button type="button" onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-danger-subtle text-danger border border-danger font-medium rounded-lg hover:opacity-80 transition-colors text-sm">
                    <Trash2 size={15} /> Delete My Account
                  </button>
                ) : (
                  <div className="space-y-3 p-4 rounded-xl border border-danger bg-danger-subtle">
                    <p className="text-danger font-medium">This action is irreversible. Type <span className="font-bold">DELETE</span> to confirm.</p>
                    <input value={deleteText} onChange={e => setDeleteText(e.target.value)}
                      placeholder="Type DELETE"
                      className="input-base w-full max-w-xs border rounded-lg px-3 py-2 text-sm" />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }}
                        className="px-4 py-2 text-sm border border-base text-secondary rounded-lg hover:bg-surface transition-colors">Cancel</button>
                      <button type="button" disabled={deleteText !== 'DELETE'}
                        onClick={() => toast.error('Account deletion requested.')}
                        className="px-4 py-2 text-sm bg-danger text-white rounded-lg hover:opacity-80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                )}
              </Section>
            </div>
          )}

          {/* ── APPEARANCE ── */}
          {activeTab === 'appearance' && (
            <div>
              <Section title="Theme" subtitle="Changes apply instantly across the portal.">
                <div className="flex gap-3 flex-wrap">
                  {[
                    { value: 'light',  Icon: Sun,     label: 'Light'  },
                    { value: 'dark',   Icon: Moon,    label: 'Dark'   },
                    { value: 'system', Icon: Monitor, label: 'System' },
                  ].map(({ value, Icon, label }) => (
                    <button key={value} type="button" onClick={() => setAppearance(a => ({ ...a, theme: value }))}
                      className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-colors font-medium text-sm
                        ${appearance.theme === value
                          ? 'border-accent bg-accent-subtle text-accent'
                          : 'border-base text-secondary hover:bg-subtle'}`}>
                      <Icon size={20} />
                      {label}
                    </button>
                  ))}
                </div>
              </Section>

              <div className="px-6 py-4 bg-subtle border-t border-base flex items-center justify-between">
                <p className="text-xs text-muted">Changes are applied and saved automatically.</p>
                <button type="button"
                  onClick={() => { setAppearance({ theme: 'light' }); toast.success('Appearance reset to defaults.'); }}
                  className="px-4 py-2 border border-base text-secondary font-medium rounded-lg hover:bg-surface transition-colors text-sm">
                  Reset to Defaults
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Setting;
