import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('auth_token'))
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  return children
}

export default ProtectedRoute