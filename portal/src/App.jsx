import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/auth/AuthPage'
import Dashboard from './pages/Dashoard/Dashboard'
import PersonalDetailsPage from './pages/new_placement/PersonalDetailsPage'
import PlacementPerformancePage from './pages/new_placement/placement_performancePage/Placement_Performance'
import Documents from './pages/new_placement/document/Documents'
import ReportS from './pages/reports/ReportS'
import Profile from './pages/User/Profile'
import Course from './pages/new_placement/course/Course'
import { SettingPage } from './pages/User/SettingPage'
import Applications from './pages/User/Applications'
import UserDocuments from './pages/User/Documents'
import Messages from './pages/User/Messages'
import HelpCenter from './pages/User/HelpCenter'

const App = () => (
  <Routes>
    <Route path='/' element={<Navigate to='/dashboard' replace />} />
    <Route path='/dashboard' element={<Dashboard />} />

    <Route path='/new-placement' element={<Navigate to='/new-placement/personal-details' replace />} />
    <Route path='/new-placement/personal-details' element={<PersonalDetailsPage />} />
    <Route path='/new-placement/course-details' element={<Course/>} />
    <Route path='/new-placement/placement-preference' element={<PlacementPerformancePage />} />
    <Route path='/new-placement/documents' element={<Documents />} />
    <Route path='/new-placement/report-submit' element={<ReportS />} />

    <Route path='/applications' element={<Applications />} />
    <Route path='/documents' element={<UserDocuments />} />
    <Route path='/messages' element={<Messages />} />
    <Route path='/profile' element={<Profile />} />
    <Route path='/settings' element={<SettingPage/>} />
    <Route path='/help' element={<HelpCenter />} />
    <Route path='/auth/login' element={<AuthPage url='/login' />} />
    <Route path='/auth/register' element={<AuthPage url='/register' />} />
    <Route path='*' element={<Navigate to='/dashboard' replace />} />
  </Routes>
)

export default App
