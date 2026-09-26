import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { ThemeProvider } from './context/ThemeProvider'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import { useAuth } from './hooks/useAuth'

// Helper component to route /dashboard to appropriate dashboard based on authenticated user role
function DashboardRedirect() {
  const { role } = useAuth()
  return <Navigate to={role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} replace />
}

// Handler component to intercept Supabase OAuth callback redirects and errors
function OAuthCallbackHandler() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // 1. Check for OAuth error parameters in URL hash or query string
    const rawHash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash
    const hashParams = new URLSearchParams(rawHash)
    const searchParams = new URLSearchParams(window.location.search)

    const oauthErrorDescription =
      hashParams.get('error_description') ||
      searchParams.get('error_description') ||
      hashParams.get('error') ||
      searchParams.get('error')

    if (oauthErrorDescription) {
      sessionStorage.removeItem('supabase_oauth_pending')
      // Clean hash/query from URL bar
      window.history.replaceState({}, document.title, window.location.pathname)
      navigate('/login', {
        state: {
          oauthError: `Google authentication was cancelled or encountered an error (${oauthErrorDescription}).`,
        },
        replace: true,
      })
      return
    }

    // 2. Check if an OAuth return has completed
    const isOAuthPending = sessionStorage.getItem('supabase_oauth_pending') === 'true'
    const hasOAuthTokens =
      window.location.hash.includes('access_token') || window.location.search.includes('code')

    if ((isOAuthPending || hasOAuthTokens) && user && !loading) {
      sessionStorage.removeItem('supabase_oauth_pending')
      // Clean up token hash from browser address bar
      if (window.location.hash) {
        window.history.replaceState({}, document.title, window.location.pathname)
      }
      navigate('/student-dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OAuthCallbackHandler />
        <Routes>
          {/* Protected Dashboards: Full-viewport Experience */}
          <Route element={<ProtectedRoute />}>
            <Route path="student-dashboard" element={<StudentDashboard />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="dashboard" element={<DashboardRedirect />} />
            {/* Path aliases */}
            <Route path="student/dashboard" element={<Navigate to="/student-dashboard" replace />} />
            <Route path="admin/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
          </Route>

          {/* Public & Website Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
