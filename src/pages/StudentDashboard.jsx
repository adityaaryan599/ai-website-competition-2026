export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Reserve sports equipment and book campus grounds
          </p>
        </div>
        <span className="self-start sm:self-auto inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          Planned Module
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Equipment Borrowing</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Placeholder</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Students will be able to search available gear (badminton racquets, footballs, cricket sets), request checkouts, and view due dates.
          </p>
          <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
            Equipment catalog and borrowing workflow will be implemented in the next phase.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Ground Booking</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Placeholder</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Students will be able to inspect real-time availability of sports facilities, request slot reservations, and receive booking confirmations.
          </p>
          <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
            Ground schedule and slot reservation workflow will be implemented in the next phase.
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">My Active Bookings</h2>
        <p className="text-sm text-slate-600 mb-4">
          Status of submitted ground reservation requests and currently borrowed equipment.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Item / Ground</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date / Slot</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-xs text-slate-400">
                  No active bookings. Data connection will be initialized in the database integration phase.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
