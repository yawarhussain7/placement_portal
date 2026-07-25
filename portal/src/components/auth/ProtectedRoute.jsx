import { Navigate } from 'react-router-dom'
import { usePortalData } from '../../context/PortalDataContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, profileLoaded } = usePortalData()

  // Show nothing while checking authentication status
  if (!profileLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}

export default ProtectedRoute