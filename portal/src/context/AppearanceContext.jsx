import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../Api/axios.js';

const AppearanceContext = createContext(null);

function applyAppearance({ theme }) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

export function AppearanceProvider({ children }) {
  const [appearance, setAppearance] = useState(() => {
    try {
      const saved = localStorage.getItem('appearance');
      return saved ? JSON.parse(saved) : { theme: 'light' };
    } catch {
      return { theme: 'light' };
    }
  });

  // Fetch theme preference from backend on startup or when auth token changes
  useEffect(() => {
    const fetchTheme = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      try {
        const res = await api.get('/profile/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data?.success && res.data?.data?.theme) {
          setAppearance({ theme: res.data.data.theme });
        }
      } catch (err) {
        console.warn('Failed to fetch theme from backend:', err);
      }
    };

    fetchTheme();

    // Listen to token changes to fetch the theme immediately upon login
    const handleAuthChange = () => {
      fetchTheme();
    };
    window.addEventListener('auth-token-changed', handleAuthChange);
    return () => {
      window.removeEventListener('auth-token-changed', handleAuthChange);
    };
  }, []);

  // Save theme and apply it locally
  useEffect(() => {
    applyAppearance(appearance);
    localStorage.setItem('appearance', JSON.stringify(appearance));

    const saveTheme = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        if (userId) {
          await api.put(`/profile/profile-update/${userId}`, {
            theme: appearance.theme
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      } catch (err) {
        console.warn('Failed to save theme to backend:', err);
      }
    };

    saveTheme();
  }, [appearance]);

  // re-apply when system color scheme changes
  useEffect(() => {
    if (appearance.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyAppearance(appearance);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [appearance]);

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export const useAppearance = () => useContext(AppearanceContext);
