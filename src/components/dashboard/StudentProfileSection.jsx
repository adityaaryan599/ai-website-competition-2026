import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function StudentProfileSection() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student Athlete'
  const email = user?.email || 'N/A'
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  const provider = user?.app_metadata?.provider || (userAvatar ? 'Google OAuth' : 'College Email / Password')

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
    <div className="max-w-4xl mx-auto space-y-6">
      {logoutError && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs font-medium text-red-200 shadow-lg">
          {logoutError}
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Ambient avatar glow */}
        <div className="absolute top-0 left-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={fullName}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.25)]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-black text-2xl flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.4)] border border-white/20">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
              <h2 className="text-xl font-bold text-white tracking-tight">{fullName}</h2>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30 backdrop-blur-md">
                Student Athlete
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3.5">{email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-300">
              <span className="px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/10 font-mono">
                Athlete ID: STU-2026-8491
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/10">
                Auth: {provider}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                Status: Verified Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account & Role Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Student Credentials</h3>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Verified</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Legal Name</label>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white font-semibold">
                {fullName}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">College Email Address</label>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-cyan-300 font-mono">
                {email}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-slate-400">Account Role</label>
                <span className="text-[10px] text-cyan-300 font-medium">Locked by campus admin</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <span className="font-semibold text-white">Student Athlete</span>
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                Roles are managed securely via Supabase. Self-promotion to Administrator is locked.
              </p>
            </div>
          </div>
        </div>

        {/* Sports Privileges & Guidelines */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase">Campus Athlete Privileges</h3>
              <span className="text-[10px] font-bold text-cyan-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                Varsity Tier
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 mt-3.5">
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Priority ground booking across all 5 campus athletic fields and courts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Checkout up to 3 tournament-grade equipment items concurrently.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Free student ticket access for varsity derby matches and championship cups.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Evening floodlight slot reservations permitted on verified athlete status.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-2.5 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/50 active:scale-[0.98] text-xs font-bold transition shadow-lg flex items-center justify-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  <span>Signing out of session...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out of Student Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
