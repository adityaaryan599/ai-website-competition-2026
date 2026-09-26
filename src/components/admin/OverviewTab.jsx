import AdminStatCard from './AdminStatCard'

export default function OverviewTab({
  stats,
  groundBookings = [],
  equipmentRequests = [],
  grounds = [],
  onApproveBooking,
  onRejectBooking,
  onApproveRequest,
  onRejectRequest,
  onToggleGroundMaintenance,
  setActiveTab,
}) {
  const recentBookings = groundBookings.slice(0, 5)
  const recentRequests = equipmentRequests.slice(0, 5)

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 6 High-Impact Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AdminStatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          subtitle="Enrolled athletes"
          badge="+12% active"
          badgeColor="cyan"
          onClick={() => setActiveTab('students')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />

        <AdminStatCard
          title="Active Bookings"
          value={stats.activeGroundBookings}
          subtitle="Ground reservations"
          badge="Live schedule"
          badgeColor="blue"
          onClick={() => setActiveTab('bookings')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <AdminStatCard
          title="Borrowed Gear"
          value={stats.equipmentBorrowed}
          subtitle="Items out on loan"
          badge="In circulation"
          badgeColor="emerald"
          onClick={() => setActiveTab('inventory')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <AdminStatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          subtitle="Awaiting sign-off"
          badge={`${stats.pendingRequests} need review`}
          badgeColor="amber"
          onClick={() => setActiveTab('requests')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <AdminStatCard
          title="Available Grounds"
          value={stats.availableGrounds}
          subtitle="Ready for booking"
          badge="Operational"
          badgeColor="cyan"
          onClick={() => setActiveTab('overview')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <AdminStatCard
          title="Damaged Gear"
          value={stats.damagedEquipment}
          subtitle="Requires attention"
          badge="Under review"
          badgeColor="red"
          onClick={() => setActiveTab('damages')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* AI Tournament Fixture Banner Callout */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/25 bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900/60 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold border border-cyan-400/30">
            <span>✨ AI Competition Feature</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Automated Tournament Fixture & Bracket Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Generate single-elimination tournament trees with algorithmic seed balancing, interactive match winner progression, and intelligent scheduling recommendations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('fixtures')}
          className="glass-button-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shrink-0 flex items-center gap-2"
        >
          <span>Launch AI Bracket Builder</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Ground Availability Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Ground Status & Availability</h3>
            <p className="text-xs text-slate-400">Current state and slot allocations across athletic venues</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {grounds.map((g) => {
            const isAvailable = g.status === 'Available'
            const isMaintenance = g.status === 'Maintenance'

            return (
              <div key={g.id} className="glass-card rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                      {g.sport}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isAvailable
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : isMaintenance
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{g.name}</h4>
                  <p className="text-[11px] text-slate-400">{g.condition}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Open Slots</span>
                    <span className="font-semibold text-white">{g.availableSlots} / {g.totalSlots}</span>
                  </div>
                  {/* Slot availability progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isMaintenance ? 'bg-amber-400' : isAvailable ? 'bg-emerald-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${(g.availableSlots / g.totalSlots) * 100}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleGroundMaintenance(g.id)}
                    className="w-full mt-2 py-1.5 rounded-lg glass-button text-[11px] font-medium text-slate-300 hover:text-white transition"
                  >
                    {isMaintenance ? 'Mark Operational' : 'Set Maintenance'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Bookings & Equipment Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. Recent Ground Bookings */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Ground Reservations</h3>
              <p className="text-xs text-slate-400">Latest student facility bookings</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="pb-2 font-medium">Student</th>
                  <th className="pb-2 font-medium">Facility / Sport</th>
                  <th className="pb-2 font-medium">Schedule</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-white">{b.studentName}</div>
                      <span className="text-[10px] text-slate-400">{b.studentId}</span>
                    </td>
                    <td className="py-2.5 pr-2">
                      <div className="text-slate-200">{b.ground}</div>
                      <span className="text-[10px] text-cyan-400">{b.sport}</span>
                    </td>
                    <td className="py-2.5 pr-2">
                      <div className="text-slate-300">{b.date}</div>
                      <span className="text-[10px] text-slate-400">{b.timeSlot}</span>
                    </td>
                    <td className="py-2.5 pr-2">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          b.status === 'Approved'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : b.status === 'Pending'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-red-500/15 text-red-300 border-red-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      {b.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onApproveBooking(b.id)}
                            className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition text-[11px]"
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectBooking(b.id)}
                            className="p-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition text-[11px]"
                            title="Reject"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* B. Recent Equipment Requests */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Gear Checkouts</h3>
              <p className="text-xs text-slate-400">Student equipment borrowing queue</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="pb-2 font-medium">Student</th>
                  <th className="pb-2 font-medium">Equipment</th>
                  <th className="pb-2 font-medium">Qty</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-white">{r.studentName}</div>
                      <span className="text-[10px] text-slate-400">{r.studentId}</span>
                    </td>
                    <td className="py-2.5 pr-2">
                      <div className="text-slate-200">{r.equipment}</div>
                      <span className="text-[10px] text-slate-400">Req: {r.requestedDate}</span>
                    </td>
                    <td className="py-2.5 pr-2 text-slate-200 font-semibold">{r.quantity}x</td>
                    <td className="py-2.5 pr-2">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          r.status === 'Approved' || r.status === 'Borrowed'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : r.status === 'Pending'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : r.status === 'Overdue'
                            ? 'bg-red-500/15 text-red-300 border-red-500/30'
                            : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      {r.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onApproveRequest(r.id)}
                            className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition text-[11px]"
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectRequest(r.id)}
                            className="p-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition text-[11px]"
                            title="Reject"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
