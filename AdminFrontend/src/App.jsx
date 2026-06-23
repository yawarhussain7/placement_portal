import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AdminRoute from './routes/AdminRoute';


const App = () => {
  return (
    <>
    <Routes>
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />

      <Route path="/admin/*" element={<AdminRoute/>}/>
    </Routes>
    </>
  );
};

export default App;