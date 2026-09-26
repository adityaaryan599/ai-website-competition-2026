export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              College Sports Equipment & Ground Booking Portal
            </p>
            <p className="text-xs text-slate-500">
              Built for AI Website Competition 2026
            </p>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} All rights reserved. Initial Foundation Stage.
          </p>
        </div>
      </div>
    </footer>
  )
}
