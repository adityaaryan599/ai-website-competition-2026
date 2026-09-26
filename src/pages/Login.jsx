import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your sports equipment and ground booking portal
          </p>
        </div>

        {/* Informational placeholder note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-6">
          <strong>Authentication Notice:</strong> Auth integration via Supabase is planned for the next implementation phase.
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              College Email
            </label>
            <input
              id="email"
              type="email"
              disabled
              placeholder="student@college.edu"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
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
            Log In (Disabled in Foundation Stage)
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link to="/signup" className="text-emerald-600 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
