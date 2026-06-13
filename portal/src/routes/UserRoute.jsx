import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const UserRoute = () => {
  return (
    <Routes>
      <Route path="/employee/*" element={
        <ProtectedRoute>
          <Navigate to="/dashboard" replace />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default UserRoute