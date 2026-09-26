import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="bg-white rounded-xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-4">
          Foundation Phase
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          College Sports Equipment &amp; Ground Booking Portal
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl mx-auto">
          A centralized platform for students and sports administrators to reserve college grounds, borrow sports equipment, and manage inventory seamlessly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/student/dashboard"
            className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-sm"
          >
            Student Portal
          </Link>
          <Link
            to="/admin/dashboard"
            className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Admin Portal
          </Link>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-800 text-base mb-1">Equipment Booking</h2>
          <p className="text-xs text-slate-500 mb-3">
            Browse and reserve sports gear, track return deadlines, and view inventory.
          </p>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            Module Placeholder
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-800 text-base mb-1">Ground Reservations</h2>
          <p className="text-xs text-slate-500 mb-3">
            Schedule time slots for football, cricket, basketball, and tennis courts.
          </p>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            Module Placeholder
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-800 text-base mb-1">Student Dashboard</h2>
          <p className="text-xs text-slate-500 mb-3">
            View active reservations, borrow status, and booking history.
          </p>
          <Link
            to="/student/dashboard"
            className="text-xs font-medium text-emerald-600 hover:underline inline-block"
          >
            Visit Student Dashboard &rarr;
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-800 text-base mb-1">Admin Management</h2>
          <p className="text-xs text-slate-500 mb-3">
            Approve slot requests, manage gear checkouts, and view analytical reports.
          </p>
          <Link
            to="/admin/dashboard"
            className="text-xs font-medium text-emerald-600 hover:underline inline-block"
          >
            Visit Admin Dashboard &rarr;
          </Link>
        </div>
      </section>
    </div>
  )
}
