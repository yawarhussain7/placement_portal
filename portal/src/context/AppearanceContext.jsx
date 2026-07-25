import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../Api/axios.js';
import { usePortalData } from './PortalDataContext';

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

  const { isAuthenticated, profileLoaded } = usePortalData();

  // Fetch theme preference from backend on startup or when auth status changes
  useEffect(() => {
    const fetchTheme = async () => {
      // Only fetch theme if user is authenticated (using cookie-based auth)
      if (!profileLoaded || !isAuthenticated) {
        // User is not logged in, use default theme
        return;
      }

      try {
        const res = await api.get('/auth/profile');
        if (res.data?.success && res.data?.data?.theme) {
          setAppearance({ theme: res.data.data.theme });
        }
      } catch (err) {
        // Don't log 401 errors as they're expected when not logged in
        if (err.response?.status !== 401) {
          console.warn('Failed to fetch theme from backend:', err.message);
        }
      }
    };

    fetchTheme();

    // Listen to auth changes to fetch the theme immediately upon login/logout
    const handleAuthChange = () => {
      fetchTheme();
    };
    window.addEventListener('auth-token-changed', handleAuthChange);
    return () => {
      window.removeEventListener('auth-token-changed', handleAuthChange);
    };
  }, [profileLoaded, isAuthenticated]);

  // Save theme and apply it locally
  useEffect(() => {
    applyAppearance(appearance);
    localStorage.setItem('appearance', JSON.stringify(appearance));

    const saveTheme = async () => {
      // Only save theme if user is authenticated (using cookie-based auth)
      if (!profileLoaded || !isAuthenticated) {
        return;
      }

      try {
        // Get user ID from the profile endpoint
        const res = await api.get('/auth/profile');
        if (res.data?.success && res.data?.data?._id) {
          const userId = res.data.data._id;
          await api.put(`/auth/profile-update/${userId}`, {
            theme: appearance.theme
          });
        }
      } catch (err) {
        // Silently fail if user is not authenticated
        if (err.response?.status !== 401) {
          console.warn('Failed to save theme to backend:', err);
        }
      }
    };

    saveTheme();
  }, [appearance, profileLoaded, isAuthenticated]);

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
