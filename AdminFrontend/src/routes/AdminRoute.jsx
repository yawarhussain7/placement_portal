import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import StudentsData from '../pages/StudentsData'
import AdminDocumentsDashboard from '../pages/AdminDocumentsDashboard'
import Applications from '../pages/Applications'
import SettingRoute from './SettingRoute'

import PlacementData from '../pages/PlacementData'
import Report from '../pages/Report'

const AdminRoute = () => {
  const token = localStorage.getItem('auth_token')

  if (!token) {
    return <Navigate to="/signIn" replace />
  }

  return (
    <Routes>
        <Route path='/dashboard' element={<AdminDashboard/>}/>
        <Route path='/students' element={<StudentsData/>}/>
        <Route path='/documents' element={<AdminDocumentsDashboard/>}/>
        <Route path='/applications' element={<Applications/>}/>
        <Route path='/settings/*' element={<SettingRoute/>}/>
        <Route path='/placement' element={<PlacementData/>}/>
        <Route path='/reports' element={<Report/>}/>
    </Routes>
  )
}

export default AdminRoute