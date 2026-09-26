import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function MatchPassesSection({
  matches = [],
  onClaimPass,
}) {
  const { user } = useAuth()
  const [activeTicket, setActiveTicket] = useState(null)
  const [claimSuccess, setClaimSuccess] = useState('')

  const studentName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student Athlete'

  const handleClaim = (match) => {
    onClaimPass(match.id)
    setActiveTicket(match)
    setClaimSuccess(`Match pass claimed for ${match.title}! Your digital ticket is ready.`)
  }

  return (
    <div className="space-y-6">
      {/* Claim Notification Banner */}
      {claimSuccess && (
        <div className="p-4 rounded-2xl glass-card border border-emerald-400/40 bg-emerald-500/10 text-xs text-emerald-100 font-medium flex items-center justify-between shadow-xl">
          <span>{claimSuccess}</span>
          <button
            type="button"
            onClick={() => setClaimSuccess('')}
            className="text-xs text-emerald-300 hover:text-white font-bold ml-2 p-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
            Campus Athletic Fixtures
          </span>
          <h2 className="text-sm font-bold text-white tracking-tight mt-0.5">
            Collegiate Tournament &amp; Derby Match Passes
          </h2>
          <p className="text-xs text-slate-400">
            Complimentary student admissions for varsity championships and inter-hostel league finals
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.05] px-3.5 py-2 rounded-2xl border border-white/10 text-xs text-slate-300 backdrop-blur-md">
          <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>1 Free Pass per Student ID for each tournament</span>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {matches.map((match) => {
          const availabilityPercent = Math.round((match.remainingPasses / match.totalPasses) * 100)

          return (
            <div
              key={match.id}
              className="glass-card-interactive rounded-2xl border border-white/10 shadow-lg p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 uppercase tracking-wider">
                    {match.sport}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {match.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{match.title}</h3>

                {/* Team Matchup Capsule */}
                <div className="my-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-center">
                  <div className="flex-1 text-center font-bold text-xs text-white truncate">
                    {match.teamA}
                  </div>
                  <div className="px-3 py-0.5 bg-blue-600/30 text-cyan-300 rounded-full text-[10px] font-extrabold uppercase mx-2 border border-blue-400/30 shadow-inner">
                    VS
                  </div>
                  <div className="flex-1 text-center font-bold text-xs text-white truncate">
                    {match.teamB}
                  </div>
                </div>

                {/* Match Logistics */}
                <div className="text-xs text-slate-300 space-y-1.5 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      <strong className="text-white">{match.date}</strong> at{' '}
                      <strong className="text-cyan-300">{match.time}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>Venue: <strong className="text-slate-200">{match.venue}</strong> ({match.gate})</span>
                  </div>
                </div>

                {/* Pass Availability Meter */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Remaining Passes</span>
                    <span className="font-semibold text-slate-200">
                      {match.remainingPasses} of {match.totalPasses} Available
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        availabilityPercent < 25
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                      }`}
                      style={{ width: `${availabilityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Free Student Entry</span>
                {match.isClaimed ? (
                  <button
                    type="button"
                    onClick={() => setActiveTicket(match)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                  >
                    <span>View Ticket ✓</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaim(match)}
                    className="px-4 py-1.5 rounded-xl glass-button-primary text-white text-xs font-bold shadow-lg"
                  >
                    Claim Pass
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Digital Ticket Modal View (Apple Wallet Style Liquid Glass Ticket) */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel rounded-3xl max-w-md w-full border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
            {/* Soft ticket illumination */}
            <div className="absolute top-0 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Ticket Header */}
            <div className="p-6 pb-4 border-b border-white/10 text-center relative z-10">
              <button
                type="button"
                onClick={() => setActiveTicket(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full glass-button flex items-center justify-center text-slate-300 hover:text-white text-sm"
                aria-label="Close ticket"
              >
                &times;
              </button>
              <div className="inline-block text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 mb-2">
                Student Athlete Event Pass
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{activeTicket.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{activeTicket.sport} &bull; {activeTicket.venue}</p>
            </div>

            {/* Ticket Body */}
            <div className="p-6 space-y-4 relative z-10">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="flex items-center justify-center gap-3 font-bold text-sm text-white">
                  <span>{activeTicket.teamA}</span>
                  <span className="text-[10px] font-extrabold text-cyan-300 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">
                    VS
                  </span>
                  <span>{activeTicket.teamB}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl border border-white/10 bg-white/[0.03]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date &amp; Time</span>
                  <span className="font-bold text-white">{activeTicket.date}</span>
                  <span className="text-cyan-300 font-semibold block">{activeTicket.time}</span>
                </div>
                <div className="p-3 rounded-2xl border border-white/10 bg-white/[0.03]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gate / Seating</span>
                  <span className="font-bold text-white">{activeTicket.gate}</span>
                  <span className="text-emerald-400 font-semibold block">Student Tier</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-white/10 bg-white/[0.03] text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pass Holder</span>
                <span className="font-bold text-white">{studentName}</span>
                <span className="text-[11px] text-slate-400 block font-mono">Verified College Athlete ID: STU-2026-8491</span>
              </div>

              {/* Barcode & Pass ID Graphic */}
              <div className="text-center pt-3 border-t border-dashed border-white/15">
                <div className="font-mono text-xs tracking-widest text-cyan-300 font-bold mb-2">
                  ID: PASS-{activeTicket.id}-2026
                </div>
                {/* SVG Mock Barcode with clean reflection */}
                <div className="h-10 flex items-center justify-center gap-1 overflow-hidden my-2 bg-white/[0.08] p-1.5 rounded-xl border border-white/10">
                  {[4, 2, 6, 1, 8, 3, 2, 7, 5, 2, 4, 1, 6, 3, 5, 2, 8, 4, 3, 5, 2, 6, 1].map((w, i) => (
                    <div
                      key={i}
                      className="bg-white h-7 opacity-90 rounded-[1px]"
                      style={{ width: `${w * 2}px` }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Scan at {activeTicket.gate} entrance with college sports ID
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white/[0.03] border-t border-white/10 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  window.print()
                }}
                className="px-4 py-2 rounded-xl glass-button-primary text-white text-xs font-bold shadow-md"
              >
                Print / Save Pass
              </button>
              <button
                type="button"
                onClick={() => setActiveTicket(null)}
                className="px-3.5 py-2 rounded-xl glass-button text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
