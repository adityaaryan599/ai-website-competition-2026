import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-4xl font-extrabold text-emerald-600 mb-2">404</p>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition shadow-sm"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
