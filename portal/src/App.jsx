import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashoard/Dashboard'
import { SettingPage } from './pages/User/SettingPage'
import Applications from './pages/User/Applications'
import AllApplications from './pages/User/AllApplications'
import UserDocuments from './pages/User/Documents'
import Messages from './pages/User/Messages'
import HelpCenter from './pages/User/HelpCenter'
import Profile from './pages/User/Profile'
import Placement_Route from './routes/Placement_Route'
import AuthPage from './pages/auth/AuthPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/auth/login' replace />} />

      <Route path='/auth/login' element={<AuthPage key="login" />} />
      <Route path='/auth/register' element={<AuthPage key="register" />} />

      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path='/new-placement/*' element={
        <ProtectedRoute>
          <Placement_Route />
        </ProtectedRoute>
      } />

      <Route path='/applications' element={
        <ProtectedRoute>
          <Applications />
        </ProtectedRoute>
      } />

      <Route path='/applications/all' element={
        <ProtectedRoute>
          <AllApplications />
        </ProtectedRoute>
      } />

      <Route path='/documents' element={
        <ProtectedRoute>
          <UserDocuments />
        </ProtectedRoute>
      } />

      <Route path='/messages' element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />

      <Route path='/profile' element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path='/settings' element={
        <ProtectedRoute>
          <SettingPage />
        </ProtectedRoute>
      } />

      <Route path='/help' element={
        <ProtectedRoute>
          <HelpCenter />
        </ProtectedRoute>
      } />

      <Route path='*' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  )
}

export default App