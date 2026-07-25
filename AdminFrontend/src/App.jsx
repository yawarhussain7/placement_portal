import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ModernSignIn from "./pages/auth/ModernSignIn";
import AdminRoute from "./routes/AdminRoute";
import { Toaster } from "react-hot-toast";
import api from "./api/api.js";
const App = () => {
  useEffect(() => {
    const applyTheme = (theme) => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    // Apply default theme for admin
    applyTheme('light');
  }, []);

  return (
    <>
    <Toaster position="top-right"/>
    <Routes>
      <Route path="/" element={<Navigate to="/auth/admin-login" replace />} />
      <Route path="/auth/admin-login" element={<ModernSignIn />} />

      <Route path="/admin/*" element={<AdminRoute />} />

      <Route path="*" element={<Navigate to="/auth/admin-login" replace />} />
    </Routes>
    </>
  );
};

export default App;