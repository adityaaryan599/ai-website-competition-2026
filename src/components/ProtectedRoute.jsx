import { Navigate, Outlet, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading, role } = useAuth()
  const location = useLocation()

  // Prevent flash of redirect while Supabase restores session on initial page load / refresh
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Verifying authentication session...</p>
      </div>
    )
  }

  // If not authenticated, redirect to login while capturing the intended URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If route is restricted by role and current user does not have permission
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="max-w-lg mx-auto my-12 bg-white p-8 rounded-xl border border-red-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-600 mb-6">
          You are signed in as a <span className="font-semibold text-slate-800 uppercase text-xs px-2 py-0.5 bg-slate-100 rounded">{role || 'student'}</span>.
          This section requires administrative permissions.
        </p>
        <Link
          to="/student-dashboard"
          className="inline-block px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition shadow-sm"
        >
          Go to Student Dashboard
        </Link>
      </div>
    )
  }

  return children ? children : <Outlet />
}
