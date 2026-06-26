import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AdminRoute from './routes/AdminRoute';

const App = () => {
  useEffect(() => {
    const applyTheme = (theme) => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    const syncTheme = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        applyTheme('light');
        return;
      }
      try {
        const res = await fetch('http://localhost:2000/profile/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await res.json();
        if (resData.success && resData.data?.theme) {
          applyTheme(resData.data.theme);
        } else {
          applyTheme('light');
        }
      } catch (err) {
        console.warn('Failed to sync theme:', err);
      }
    };

    syncTheme();

    // Sync theme whenever window gains focus (e.g. user toggled settings in another tab)
    window.addEventListener('focus', syncTheme);
    return () => {
      window.removeEventListener('focus', syncTheme);
    };
  }, []);

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />

      <Route path="/admin/*" element={<AdminRoute/>}/>
      <Route path="*" element={<Navigate to="/signIn" replace />} />
    </Routes>
    </>
  );
};

export default App;