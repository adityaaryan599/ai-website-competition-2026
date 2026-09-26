import { useState, useMemo } from 'react'

export default function RequestTable({
  requests = [],
  onApproveRequest,
  onRejectRequest,
  onMarkReturned,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [actionNotice, setActionNotice] = useState('')

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.equipment.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'All' || r.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [requests, searchTerm, statusFilter])

  const triggerNotice = (msg) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3000)
  }

  const handleApprove = (id, student, eq) => {
    onApproveRequest(id)
    triggerNotice(`Approved request for ${student} (${eq}).`)
  }

  const handleReject = (id, student, eq) => {
    onRejectRequest(id)
    triggerNotice(`Rejected request for ${student} (${eq}).`)
  }

  const handleReturn = (id, student, eq) => {
    onMarkReturned(id)
    triggerNotice(`Marked ${eq} returned by ${student}. Restocked into inventory.`)
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

      {/* Control Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Student Equipment Borrow Requests
            </h2>
            <p className="text-xs text-slate-400">
              Process gear checkout submissions, approve equipment loans, and track returns
            </p>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold self-start sm:self-auto">
            {filteredRequests.length} requests displayed
          </span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student, ID, or gear name..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Request Statuses</option>
              <option value="Pending" className="bg-slate-900 text-slate-200">Pending Review</option>
              <option value="Approved" className="bg-slate-900 text-slate-200">Approved</option>
              <option value="Borrowed" className="bg-slate-900 text-slate-200">Currently Borrowed</option>
              <option value="Overdue" className="bg-slate-900 text-slate-200">Overdue Returns</option>
              <option value="Returned" className="bg-slate-900 text-slate-200">Returned & Restocked</option>
              <option value="Rejected" className="bg-slate-900 text-slate-200">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-300">
                <th className="py-3.5 px-4 font-semibold">Request ID</th>
                <th className="py-3.5 px-4 font-semibold">Student Athlete</th>
                <th className="py-3.5 px-4 font-semibold">Requested Equipment</th>
                <th className="py-3.5 px-4 font-semibold text-center">Quantity</th>
                <th className="py-3.5 px-4 font-semibold">Requested Date</th>
                <th className="py-3.5 px-4 font-semibold">Expected Return</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400">
                    No borrow requests found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => {
                  const isPending = r.status === 'Pending'
                  const isBorrowed = r.status === 'Borrowed' || r.status === 'Approved'
                  const isOverdue = r.status === 'Overdue'
                  const isReturned = r.status === 'Returned'

                  return (
                    <tr key={r.id} className="hover:bg-white/[0.03] transition group">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-300">
                        {r.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{r.studentName}</div>
                        <div className="text-[10px] text-slate-400">{r.studentId}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        {r.equipment}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-200">
                        {r.quantity}x
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {r.requestedDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={isOverdue ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                          {r.expectedReturn}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            r.status === 'Returned'
                              ? 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                              : isPending
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : isOverdue
                              ? 'bg-red-500/15 text-red-300 border-red-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(r.id, r.studentName, r.equipment)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(r.id, r.studentName, r.equipment)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {(isBorrowed || isOverdue) && (
                            <button
                              type="button"
                              onClick={() => handleReturn(r.id, r.studentName, r.equipment)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30 transition"
                            >
                              Mark Returned
                            </button>
                          )}

                          {isReturned && (
                            <span className="text-[10px] text-slate-500 italic">Archived</span>
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
    </div>
  )
}
