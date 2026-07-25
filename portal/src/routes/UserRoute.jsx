import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

const UserRoute = () => {
  return (
    <Routes>
      <Route path="/employee/*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default UserRoute
