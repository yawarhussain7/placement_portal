import React, { useState, useEffect } from 'react';
import { FiLayout, FiCheck, FiCheckCircle } from 'react-icons/fi';
import SettingsCardLayout from '../../layout/SettingsCardLayout';

const AppearanceSection = () => {
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('green'); // Defaulting to your premium green preference
  const [sidebarLayout, setSidebarLayout] = useState('expanded');

  // Fetch current theme preference from backend on mount
  useEffect(() => {
    const fetchTheme = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:2000/profile/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await res.json();
        if (resData.success && resData.data?.theme) {
          setTheme(resData.data.theme);
        }
      } catch (err) {
        console.warn('Failed to load theme preference:', err);
      }
    };
    fetchTheme();
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = newTheme === 'dark' || (newTheme === 'system' && prefersDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  };

  const handleApplyTheme = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      if (userId) {
        const res = await fetch(`http://localhost:2000/profile/profile-update/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ theme })
        });
        const resData = await res.json();
        if (resData.success) {
          // Instantly apply the theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
          document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
          alert('Appearance settings successfully applied and persisted!');
        }
      }
    } catch (err) {
      console.error('Failed to update theme:', err);
      alert('Failed to save appearance settings.');
    }
  };

  const themes = [
    { 
      id: 'light', 
      label: 'Light Mode', 
      desc: 'Clean, high-contrast look',
      previewBg: 'bg-gray-100',
      previewCard: 'bg-white border-gray-200'
    },
    { 
      id: 'dark', 
      label: 'Dark Premium', 
      desc: 'Sleek, low-light aesthetic',
      previewBg: 'bg-slate-950',
      previewCard: 'bg-slate-900 border-slate-800'
    },
    { 
      id: 'system', 
      label: 'Device System', 
      desc: 'Syncs with system choices',
      previewBg: 'bg-gradient-to-br from-gray-100 to-slate-950',
      previewCard: 'bg-white/80 dark:bg-slate-900/80 border-gray-200 dark:border-slate-800'
    }
  ];

  const accents = [
    { id: 'green', bg: 'bg-[#A855F7]', border: 'border-green-300', label: 'Premium green' },
    { id: 'emerald', bg: 'bg-[#22C55E]', border: 'border-emerald-300', label: 'Emerald' },
    { id: 'blue', bg: 'bg-[#3B82F6]', border: 'border-blue-300', label: 'Ocean Blue' },
  ];

  return (
    <SettingsCardLayout
      title="Appearance Settings"
      description="Customize your admin control panel interface theme, accent brandings, and navigation layout styles"
    >
      <div className="space-y-6">
        
        {/* Theme Grid Selection with Mini Visual Previews */}
        <div className="space-y-3">
          <label className="font-extrabold text-gray-400 text-[10px] uppercase tracking-wider">
            Interface Theme
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                className={`group p-2.5 rounded-xl border text-left transition-all focus:outline-none flex flex-col space-y-3 relative ${
                  theme === t.id
                    ? 'border-green-600 bg-green-50/10 ring-1 ring-green-600/30'
                    : 'border-gray-200 bg-white hover:bg-gray-50/80 hover:border-gray-300'
                }`}
              >
                {/* Simulated Mini Viewport Preview */}
                <div className={`w-full h-16 rounded-lg ${t.previewBg} p-2 flex gap-1.5 items-start overflow-hidden transition-all relative`}>
                  <div className="w-3.5 h-full rounded bg-gray-300/30 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="w-1/2 h-2 rounded-sm bg-gray-300/40" />
                    <div className={`w-full h-8 rounded-md border ${t.previewCard} shadow-2xs`} />
                  </div>
                  
                  {theme === t.id && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-600 flex items-center justify-center shadow-xs">
                      <FiCheck className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="px-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-gray-900">{t.label}</div>
                  <div className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modular Accent Color Picker */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <label className="font-extrabold text-gray-400 text-[10px] uppercase tracking-wider">
            Accent Brand Highlights
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {accents.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setAccentColor(acc.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left focus:outline-none ${
                  accentColor === acc.id 
                    ? 'border-gray-900 bg-gray-50 shadow-xs' 
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg ${acc.bg} flex items-center justify-center text-white shrink-0`}>
                  {accentColor === acc.id && <FiCheck className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <div className={`text-xs font-bold ${accentColor === acc.id ? 'text-gray-900' : 'text-gray-700'}`}>
                    {acc.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Expansion Setup Layout Toggle */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <label className="font-extrabold text-gray-400 text-[10px] uppercase tracking-wider">
            Navigation Drawer Mode
          </label>
          <div className="flex gap-4 p-3 bg-gray-50/50 rounded-xl border border-gray-100 items-center justify-between">
            <div className="flex items-start gap-2.5">
              <FiLayout className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-gray-800">Compact Navigation Sidebar</h5>
                <p className="text-[10px] text-gray-400 font-medium">Collapse left panel link items into iconic layouts</p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setSidebarLayout(sidebarLayout === 'expanded' ? 'compact' : 'expanded')}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                sidebarLayout === 'compact' ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform duration-200 ease-in-out ${
                sidebarLayout === 'compact' ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

      </div>

      {/* Control Save Action Buttons */}
      <div className="flex justify-end pt-3 border-t border-gray-100">
        <button 
          onClick={handleApplyTheme}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-green-600/10 focus:outline-none cursor-pointer"
        >
          <FiCheckCircle className="w-3.5 h-3.5" />
          Apply Visual System
        </button>
      </div>
    </SettingsCardLayout>
  );
};

export default AppearanceSection;