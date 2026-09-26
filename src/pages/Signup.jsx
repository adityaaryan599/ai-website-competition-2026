import { Link } from 'react-router-dom'

export default function Signup() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Create an Account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Register to book sports grounds and borrow equipment
          </p>
        </div>

        {/* Informational placeholder note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-6">
          <strong>Registration Notice:</strong> Account creation with role assignment will be integrated with Supabase.
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullname">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              disabled
              placeholder="Alex Johnson"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="signup-email">
              College Email
            </label>
            <input
              id="signup-email"
              type="email"
              disabled
              placeholder="alex@college.edu"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              disabled
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 text-white font-medium text-sm opacity-50 cursor-not-allowed"
          >
            Sign Up (Disabled in Foundation Stage)
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-600 font-medium hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
