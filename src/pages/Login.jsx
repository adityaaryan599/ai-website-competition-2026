import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Login() {
  const { user, signIn, role } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(location.state?.oauthError || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect path: where user wanted to go, or appropriate dashboard based on role
  const from = location.state?.from?.pathname

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setErrorMessage('Please enter your college email address.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await signIn({
        email: trimmedEmail,
        password,
      })

      if (error) {
        const msg = error.message?.toLowerCase() || ''
        if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
          setErrorMessage('Invalid email or password. Please double-check your credentials.')
        } else if (msg.includes('email not confirmed')) {
          setErrorMessage(
            'Your email address has not been confirmed yet. Please check your inbox for the verification email.'
          )
        } else {
          setErrorMessage(error.message || 'Login failed. Please check your credentials and try again.')
        }
        return
      }

      // Successful login: redirect to requested destination or appropriate dashboard
      const userRole = data?.user?.user_metadata?.role || 'student'
      const destination = from || (userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard')

      navigate(destination, { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'A network error occurred while connecting to authentication servers.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // If already logged in, prompt user
  if (user) {
    const destination = role === 'admin' ? '/admin-dashboard' : '/student-dashboard'
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Already Signed In</h2>
        <p className="text-sm text-slate-600 mb-6">
          You are currently signed in as <span className="font-semibold text-slate-800">{user.email}</span> ({role || 'student'}).
        </p>
        <Link
          to={destination}
          className="inline-block px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition shadow-sm"
        >
          Go to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your sports equipment and ground booking portal
          </p>
        </div>

        {/* Notice if user was redirected from a protected route */}
        {from && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
            Please log in to access <span className="font-mono font-semibold">{from}</span>.
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Google OAuth Sign-In Button */}
        <div className="mb-6">
          <GoogleSignInButton
            label="Continue with Google"
            onError={setErrorMessage}
            disabled={isSubmitting}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500 font-medium">Or continue with email</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="login-email">
              College Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@college.edu"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              disabled={isSubmitting}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700" htmlFor="login-password">
                Password
              </label>
            </div>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              disabled={isSubmitting}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link to="/signup" className="text-emerald-600 font-medium hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
