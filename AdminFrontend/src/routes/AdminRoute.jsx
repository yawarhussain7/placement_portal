import React from 'react'
import {Routes,Route} from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
import AdminDashboard from '../pages/AdminDashboard'
import StudentDashboard from '../pages/StudentDashboard'
import AdminDocumentsDashboard from '../pages/AdminDocumentsDashboard'

const AdminRoute = () => {
  return (
    <>
    <Routes>
        <Route path='/dashboard' element={<AdminDashboard/>}/>
        <Route path='/students' element={<StudentDashboard/>}/>
        <Route path='/documents' element={<AdminDocumentsDashboard/>}/>
    </Routes>
    
    </>
  )
}

export default AdminRoute