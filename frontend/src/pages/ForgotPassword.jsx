
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)

    try {
      await axiosInstance.post('/auth/forgot-password', {
        email,
      })

      setSent(true)

      toast.success('Password reset link sent to your email')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Something went wrong. Please try again'

      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/40 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      <div className="absolute -top-32 -left-32 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />

      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute top-1/4 right-10 w-40 h-40 bg-blue-100/20 rounded-full blur-3xl" />

      <div className="absolute top-24 left-[15%] w-2 h-2 bg-amber-400 rounded-full animate-bounce" />

      <div className="absolute top-40 right-[18%] w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />

      <div className="absolute bottom-28 left-[20%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />

      <div className="w-full max-w-md mx-auto relative z-10">

        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.08)] border border-white/80 p-7 sm:p-9">

          <div className="flex flex-col items-center gap-3 mb-8">

            <div className="relative">

              <div className="absolute inset-0 bg-amber-300/30 rounded-full blur-xl animate-pulse" />

              <div className="relative bg-black rounded-full p-3.5 shadow-lg transition-transform duration-500 hover:scale-110">
                <Clock className="h-6 w-6 text-white" />
              </div>

            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.25em] uppercase text-gray-400">
              <Sparkles className="h-3 w-3 text-amber-500" />
              ChronoSphere
            </div>

            <h1
              className="text-3xl font-bold text-gray-900 tracking-tight text-center"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Forgot Password?
            </h1>

            <p className="text-sm text-gray-400 text-center max-w-xs">
              Enter your email and we'll send you a secure link to reset your password.
            </p>

          </div>

          {sent ? (
            <div className="flex flex-col items-center text-center py-4">

              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Check Your Email
              </h2>

              <p className="text-sm text-gray-500 leading-6 mb-6">
                We've sent a password reset link to
                <span className="font-semibold text-gray-800">
                  {' '}{email}
                </span>
                .
              </p>

              <p className="text-xs text-gray-400 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-sm font-semibold text-black hover:text-amber-600 transition-colors"
              >
                Try another email
              </button>

            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >

              <div className="flex flex-col gap-2">

                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.15em]">
                  Email Address
                </label>

                <div className="relative group">

                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors duration-300" />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5"
                  />

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full py-3.5 rounded-full text-sm font-semibold overflow-hidden transition-all duration-300 ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-900 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] hover:-translate-y-0.5'
                }`}
              >

                {!loading && (
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                )}

                <span className="relative flex items-center justify-center gap-2">

                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}

                </span>

              </button>

            </form>
          )}

          <div className="flex items-center gap-4 my-7">

            <div className="flex-1 h-px bg-gray-100" />

            <span className="text-[10px] font-medium text-gray-400 tracking-widest">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-100" />

          </div>

          <div className="flex justify-center">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>

          </div>

          <div className="mt-7 pt-5 border-t border-gray-100 text-center">

            <p className="text-[10px] text-gray-400 tracking-wide">
              Premium watches. Timeless moments.
            </p>

          </div>

        </div>

      </div>
    </div>
  )
}

