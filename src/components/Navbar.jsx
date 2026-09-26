import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? 'bg-emerald-600 text-white'
        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition-colors">
              SP
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg leading-tight block">
                SportsPortal
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Equipment & Ground Booking
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/student/dashboard" className={navLinkClass}>
              Student Dashboard
            </NavLink>
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              Admin Dashboard
            </NavLink>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-sm font-medium px-4 py-2 rounded-md border transition-colors ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                    : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`
              }
            >
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              className="text-sm font-medium px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
            >
              Sign up
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <NavLink
            to="/"
            end
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/student/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Student Dashboard
          </NavLink>
          <NavLink
            to="/admin/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Admin Dashboard
          </NavLink>
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <NavLink
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-3 py-2 rounded-md bg-emerald-600 text-white font-medium text-base hover:bg-emerald-700 transition-colors"
            >
              Sign up
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
