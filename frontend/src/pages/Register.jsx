
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Clock,
  User,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axios'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirm) {
      toast.error('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
      })

      // Save JWT token after successful registration
      localStorage.setItem('token', res.data.token)

      // Update AuthContext
      login(res.data.user)

      toast.success(
        `Welcome to ChronoSphere, ${res.data.user.name}!`
      )

      navigate('/')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Registration failed'

      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/40 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Glow */}

      <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute top-1/4 right-[8%] w-3 h-3 bg-amber-300 rounded-full animate-ping" />

      <div className="absolute bottom-1/4 left-[8%] w-2 h-2 bg-purple-300 rounded-full animate-ping" />


      {/* Main Card */}

      <div className="relative w-full max-w-md">

        <div className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-2xl shadow-gray-200/60 border border-white p-6 sm:p-8 animate-[fadeIn_0.6s_ease-out]">

          {/* Logo */}

          <div className="flex flex-col items-center mb-7">

            <div className="relative">

              <div className="absolute inset-0 bg-amber-300/30 rounded-full blur-xl animate-pulse" />

              <div className="relative w-14 h-14 bg-gradient-to-br from-gray-950 to-gray-700 rounded-full flex items-center justify-center shadow-lg">

                <Clock className="h-6 w-6 text-white" />

              </div>

            </div>


            <div className="flex items-center gap-1.5 mt-5">

              <Sparkles className="h-3.5 w-3.5 text-amber-500" />

              <p className="text-[9px] uppercase tracking-[0.25em] text-amber-600 font-semibold">
                Join ChronoSphere
              </p>

              <Sparkles className="h-3.5 w-3.5 text-amber-500" />

            </div>


            <h1
              className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Create Account
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Begin your journey into timeless luxury.
            </p>

          </div>


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >

            {/* Name */}

            <div className="group">

              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">
                Full Name
              </label>

              <div className="relative mt-1.5">

                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-amber-600 transition-colors duration-300" />

                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100/60 transition-all duration-300"
                />

              </div>

            </div>


            {/* Email */}

            <div className="group">

              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">
                Email
              </label>

              <div className="relative mt-1.5">

                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-amber-600 transition-colors duration-300" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100/60 transition-all duration-300"
                />

              </div>

            </div>


            {/* Password */}

            <div className="group">

              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">
                Password
              </label>

              <div className="relative mt-1.5">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-amber-600 transition-colors duration-300" />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full pl-11 pr-11 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100/60 transition-all duration-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

            </div>


            {/* Confirm Password */}

            <div className="group">

              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">
                Confirm Password
              </label>

              <div className="relative mt-1.5">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-amber-600 transition-colors duration-300" />

                <input
                  type={
                    showConfirm
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) =>
                    setConfirm(e.target.value)
                  }
                  className={`w-full pl-11 pr-11 py-3 bg-gray-50/80 border rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 ${
                    confirm &&
                    password !== confirm
                      ? 'border-red-300 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100/60'
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label={
                    showConfirm
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>


              {/* Password mismatch */}

              {confirm &&
                password !== confirm && (
                  <p className="text-[11px] text-red-500 mt-1.5 animate-pulse">
                    Passwords do not match
                  </p>
                )}

              {confirm &&
                password === confirm &&
                password.length >= 6 && (
                  <p className="text-[11px] text-emerald-600 mt-1.5">
                    Passwords match ✓
                  </p>
                )}

            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className={`group relative overflow-hidden w-full py-3.5 rounded-full text-sm font-semibold mt-2 flex items-center justify-center gap-2 transition-all duration-300 ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-300/40'
              }`}
            >

              {!loading && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}

              <span className="relative">
                {loading
                  ? 'Creating Account...'
                  : 'Create Account'}
              </span>

              {!loading && (
                <ArrowRight className="relative h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              )}

            </button>

          </form>


          {/* Divider */}

          <div className="flex items-center gap-4 my-6">

            <div className="flex-1 h-px bg-gray-100" />

            <span className="text-[10px] text-gray-400 tracking-widest">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-100" />

          </div>


          {/* Login */}

          <p className="text-center text-xs sm:text-sm text-gray-500">

            Already have an account?{' '}

            <Link
              to="/login"
              className="group inline-flex items-center gap-1 text-gray-900 font-semibold hover:text-amber-600 transition-colors"
            >
              Sign in

              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />

            </Link>

          </p>

        </div>


        {/* Bottom Text */}

        <p className="text-center text-[9px] text-gray-400 uppercase tracking-[0.2em] mt-5">
          Timeless Elegance • Exceptional Craftsmanship
        </p>

      </div>

    </div>
  )
}

