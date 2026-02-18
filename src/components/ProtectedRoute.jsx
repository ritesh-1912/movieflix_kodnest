import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  
  if (user === undefined) {
    return (
      <div className="h-screen bg-netflix-black flex flex-col items-center justify-center gap-6">
        <span className="text-netflix-red text-3xl font-display font-bold tracking-tight">MOVIEFLIX</span>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-800 border-t-netflix-red" />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default ProtectedRoute
