import { useState } from 'react'

export default function ConflictCard({
  conflicts = [],
  onResolveConflict,
  onCancelConflictBooking,
}) {
  const [actionNotice, setActionNotice] = useState('')

  const triggerNotice = (msg) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3000)
  }

  const handleResolve = (conflictId) => {
    onResolveConflict(conflictId, 'Resolved with custom schedule adjustment')
    triggerNotice(`Conflict ${conflictId} marked resolved.`)
  }

  const handleCancelBooking = (conflictId, bookingId, studentName) => {
    onCancelConflictBooking(conflictId, bookingId)
    triggerNotice(`Cancelled booking ${bookingId} for ${studentName}. Conflict cleared.`)
  }

  const handleKeepBoth = (conflictId) => {
    onResolveConflict(conflictId, 'Exemption granted: Shared ground usage approved')
    triggerNotice(`Special exemption granted for conflict ${conflictId}. Both reservations active.`)
  }

  const unresolvedCount = conflicts.filter((c) => c.resolutionStatus === 'Unresolved').length

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{actionNotice}</span>
          </div>
          <button type="button" onClick={() => setActionNotice('')} className="text-cyan-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Booking Collision & Conflict Resolution Engine
            </h2>
            {unresolvedCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-semibold animate-pulse">
                {unresolvedCount} Active Overlaps
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated collision detection identifies concurrent facility bookings and timetable clashes
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-white/5 px-3 py-2 rounded-xl border border-white/10 self-start sm:self-auto">
          Detection Algorithm: <span className="text-cyan-300 font-semibold">Active & Live</span>
        </div>
      </div>

      {/* Conflict Cards List */}
      <div className="space-y-5">
        {conflicts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center text-slate-400">
            <svg className="w-10 h-10 text-emerald-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-white">No Booking Conflicts Detected</p>
            <p className="text-xs text-slate-400">All collegiate facility schedules are currently collision-free.</p>
          </div>
        ) : (
          conflicts.map((conflict) => {
            const isResolved = conflict.resolutionStatus === 'Resolved'

            return (
              <div
                key={conflict.id}
                className={`glass-panel rounded-2xl p-5 sm:p-6 transition-all border ${
                  isResolved
                    ? 'border-emerald-500/20 bg-slate-900/40 opacity-75'
                    : 'border-amber-500/40 bg-gradient-to-b from-amber-950/15 via-slate-900/60 to-slate-900/80 shadow-2xl'
                }`}
              >
                {/* Conflict Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyan-300 font-bold">{conflict.id}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {conflict.conflictType}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isResolved
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}
                      >
                        {conflict.resolutionStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
                      <div>
                        Venue: <span className="font-semibold text-white">{conflict.ground}</span>
                      </div>
                      <div>
                        Date: <span className="font-semibold text-white">{conflict.date}</span>
                      </div>
                      <div className="text-amber-300 font-medium">
                        Overlap: <span className="font-bold">{conflict.timeOverlap}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Detected: {conflict.detectedAt}
                  </span>
                </div>

                {/* Overlapping Parties Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  {conflict.students.map((student, idx) => (
                    <div
                      key={student.bookingId}
                      className="glass-card rounded-xl p-4 border border-white/10 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {idx === 0 ? 'Party A (Primary Slot)' : 'Party B (Conflicting Slot)'}
                        </span>
                        <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                          {student.bookingId}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-white text-sm">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </div>

                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Requested Time:</span>
                        <span className="font-semibold text-white">{student.requestedSlot}</span>
                      </div>

                      {!isResolved && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(conflict.id, student.bookingId, student.name)}
                            className="w-full py-1.5 rounded-lg text-[11px] font-medium bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition"
                          >
                            Cancel This Booking ({student.bookingId})
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Resolution Summary or Action Controls */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  {isResolved ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-300">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{conflict.resolutionNote || 'Conflict resolved by administrator.'}</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs text-slate-400">
                        Select an action to balance slot scheduling:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleKeepBoth(conflict.id)}
                          className="px-3 py-1.5 rounded-xl glass-button text-xs text-slate-300 hover:text-white"
                        >
                          Keep Both (Shared Exemption)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolve(conflict.id)}
                          className="glass-button-primary px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                        >
                          Resolve Conflict
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
