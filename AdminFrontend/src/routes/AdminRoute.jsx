import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import StudentsData from '../pages/StudentsData'
import AdminDocumentsDashboard from '../pages/AdminDocumentsDashboard'
import Applications from '../pages/Applications'
import PlacementsData from '../pages/PlacementsData'
import PlacementData from '../pages/PlacementData'
import SettingRoute from './SettingRoute'
import { verifyAdmin } from '../api/auth.js'
import Report from '../pages/Report'
import Messages from '../pages/Messages'

const AdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
       
        const response = await verifyAdmin()
        
        if (response.data.success && response.data.data.role === 'admin') {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/admin-login" replace />
  }

  return (
    <Routes>
        <Route path='/' element={<Navigate to="/admin/dashboard" replace />} />
        <Route path='/dashboard' element={<AdminDashboard/>}/>
        <Route path='/students' element={<StudentsData/>}/>
        <Route path='/placements' element={<PlacementsData/>}/>
        <Route path='/placement/:id' element={<PlacementData/>}/>
        <Route path='/documents' element={<AdminDocumentsDashboard/>}/>
        <Route path='/applications' element={<Applications/>}/>
        <Route path='/settings/*' element={<SettingRoute/>}/>
        <Route path='/reports' element={<Report/>}/>
        <Route path='/messages' element={<Messages/>}/>
    </Routes>
  )
}

export default AdminRoute