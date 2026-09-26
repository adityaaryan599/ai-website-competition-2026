import StatCard from './StatCard'

export default function OverviewSection({
  groundBookings = [],
  equipmentBorrowings = [],
  matches = [],
  setActiveTab,
  onCancelBooking,
  onReturnEquipment,
  onClaimPass,
}) {
  const activeBookings = groundBookings.filter((b) => b.status === 'Confirmed')
  const pendingBookings = groundBookings.filter((b) => b.status === 'Pending Approval')
  const activeEquipment = equipmentBorrowings.filter((e) => e.status === 'Active')

  // Next upcoming booking spotlight
  const nextBooking = groundBookings[0]

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Bookings"
          value={activeBookings.length}
          subtitle="Confirmed campus slots"
          badgeText="Active"
          badgeType="primary"
          onClick={() => setActiveTab('my-bookings')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />

        <StatCard
          title="Borrowed Gear"
          value={activeEquipment.length}
          subtitle="Equipment in custody"
          badgeText="In Use"
          badgeType="success"
          onClick={() => setActiveTab('my-bookings')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <StatCard
          title="Match Passes"
          value={matches.length}
          subtitle="Upcoming varsity fixtures"
          badgeText="Open"
          badgeType="neutral"
          onClick={() => setActiveTab('match-passes')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          }
        />

        <StatCard
          title="Pending Requests"
          value={pendingBookings.length}
          subtitle="Awaiting sports officer"
          badgeText="Reviewing"
          badgeType="warning"
          onClick={() => setActiveTab('my-bookings')}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Floating Translucent Liquid Glass Hero Action Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/15 relative overflow-hidden shadow-2xl">
        {/* Soft background light reflection */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/[0.08] text-cyan-300 border border-white/15 backdrop-blur-md mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Campus Athlete Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Ready to train or compete today?
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Check real-time facility slots, checkout tournament-grade sports gear, and claim free student admission passes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('book-ground')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl glass-button-primary text-xs font-bold text-white shadow-lg"
            >
              Book Ground
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('equipment')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl glass-button text-xs font-bold text-slate-200 hover:text-white"
            >
              Borrow Equipment
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('match-passes')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl glass-button text-xs font-bold text-slate-200 hover:text-white"
            >
              Match Passes
            </button>
          </div>
        </div>
      </div>

      {/* Main Overview Grid: Upcoming Booking & Currently Borrowed Gear */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Upcoming Ground Booking (2 cols) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Upcoming Ground Reservation</h2>
                <p className="text-xs text-slate-400">Next scheduled match slot on campus</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('my-bookings')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                View all ({groundBookings.length}) &rarr;
              </button>
            </div>

            {nextBooking ? (
              <div className="rounded-2xl border border-blue-400/25 bg-white/[0.04] backdrop-blur-md p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {nextBooking.sport}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          nextBooking.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        }`}
                      >
                        {nextBooking.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">{nextBooking.groundName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Booking ID: {nextBooking.id}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">{nextBooking.date}</span>
                    <span className="text-xs text-cyan-300 block font-semibold">{nextBooking.timeSlot}</span>
                    <span className="text-[11px] text-slate-400 block">Duration: {nextBooking.duration}</span>
                  </div>
                </div>

                {nextBooking.purpose && (
                  <p className="text-xs text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/10 mb-4">
                    <span className="text-slate-400 font-medium">Notes:</span> {nextBooking.purpose}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => onCancelBooking?.(nextBooking.id)}
                    className="px-3.5 py-1.5 rounded-xl glass-button text-xs font-semibold text-slate-300 hover:text-red-300 hover:border-red-400/30"
                  >
                    Cancel Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('book-ground')}
                    className="px-3.5 py-1.5 rounded-xl glass-button-primary text-xs font-bold text-white shadow-sm"
                  >
                    Book Another Ground
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <div className="w-12 h-12 rounded-full bg-white/[0.05] text-slate-400 flex items-center justify-center mx-auto mb-3 border border-white/10">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">No Upcoming Ground Reservations</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Book a court or field for your team practice.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('book-ground')}
                  className="px-4 py-2 rounded-xl glass-button-primary text-white text-xs font-bold shadow-md"
                >
                  Book Ground Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Currently Borrowed Equipment (1 col) */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Borrowed Gear</h2>
                <p className="text-xs text-slate-400">Checked out equipment</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('equipment')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                + Borrow
              </button>
            </div>

            <div className="space-y-3">
              {activeEquipment.length > 0 ? (
                activeEquipment.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition shadow-sm backdrop-blur-md"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.itemName}</h4>
                        <span className="text-[11px] text-slate-400">
                          Qty: <strong className="text-white">{item.quantity}</strong> &bull; {item.sport}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/[0.06]">
                      <span>Due: <strong className="text-slate-200">{item.dueDate}</strong></span>
                      <button
                        type="button"
                        onClick={() => onReturnEquipment?.(item.id)}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                      >
                        Return Gear &rarr;
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-400 mb-3">No sports gear currently checked out.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('equipment')}
                    className="px-3.5 py-1.5 rounded-xl glass-button text-xs font-semibold text-slate-200 hover:text-white"
                  >
                    Browse Equipment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Collegiate Matches Spotlight */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Featured Campus Match</h2>
            <p className="text-xs text-slate-400">Upcoming tournaments and derby fixtures</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('match-passes')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            All matches ({matches.length}) &rarr;
          </button>
        </div>

        {matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.slice(0, 2).map((match) => (
              <div
                key={match.id}
                className="glass-card-interactive rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30 uppercase tracking-wider">
                      {match.sport}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {match.date} &bull; {match.time}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{match.title}</h3>

                  <div className="my-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-around text-center text-xs font-semibold text-white">
                    <span className="truncate">{match.teamA}</span>
                    <span className="text-[10px] font-extrabold text-cyan-300 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">
                      VS
                    </span>
                    <span className="truncate">{match.teamB}</span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Venue: <strong className="text-slate-200">{match.venue}</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.08]">
                  <span className="text-xs text-emerald-400 font-semibold">
                    {match.remainingPasses} student passes left
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (match.isClaimed) {
                        setActiveTab('match-passes')
                      } else {
                        onClaimPass?.(match.id)
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      match.isClaimed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'glass-button-primary text-white'
                    }`}
                  >
                    {match.isClaimed ? 'Pass Claimed ✓' : 'Get Free Pass'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
