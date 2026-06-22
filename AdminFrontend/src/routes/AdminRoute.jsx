import React from 'react'
import {Routes,Route} from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
import AdminDashboard from '../pages/AdminDashboard'
import StudentsData from '../pages/StudentsData'
import AdminDocumentsDashboard from '../pages/AdminDocumentsDashboard'
import Applications from '../pages/Applications'
import Settings from '../pages/Settings'
import PlacementData from '../pages/PlacementData'

const AdminRoute = () => {
  return (
    <>
    <Routes>
        <Route path='/dashboard' element={<AdminDashboard/>}/>
        <Route path='/students' element={<StudentsData/>}/>
        <Route path='/documents' element={<AdminDocumentsDashboard/>}/>
        <Route path='/applications' element={<Applications/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/placement' element={<PlacementData/>}/>
        
    </Routes>
    
    </>
  )
}

export default AdminRoute