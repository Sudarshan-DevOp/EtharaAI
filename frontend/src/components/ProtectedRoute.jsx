import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const { is_authenticated } = useAuth()

  if (!is_authenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export const PublicRoute = ({ children }) => {
  const { is_authenticated } = useAuth()

  if (is_authenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
