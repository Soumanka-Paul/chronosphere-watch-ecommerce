
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth()
  const location = useLocation()

  // Auth check চলাকালীন loading দেখাবে
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  // Login না করা থাকলে Login page-এ পাঠাবে
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  // Login করা থাকলে requested page দেখাবে
  return <Outlet />
}

