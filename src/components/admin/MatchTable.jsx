import { useState, useMemo } from 'react'

export default function MatchTable({
  matches = [],
  onAddMatch,
  onEditMatch,
  onCancelMatch,
  setActiveTab,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sportFilter, setSportFilter] = useState('All')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingMatch, setEditingMatch] = useState(null)
  const [actionNotice, setActionNotice] = useState('')

  // New match form state
  const [newMatch, setNewMatch] = useState({
    sport: 'Football',
    teams: '',
    tournament: 'Campus Inter-Department Cup 2026',
    date: '2026-10-05',
    time: '04:30 PM',
    venue: 'Main Football Turf',
  })

  const sports = useMemo(() => ['All', ...new Set(matches.map((m) => m.sport))], [matches])

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchesSearch =
        m.teams.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.tournament.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSport = sportFilter === 'All' || m.sport === sportFilter
      return matchesSearch && matchesSport
    })
  }, [matches, searchTerm, sportFilter])

  const triggerNotice = (msg) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3000)
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newMatch.teams.trim()) return

    const created = {
      id: `M-${Date.now().toString().slice(-4)}`,
      sport: newMatch.sport,
      teams: newMatch.teams.trim(),
      tournament: newMatch.tournament.trim(),
      date: newMatch.date,
      time: newMatch.time,
      venue: newMatch.venue,
      status: 'Scheduled',
    }

    onAddMatch(created)
    setIsAddModalOpen(false)
    setNewMatch({
      sport: 'Football',
      teams: '',
      tournament: 'Campus Inter-Department Cup 2026',
      date: '2026-10-05',
      time: '04:30 PM',
      venue: 'Main Football Turf',
    })
    triggerNotice(`Added match fixture: ${created.teams}.`)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (!editingMatch) return

    onEditMatch(editingMatch)
    setEditingMatch(null)
    triggerNotice(`Updated fixture for ${editingMatch.teams}.`)
  }

  const handleCancel = (match) => {
    if (window.confirm(`Are you sure you want to cancel the match fixture: "${match.teams}"?`)) {
      onCancelMatch(match.id)
      triggerNotice(`Fixture "${match.teams}" has been cancelled.`)
    }
  }

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

      {/* Header and Filter Controls */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Campus Sports Fixtures & Tournaments
            </h2>
            <p className="text-xs text-slate-400">
              Schedule official varsity fixtures, assign grounds, and configure campus tournaments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('fixtures')}
              className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>⚡ AI Bracket Generator</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="glass-button-primary px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <span>+ Add Match</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teams, venue, or tournament..."
              className="w-full pl-8 pr-3 py-2 rounded-xl glass-input text-xs"
            />
            <svg
              className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs cursor-pointer"
            >
              {sports.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-slate-200">
                  {s === 'All' ? 'All Sports' : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matches Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-300">
                <th className="py-3.5 px-4 font-semibold">Sport</th>
                <th className="py-3.5 px-4 font-semibold">Match / Competing Teams</th>
                <th className="py-3.5 px-4 font-semibold">Tournament</th>
                <th className="py-3.5 px-4 font-semibold">Date & Kickoff</th>
                <th className="py-3.5 px-4 font-semibold">Venue / Ground</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    No sports fixtures found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredMatches.map((m) => {
                  const isCompleted = m.status === 'Completed'
                  const isCancelled = m.status === 'Cancelled'

                  return (
                    <tr key={m.id} className="hover:bg-white/[0.03] transition group">
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          {m.sport}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{m.teams}</div>
                        <span className="font-mono text-[10px] text-slate-400">{m.id}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {m.tournament}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-white font-medium">{m.date}</div>
                        <div className="text-[11px] text-slate-400">{m.time}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-200">
                        {m.venue}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isCompleted
                              ? 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                              : isCancelled
                              ? 'bg-red-500/15 text-red-300 border-red-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingMatch({ ...m })}
                            className="px-2.5 py-1 rounded-lg glass-button text-[11px] text-slate-300 hover:text-white"
                          >
                            Edit
                          </button>

                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => handleCancel(m)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 text-[11px]"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Match Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-white/15">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white tracking-tight">Schedule New Match</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Sport</label>
                <select
                  value={newMatch.sport}
                  onChange={(e) => setNewMatch({ ...newMatch, sport: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input cursor-pointer"
                >
                  <option value="Football" className="bg-slate-900">Football</option>
                  <option value="Basketball" className="bg-slate-900">Basketball</option>
                  <option value="Cricket" className="bg-slate-900">Cricket</option>
                  <option value="Volleyball" className="bg-slate-900">Volleyball</option>
                  <option value="Badminton" className="bg-slate-900">Badminton</option>
                  <option value="Tennis" className="bg-slate-900">Tennis</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Competing Teams (e.g. CS FC vs Mech Tigers)</label>
                <input
                  type="text"
                  required
                  placeholder="Team A vs Team B"
                  value={newMatch.teams}
                  onChange={(e) => setNewMatch({ ...newMatch, teams: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Tournament / Event Name</label>
                <input
                  type="text"
                  required
                  value={newMatch.tournament}
                  onChange={(e) => setNewMatch({ ...newMatch, tournament: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    required
                    value={newMatch.date}
                    onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Kickoff Time</label>
                  <input
                    type="text"
                    required
                    placeholder="04:30 PM"
                    value={newMatch.time}
                    onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Venue / Ground</label>
                <input
                  type="text"
                  required
                  value={newMatch.venue}
                  onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-button text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-button-primary px-5 py-2 rounded-xl text-white font-semibold"
                >
                  Schedule Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Match Modal */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-white/15">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white tracking-tight">Edit Match Fixture</h3>
              <button
                type="button"
                onClick={() => setEditingMatch(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Competing Teams</label>
                <input
                  type="text"
                  required
                  value={editingMatch.teams}
                  onChange={(e) => setEditingMatch({ ...editingMatch, teams: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    required
                    value={editingMatch.date}
                    onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Time</label>
                  <input
                    type="text"
                    required
                    value={editingMatch.time}
                    onChange={(e) => setEditingMatch({ ...editingMatch, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Venue</label>
                <input
                  type="text"
                  required
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({ ...editingMatch, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Status</label>
                <select
                  value={editingMatch.status}
                  onChange={(e) => setEditingMatch({ ...editingMatch, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input cursor-pointer"
                >
                  <option value="Scheduled" className="bg-slate-900">Scheduled</option>
                  <option value="Completed" className="bg-slate-900">Completed</option>
                  <option value="Cancelled" className="bg-slate-900">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMatch(null)}
                  className="px-4 py-2 rounded-xl glass-button text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-button-primary px-5 py-2 rounded-xl text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
