import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AdminRoute from './routes/AdminRoute';
import { Toaster } from "react-hot-toast";
import api from './api/api.js';
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
        const res = await api.get('/profile/profile');
        const resData = res.data;
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
    <Toaster position="top-right"/>
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      <Route path="/admin/*" element={<AdminRoute/>}/>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  );
};

export default App;