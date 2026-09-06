
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axios'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error('Please fill all fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const res = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      )

      toast.success(res.data.message)
      setSuccess(true)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to reset password'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-black/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-black/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="bg-white border border-black/10 rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="font-serif text-2xl">C</span>
            </div>

            <h1 className="text-3xl font-serif text-gray-900">
              Reset Password
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              Create a new password for your ChronoSphere account
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Password Reset Successful
              </h2>

              <p className="text-gray-500 text-sm leading-6 mb-7">
                Your password has been updated successfully.
                You can now login with your new password.
              </p>

              <Link
                to="/login"
                className="w-full bg-black text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter new password"
                      className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                    <input
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm new password"
                      className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>
                    Your reset link is valid for 15 minutes.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Resetting...'
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-black transition"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

