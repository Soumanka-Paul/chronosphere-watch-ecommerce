
import { createContext, useContext, useEffect, useState } from 'react'
import axiosInstance from '../utils/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  // ─────────────────────────────────────────
  // CHECK AUTHENTICATION
  // Runs once when the application loads
  // ─────────────────────────────────────────

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const token = localStorage.getItem('token')

        // No token → user is not logged in
        if (!token) {
          setUser(null)
          return
        }

        // Token exists → ask backend who the user is
        const res = await axiosInstance.get('/auth/me')

        setUser(res.data.user)

      } catch (error) {

        // Invalid / expired token
        localStorage.removeItem('token')
        setUser(null)

      } finally {

        setLoading(false)

      }
    }

    checkAuth()

  }, [])


  // ─────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────

  const login = (userData) => {
    setUser(userData)
  }


  // ─────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────

  const logout = async () => {

    try {

      await axiosInstance.post('/auth/logout')

    } catch (error) {

      console.error('Logout error:', error)

    } finally {

      // Remove JWT token
      localStorage.removeItem('token')

      // Remove user from AuthContext
      setUser(null)

    }
  }


  // ─────────────────────────────────────────
  // AUTH STATUS
  // ─────────────────────────────────────────

  const isLoggedIn = !!user

  const isAdmin = user?.role === 'admin'


  // ─────────────────────────────────────────
  // PROVIDER
  // ─────────────────────────────────────────

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isLoggedIn,
        isAdmin,
      }}
    >

      {loading ? (

        <div className="min-h-screen flex items-center justify-center">

          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />

        </div>

      ) : (

        children

      )}

    </AuthContext.Provider>

  )
}


export const useAuth = () => useContext(AuthContext)

