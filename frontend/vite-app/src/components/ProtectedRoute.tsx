import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Wraps a route and redirects to /login if no JWT token is found in localStorage.
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute
