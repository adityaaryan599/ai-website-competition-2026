import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function DashboardSidebar({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  counts = {},
}) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      if (setIsMobileOpen) setIsMobileOpen(false)
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout error:', err)
      setIsLoggingOut(false)
    }
  }

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'book-ground',
      label: 'Book Ground',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'equipment',
      label: 'Equipment',
      badge: counts.equipmentAvailable || null,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'my-bookings',
      label: 'My Bookings',
      badge: counts.activeBookings || null,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'match-passes',
      label: 'Match Passes',
      badgeText: 'New',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student Athlete'
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  const sidebarContent = (
    <div className="flex flex-col h-full text-slate-200">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-white/[0.08] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/80 text-white font-extrabold text-base flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-blue-400/40 group-hover:scale-105 transition-transform duration-200">
            SP
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight block">
              SportsPortal
            </span>
            <span className="text-[10px] font-semibold text-cyan-300 block tracking-wider uppercase">
              Student Athlete
            </span>
          </div>
        </Link>

        {isMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-full glass-button text-slate-300 hover:text-white"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id)
                if (setIsMobileOpen) setIsMobileOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white/[0.14] text-white border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md translate-x-1'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-cyan-300' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge !== null && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-blue-500/40 text-blue-100 border border-blue-400/40'
                      : 'bg-white/[0.06] text-slate-300 border border-white/10'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.badgeText && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  {item.badgeText}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Links to Public Portal & Admin Operations */}
      <div className="px-3 py-2 space-y-1.5 border-t border-white/[0.08]">
        <Link
          to="/admin-dashboard"
          className="flex items-center justify-between w-full px-3 py-1.5 rounded-xl text-xs font-medium text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition"
        >
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin Operations
          </span>
          <span className="text-cyan-400 text-xs">&rarr;</span>
        </Link>

        <Link
          to="/"
          className="flex items-center justify-between w-full px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white glass-button transition"
        >
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Public Portal
          </span>
          <span className="text-slate-400 text-xs">&rarr;</span>
        </Link>
      </div>

      {/* User Card & Logout */}
      <div className="p-3 border-t border-white/[0.08] bg-black/20">
        <div className="p-2.5 rounded-2xl glass-card border border-white/10 mb-2 flex items-center gap-3">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userDisplayName}
              className="w-9 h-9 rounded-xl object-cover border border-cyan-400/40 shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
              {userDisplayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{userDisplayName}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-red-500/25 bg-red-500/10 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:border-red-500/40 active:scale-[0.98] transition disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Floating Liquid Glass Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:top-4 lg:bottom-4 lg:left-4 z-30 rounded-3xl glass-panel overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Glass Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-3 left-3 w-72 max-w-[85vw] rounded-3xl glass-panel shadow-2xl z-50 overflow-hidden">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
