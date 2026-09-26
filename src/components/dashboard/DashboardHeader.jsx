import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import ThemeToggle from '../ThemeToggle'

export default function DashboardHeader({
  activeTab,
  setIsMobileOpen,
  notifications = [],
  setActiveTab,
}) {
  const { user } = useAuth()
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student Athlete'
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  const tabTitles = {
    overview: {
      title: `Welcome back, ${fullName}!`,
      subtitle: 'Campus sports ground schedules, gear borrowing & live match passes',
    },
    'book-ground': {
      title: 'Reserve Sports Ground',
      subtitle: 'Select campus ground, check available time slots, and schedule your match',
    },
    equipment: {
      title: 'Sports Equipment Catalog',
      subtitle: 'Browse and borrow college sports equipment with automated returns tracking',
    },
    'my-bookings': {
      title: 'My Bookings & Loans',
      subtitle: 'Manage active ground reservations, return equipment, and check booking history',
    },
    'match-passes': {
      title: 'Collegiate Match Passes',
      subtitle: 'Claim free student athlete admission tickets for upcoming varsity tournaments',
    },
    profile: {
      title: 'Student Athlete Profile',
      subtitle: 'Your verified campus sports credentials and authentication details',
    },
  }

  const currentTabInfo = tabTitles[activeTab] || tabTitles.overview
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-4 mx-4 sm:mx-6 lg:mx-8 mb-6 z-20 rounded-2xl glass-panel px-4 sm:px-6 py-3 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36),inset_0_1px_1px_rgba(255,255,255,0.18)]">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-full glass-button flex items-center justify-center text-slate-300 hover:text-white"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
              {currentTabInfo.title}
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action, Circular Glass Notifications, User Profile Capsule */}
        <div className="flex items-center gap-3">
          {activeTab !== 'book-ground' && (
            <button
              type="button"
              onClick={() => setActiveTab('book-ground')}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-button-primary text-xs font-semibold text-white shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Book Ground</span>
            </button>
          )}

          {/* Light/Dark Mode Theme Toggle */}
          <ThemeToggle />

          {/* Circular Glass Notification Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-9 h-9 rounded-full glass-button flex items-center justify-center text-slate-300 hover:text-white relative"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full ring-2 ring-slate-900 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel border border-white/15 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 border-b border-white/10 flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Notifications ({notifications.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl transition ${
                        notif.unread
                          ? 'bg-blue-500/10 border border-blue-400/20'
                          : 'bg-white/[0.03] border border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-white">{notif.title}</span>
                        <span className="text-[10px] text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Glass Capsule */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="px-3 py-1.5 rounded-full glass-button flex items-center gap-2.5 text-left group"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={fullName}
                className="w-6 h-6 rounded-full object-cover border border-cyan-400/50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-black text-[10px] flex items-center justify-center">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate max-w-[110px] leading-tight">
                {fullName}
              </p>
              <span className="text-[9px] text-slate-400 block font-medium uppercase tracking-wider">
                Athlete
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
