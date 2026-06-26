import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AdminRoute from './routes/AdminRoute';


const App = () => {
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