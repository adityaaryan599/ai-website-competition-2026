import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, role, isAdmin, signOut, loading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      setIsMobileMenuOpen(false)
      navigate('/student-login', { replace: true })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
      isActive
        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-sm'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600/40 to-cyan-500/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-black text-sm shadow-inner group-hover:scale-105 transition-transform">
              SP
            </div>
            <div>
              <span className="font-bold text-white text-base leading-tight block tracking-tight">
                SportsPortal
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Collegiate Equipment & Ground Booking
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            {user && (
              <>
                <NavLink to="/student-dashboard" className={navLinkClass}>
                  Student Dashboard
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin-dashboard" className={navLinkClass}>
                    Admin Dashboard
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Desktop Auth State / Actions + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                    <div className="flex items-center gap-2 text-right">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={userDisplayName}
                          className="w-8 h-8 rounded-full object-cover border border-cyan-400/30 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {userDisplayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="text-xs">
                        <p className="font-semibold text-white leading-tight">
                          {userDisplayName}
                        </p>
                        <span className="inline-block uppercase text-[10px] tracking-wider font-semibold text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded-full border border-cyan-500/30">
                          {role || 'student'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl glass-button text-slate-300 hover:text-red-400 hover:border-red-400/40 transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isLoggingOut ? 'Logging out...' : 'Log out'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                    <NavLink
                      to="/login"
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl glass-button text-slate-300 hover:text-white transition"
                    >
                      Log in
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-xl glass-button-primary text-white shadow-sm transition"
                    >
                      Sign up
                    </NavLink>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Right Controls: Theme Toggle & Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl glass-button text-slate-300 hover:text-white"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 glass-panel px-4 pt-3 pb-5 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/student-dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Student Dashboard
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin-dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileNavLinkClass}
                >
                  Admin Dashboard
                </NavLink>
              )}
            </>
          )}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userDisplayName}
                      className="w-7 h-7 rounded-full object-cover border border-cyan-400/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{userDisplayName}</p>
                    <p className="text-slate-400 text-[10px]">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-center py-2 rounded-xl glass-button text-slate-300 font-semibold text-xs hover:text-red-400 transition"
                >
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2 rounded-xl glass-button text-xs font-semibold text-white"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2 rounded-xl glass-button-primary text-xs font-semibold text-white"
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
