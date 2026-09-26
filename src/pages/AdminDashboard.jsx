export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sports administration, equipment inventory, and ground request management
          </p>
        </div>
        <span className="self-start sm:self-auto inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Admin Portal (Placeholder)
        </span>
      </div>

      {/* Metrics placeholder */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Equipment</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          <span className="text-xs text-slate-400">Inventory pending</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Loans</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          <span className="text-xs text-slate-400">Tracking pending</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          <span className="text-xs text-slate-400">Approvals pending</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Grounds</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          <span className="text-xs text-slate-400">Facilities pending</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Inventory Management</h2>
          <p className="text-sm text-slate-600 mb-4">
            Add, update, retire sports equipment and log maintenance conditions.
          </p>
          <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
            Inventory CRUD operations will be connected to Supabase in the next phase.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Ground Approval Queue</h2>
          <p className="text-sm text-slate-600 mb-4">
            Review student ground booking requests, resolve slot conflicts, and manage maintenance blocks.
          </p>
          <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
            Approval workflows and slot collision detection will be added in subsequent milestones.
          </div>
        </div>
      </div>
    </div>
  )
}
