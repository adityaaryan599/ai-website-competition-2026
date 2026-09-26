import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Signup() {
  const { user, signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [fieldErrors, setFieldErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Client-side validations
  const validate = () => {
    const errors = {}

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required.'
    }

    if (!email.trim()) {
      errors.email = 'College email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid college email address.'
    }

    if (!password) {
      errors.password = 'Password is required.'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required.'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setEmailConfirmationRequired(false)

    const errors = validate()
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await signUp({
        fullName,
        email,
        password,
      })

      if (error) {
        // Map common Supabase error strings to user-friendly messages
        const msg = error.message?.toLowerCase() || ''
        if (msg.includes('already registered') || msg.includes('already exists')) {
          setErrorMessage('An account with this email address already exists. Please log in.')
        } else if (msg.includes('weak') || msg.includes('least 6 characters')) {
          setErrorMessage('Password is too weak. Please use at least 6 characters.')
        } else if (msg.includes('valid email')) {
          setErrorMessage('The email format is invalid. Please check and try again.')
        } else {
          setErrorMessage(error.message || 'Registration failed. Please try again.')
        }
        return
      }

      // Check if Supabase requires email verification
      // When email confirmation is enabled, a user object is returned without a session
      if (data?.user && !data?.session) {
        setEmailConfirmationRequired(true)
        setSuccessMessage(
          `Account registered successfully! A confirmation link has been sent to ${email}. Please verify your email before logging in.`
        )
      } else if (data?.session) {
        // Auto-confirmed / confirmation disabled: user is logged in
        setSuccessMessage('Account created successfully! Redirecting to your dashboard...')
        setTimeout(() => {
          navigate('/student-dashboard', { replace: true })
        }, 1200)
      } else {
        setSuccessMessage('Registration submitted. You can now log in.')
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected network error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // If already logged in, prompt user
  if (user) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Already Signed In</h2>
        <p className="text-sm text-slate-600 mb-6">
          You are currently signed in as <span className="font-semibold text-slate-800">{user.email}</span>.
        </p>
        <Link
          to="/student-dashboard"
          className="inline-block px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition"
        >
          Go to Student Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Create Student Account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Register to reserve college sports grounds and equipment
          </p>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
            <p className="font-semibold mb-1">Registration Complete</p>
            <p>{successMessage}</p>
            {emailConfirmationRequired && (
              <div className="mt-3">
                <Link
                  to="/login"
                  className="inline-block px-4 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  Go to Login
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Google OAuth Sign-Up Option */}
        {!emailConfirmationRequired && (
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
                <span className="bg-white px-3 text-slate-500 font-medium">Or register with email</span>
              </div>
            </div>
          </div>
        )}

        {!emailConfirmationRequired && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: null })
                }}
                placeholder="e.g. Alex Johnson"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  fieldErrors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
                autoComplete="name"
              />
              {fieldErrors.fullName && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                College Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null })
                }}
                placeholder="student@college.edu"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  fieldErrors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null })
                }}
                placeholder="Minimum 6 characters"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  fieldErrors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors({ ...fieldErrors, confirmPassword: null })
                  }
                }}
                placeholder="Re-enter password"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                  fieldErrors.confirmPassword ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Account Role Info Note */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
              Account role: <span className="font-semibold text-slate-700">Student</span>. Administrative accounts are provisioned separately by campus sports administrators.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-600 font-medium hover:underline">
            Log in to your account
          </Link>
        </div>
      </div>
    </div>
  )
}
