import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const fullName = user?.user_metadata?.full_name || 'Sports Administrator'
  const email = user?.email || 'N/A'

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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              Admin Portal
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
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{fullName}</p>
            <p className="text-xs text-slate-500">{email}</p>
          </div>
        </div>
        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          Privilege tier: <span className="text-purple-700 font-semibold">Campus Sports Officer</span>
        </div>
      </div>

      {/* Metrics placeholder */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Equipment</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          <span className="text-xs text-slate-400">Inventory pending</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Loans</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          <span className="text-xs text-slate-400">Tracking pending</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          <span className="text-xs text-slate-400">Approvals pending</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Grounds</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          <span className="text-xs text-slate-400">Facilities pending</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Inventory Management</h2>
          <p className="text-sm text-slate-600 mb-4">
            Add, update, retire sports equipment and log maintenance conditions.
          </p>
          <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
            Inventory CRUD operations will be connected to Supabase in the next phase.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Ground Approval Queue</h2>
          <p className="text-sm text-slate-600 mb-4">
            Review student ground booking requests, resolve slot conflicts, and manage maintenance blocks.
          </p>
          <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
            Approval workflows and slot collision detection will be added in subsequent milestones.
          </div>
        </div>
      </div>
    </div>
  )
}
