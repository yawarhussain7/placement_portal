import React from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import Settings from '../pages/Settings'
import ProfileSection from '../components/settings/ProfileSection'
import NotificationsSection from '../components/settings/NotificationsSection'
import SecuritySection from '../components/settings/SecuritySection'
import AppearanceSection from '../components/settings/AppearanceSection'

const SettingRoute = () => {
  return (
    <Routes>
      <Route path='/' element={<Settings/>}>
        <Route index element={<Navigate to='/admin/settings/profile' replace/>}/>
        <Route path='profile' element={<ProfileSection/>}/>
        <Route path='notifications' element={<NotificationsSection/>}/>
        <Route path='security' element={<SecuritySection/>}/>
        <Route path='appearance' element={<AppearanceSection/>}/>
      </Route>
    </Routes>
  )
}

export default SettingRoute
