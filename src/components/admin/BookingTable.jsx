import { useState, useMemo } from 'react'

export default function BookingTable({
  bookings = [],
  onApproveBooking,
  onRejectBooking,
  onCancelBooking,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sportFilter, setSportFilter] = useState('All')
  const [groundFilter, setGroundFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [actionNotice, setActionNotice] = useState('')

  // Unique options for filter dropdowns
  const sports = useMemo(() => ['All', ...new Set(bookings.map((b) => b.sport))], [bookings])
  const grounds = useMemo(() => ['All', ...new Set(bookings.map((b) => b.ground))], [bookings])

  // Filtered dataset
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.ground.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'All' || b.status === statusFilter
      const matchesSport = sportFilter === 'All' || b.sport === sportFilter
      const matchesGround = groundFilter === 'All' || b.ground === groundFilter
      const matchesDate = !dateFilter || b.date === dateFilter

      return matchesSearch && matchesStatus && matchesSport && matchesGround && matchesDate
    })
  }, [bookings, searchTerm, statusFilter, sportFilter, groundFilter, dateFilter])

  const triggerNotice = (msg) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3000)
  }

  const handleApprove = (id, student) => {
    onApproveBooking(id)
    triggerNotice(`Reservation for ${student} approved.`)
  }

  const handleReject = (id, student) => {
    onRejectBooking(id)
    triggerNotice(`Reservation for ${student} rejected.`)
  }

  const handleCancel = (id, student) => {
    if (window.confirm(`Are you sure you want to cancel the reservation for ${student}?`)) {
      onCancelBooking(id)
      triggerNotice(`Reservation for ${student} has been cancelled.`)
    }
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('All')
    setSportFilter('All')
    setGroundFilter('All')
    setDateFilter('')
  }

  const hasActiveFilters =
    searchTerm || statusFilter !== 'All' || sportFilter !== 'All' || groundFilter !== 'All' || dateFilter

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Notice Toast */}
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

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Ground Booking Records
            </h2>
            <p className="text-xs text-slate-400">
              Review and manage student facility reservations across campus grounds
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold">
              {filteredBookings.length} of {bookings.length} reservations
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-slate-400 hover:text-cyan-300 underline transition"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-white/5">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or ID..."
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

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Statuses</option>
              <option value="Approved" className="bg-slate-900 text-slate-200">Approved</option>
              <option value="Pending" className="bg-slate-900 text-slate-200">Pending Review</option>
              <option value="Rejected" className="bg-slate-900 text-slate-200">Rejected</option>
              <option value="Cancelled" className="bg-slate-900 text-slate-200">Cancelled</option>
            </select>
          </div>

          {/* Sport Filter */}
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

          {/* Ground Filter */}
          <div>
            <select
              value={groundFilter}
              onChange={(e) => setGroundFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs cursor-pointer"
            >
              {grounds.map((g) => (
                <option key={g} value={g} className="bg-slate-900 text-slate-200">
                  {g === 'All' ? 'All Grounds' : g}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs cursor-pointer"
              title="Filter by reservation date"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table Desktop */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-300">
                <th className="py-3.5 px-4 font-semibold">Booking ID</th>
                <th className="py-3.5 px-4 font-semibold">Student Athlete</th>
                <th className="py-3.5 px-4 font-semibold">Sport</th>
                <th className="py-3.5 px-4 font-semibold">Ground / Venue</th>
                <th className="py-3.5 px-4 font-semibold">Date & Time Slot</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-semibold text-white">No ground bookings match your filter</p>
                      <p className="text-xs text-slate-400">Try loosening your search query or reset filters.</p>
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="mt-2 px-3 py-1.5 rounded-xl glass-button text-xs text-cyan-300 hover:text-white"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isApproved = b.status === 'Approved'
                  const isPending = b.status === 'Pending'
                  const isRejected = b.status === 'Rejected'
                  const isCancelled = b.status === 'Cancelled'

                  return (
                    <tr key={b.id} className="hover:bg-white/[0.03] transition group">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-300">
                        {b.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{b.studentName}</div>
                        <div className="text-[10px] text-slate-400">{b.studentEmail} • {b.studentId}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          {b.sport}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-200 font-medium">
                        {b.ground}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{b.date}</div>
                        <div className="text-[11px] text-slate-400">{b.timeSlot}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            isApproved
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : isRejected
                              ? 'bg-red-500/15 text-red-300 border-red-500/30'
                              : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Action */}
                          <button
                            type="button"
                            onClick={() => handleApprove(b.id, b.studentName)}
                            disabled={isApproved}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition disabled:opacity-30 disabled:cursor-not-allowed bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
                            title="Approve Booking"
                          >
                            Approve
                          </button>

                          {/* Reject Action */}
                          <button
                            type="button"
                            onClick={() => handleReject(b.id, b.studentName)}
                            disabled={isRejected}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition disabled:opacity-30 disabled:cursor-not-allowed bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
                            title="Reject Booking"
                          >
                            Reject
                          </button>

                          {/* Cancel Action */}
                          <button
                            type="button"
                            onClick={() => handleCancel(b.id, b.studentName)}
                            disabled={isCancelled}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition disabled:opacity-30 disabled:cursor-not-allowed bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30"
                            title="Cancel Booking"
                          >
                            Cancel
                          </button>
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
    </div>
  )
}
