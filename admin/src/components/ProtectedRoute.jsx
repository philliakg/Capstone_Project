import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, authIsReady } = useAuthContext()

  if (!authIsReady) {
    return <p className="page">Loading…</p>
  }

  if (!user || user.role !== 'host') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
