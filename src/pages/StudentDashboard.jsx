import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function StudentDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const fullName = user?.user_metadata?.full_name || 'Student Athlete'
  const email = user?.email || 'N/A'
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setLogoutError('')
    try {
      const { error } = await signOut()
      if (error) {
        setLogoutError(error.message || 'Logout failed. Please try again.')
        setIsLoggingOut(false)
        return
      }
      navigate('/login', { replace: true })
    } catch (err) {
      setLogoutError(err.message || 'An unexpected error occurred during logout.')
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Real Auth State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Student Dashboard</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Student
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Welcome back, <span className="font-semibold text-slate-900">{fullName}</span> ({email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              'Log Out'
            )}
          </button>
        </div>
      </div>

      {logoutError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {logoutError}
        </div>
      )}

      {/* Authenticated Profile Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover border border-emerald-200 shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900">{fullName}</p>
            <p className="text-xs text-slate-500">{email}</p>
          </div>
        </div>
        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          Session status: <span className="text-emerald-700 font-semibold">Active Supabase Auth</span>
        </div>
      </div>

      {/* Planned Feature Placeholders */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Equipment Borrowing</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Feature Next</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Browse and reserve sports gear, track return deadlines, and view inventory.
          </p>
          <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
            Sports equipment reservation workflows will connect to Supabase tables in the upcoming phase.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Ground Reservations</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Feature Next</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Schedule time slots for football, cricket, basketball, and tennis facilities.
          </p>
          <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
            Facility schedule and slot collision management will be enabled in subsequent milestones.
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">My Active Bookings</h2>
        <p className="text-sm text-slate-600 mb-4">
          Status of submitted ground reservation requests and currently borrowed equipment.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Item / Ground</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date / Slot</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-xs text-slate-400">
                  No active reservations. Booking tables will be created in the database phase.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
