import { useState, useMemo } from 'react'

export default function DamageTable({
  damagedList = [],
  onUpdateFee,
  onResolveDamage,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('All')

  // Modals state
  const [feeModalItem, setFeeModalItem] = useState(null)
  const [newFee, setNewFee] = useState(0)
  const [reviewModalItem, setReviewModalItem] = useState(null)
  const [actionNotice, setActionNotice] = useState('')

  const filteredItems = useMemo(() => {
    return damagedList.filter((item) => {
      const matchesSearch =
        item.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      const matchesSeverity = severityFilter === 'All' || item.damageSeverity === severityFilter

      return matchesSearch && matchesStatus && matchesSeverity
    })
  }, [damagedList, searchTerm, statusFilter, severityFilter])

  const triggerNotice = (msg) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3000)
  }

  const handleFeeSubmit = (e) => {
    e.preventDefault()
    if (!feeModalItem) return

    onUpdateFee(feeModalItem.id, Number(newFee))
    setFeeModalItem(null)
    triggerNotice(`Assessment fee for ${feeModalItem.equipment} updated to $${newFee}.`)
  }

  const handleResolve = (id, eq) => {
    onResolveDamage(id)
    triggerNotice(`Damage case for ${eq} marked resolved.`)
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
              Damaged Equipment & Incident Log
            </h2>
            <p className="text-xs text-slate-400">
              Review wear defects, assign repair assessments, and resolve student liability claims
            </p>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold self-start sm:self-auto">
            {filteredItems.length} incidents logged
          </span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gear or student..."
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
              <option value="All" className="bg-slate-900 text-slate-200">All Incident Statuses</option>
              <option value="Under Review" className="bg-slate-900 text-slate-200">Under Review</option>
              <option value="Fee Pending" className="bg-slate-900 text-slate-200">Fee Pending</option>
              <option value="Fee Paid" className="bg-slate-900 text-slate-200">Fee Paid</option>
              <option value="Resolved" className="bg-slate-900 text-slate-200">Resolved</option>
            </select>
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Severities</option>
              <option value="Minor" className="bg-slate-900 text-slate-200">Minor</option>
              <option value="Moderate" className="bg-slate-900 text-slate-200">Moderate</option>
              <option value="Severe" className="bg-slate-900 text-slate-200">Severe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-300">
                <th className="py-3.5 px-4 font-semibold">Incident ID</th>
                <th className="py-3.5 px-4 font-semibold">Equipment Item</th>
                <th className="py-3.5 px-4 font-semibold">Student Responsible</th>
                <th className="py-3.5 px-4 font-semibold">Dates (Loan / Return)</th>
                <th className="py-3.5 px-4 font-semibold">Damage Description</th>
                <th className="py-3.5 px-4 font-semibold text-center">Severity</th>
                <th className="py-3.5 px-4 font-semibold text-center">Fee ($)</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-slate-400">
                    No damaged equipment incidents match your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isSevere = item.damageSeverity === 'Severe'
                  const isModerate = item.damageSeverity === 'Moderate'
                  const isResolved = item.status === 'Resolved'

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.03] transition group">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-300">
                        {item.id}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-white">
                        {item.equipment}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{item.student}</div>
                        <div className="text-[10px] text-slate-400">{item.studentId}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div>Out: {item.dateBorrowed}</div>
                        <div className="text-[10px] text-slate-400">In: {item.dateReturned}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-slate-300">
                        <p className="truncate" title={item.damageDescription}>
                          {item.damageDescription}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isSevere
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : isModerate
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {item.damageSeverity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-white">
                        ${item.estimatedFee}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isResolved
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : item.status === 'Under Review'
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                              : item.status === 'Fee Pending'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setReviewModalItem(item)}
                            className="px-2 py-1 rounded-lg glass-button text-[11px] text-slate-300 hover:text-white"
                            title="Review Incident"
                          >
                            Review
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setFeeModalItem(item)
                              setNewFee(item.estimatedFee)
                            }}
                            className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-[11px]"
                            title="Set Assessment Fee"
                          >
                            Set Fee
                          </button>

                          {!isResolved && (
                            <button
                              type="button"
                              onClick={() => handleResolve(item.id, item.equipment)}
                              className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-[11px]"
                              title="Mark Resolved"
                            >
                              Resolve
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

      {/* Review Damage Modal */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-white/15">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Damage Assessment Details</h3>
                <p className="text-xs text-slate-400">{reviewModalItem.id} • {reviewModalItem.equipment}</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Borrower Details</span>
                <p className="text-white font-semibold">{reviewModalItem.student} ({reviewModalItem.studentId})</p>
                <p className="text-slate-400">Borrowed: {reviewModalItem.dateBorrowed} • Returned: {reviewModalItem.dateReturned}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Damage Description</span>
                <p className="p-3 rounded-xl glass-input text-slate-200">
                  {reviewModalItem.damageDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Severity</span>
                  <span className="text-amber-300 font-bold">{reviewModalItem.damageSeverity}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Fee</span>
                  <span className="text-cyan-300 font-bold">${reviewModalItem.estimatedFee}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setReviewModalItem(null)}
                className="glass-button px-4 py-2 rounded-xl text-white font-medium text-xs"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Fee Modal */}
      {feeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-amber-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Set Assessment Fee</h3>
                <p className="text-xs text-slate-400">{feeModalItem.equipment} ({feeModalItem.id})</p>
              </div>
              <button
                type="button"
                onClick={() => setFeeModalItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFeeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Repair & Replacement Fee ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="5"
                  required
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-lg font-bold text-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Updating this fee will notify the student and set case status to &quot;Fee Pending&quot;.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFeeModalItem(null)}
                  className="px-4 py-2 rounded-xl glass-button text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition"
                >
                  Update Fee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
