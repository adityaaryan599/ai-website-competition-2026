import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import ThemeToggle from '../ThemeToggle'

const TAB_TITLES = {
  overview: {
    title: 'Athletic Operations Overview',
    subtitle: 'Campus grounds, equipment inventory & live operation metrics',
  },
  bookings: {
    title: 'Ground Booking Management',
    subtitle: 'Review, approve, or adjust facility reservations across all collegiate grounds',
  },
  inventory: {
    title: 'Equipment Inventory Control',
    subtitle: 'Real-time sports gear stock, conditions, and maintenance tracking',
  },
  requests: {
    title: 'Student Borrow Requests',
    subtitle: 'Process equipment check-outs, returns, and overdue loan alerts',
  },
  conflicts: {
    title: 'Booking Overlap & Conflict Engine',
    subtitle: 'Resolve ground time collision notices and simultaneous reservation conflicts',
  },
  damages: {
    title: 'Damaged Equipment & Incident Log',
    subtitle: 'Assess equipment wear, assign repair fees, and manage restorations',
  },
  matches: {
    title: 'Inter-Collegiate Fixtures & Matches',
    subtitle: 'Schedule upcoming sports tournaments and manage varsity venues',
  },
  fixtures: {
    title: 'AI Tournament Fixture Generator',
    subtitle: 'Algorithmic single-elimination bracket builder with automated seed pairings',
  },
  students: {
    title: 'Student Athlete Directory',
    subtitle: 'Manage student booking permissions, loan limits, and account status',
  },
}

export default function AdminHeader({
  activeTab,
  setIsMobileOpen,
  notifications = [],
  searchTerm,
  setSearchTerm,
  onClearSearch,
}) {
  const { user } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [localNotifications, setLocalNotifications] = useState(notifications)

  const unreadCount = localNotifications.filter((n) => n.unread).length
  const tabInfo = TAB_TITLES[activeTab] || TAB_TITLES.overview

  const markAllRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const removeNotification = (id) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <header className="sticky top-4 z-30 px-4 sm:px-6 lg:px-8 mb-6">
      <div className="glass-panel rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl glass-button text-slate-300 hover:text-white"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              {tabInfo.title}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block truncate">
              {tabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Search, Notifications & Admin Capsule */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Quick Search Input */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <input
              type="text"
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
              placeholder="Quick search..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl glass-input text-xs placeholder:text-slate-500"
            />
            <svg
              className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                type="button"
                onClick={onClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 sm:p-2.5 rounded-xl glass-button text-slate-300 hover:text-white relative"
              aria-label="View notifications"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-2xl z-40 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Operations Feed</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/30">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] text-cyan-300 hover:text-cyan-200 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {localNotifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No recent operation alerts
                      </div>
                    ) : (
                      localNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border transition flex items-start justify-between gap-2 ${
                            n.unread
                              ? 'bg-blue-900/25 border-cyan-500/30'
                              : 'bg-white/5 border-white/5 opacity-80'
                          }`}
                        >
                          <div className="space-y-0.5 text-left">
                            <p className="text-xs font-medium text-white">{n.title}</p>
                            <p className="text-[11px] text-slate-300">{n.message}</p>
                            <span className="text-[10px] text-slate-400 block pt-0.5">{n.time}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNotification(n.id)}
                            className="text-slate-500 hover:text-slate-300 text-xs p-1"
                            title="Dismiss"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Admin Profile Capsule */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 p-[1.5px] shadow-sm">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-cyan-300">
                {user?.user_metadata?.full_name?.charAt(0) || 'A'}
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white leading-none">
                  {user?.user_metadata?.full_name || 'Admin Officer'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                Campus Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
