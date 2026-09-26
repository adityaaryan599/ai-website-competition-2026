import { useState, useMemo } from 'react'

export default function StudentTable({
  students = [],
  onToggleStudentStatus,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sportFilter, setSportFilter] = useState('All')
  const [viewingStudent, setViewingStudent] = useState(null)
  const [actionNotice, setActionNotice] = useState('')

  const sports = useMemo(() => ['All', ...new Set(students.map((s) => s.sport))], [students])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'All' || s.accountStatus === statusFilter
      const matchesSport = sportFilter === 'All' || s.sport === sportFilter

      return matchesSearch && matchesStatus && matchesSport
    })
  }, [students, searchTerm, statusFilter, sportFilter])

  const triggerNotice = (msg) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3000)
  }

  const handleToggle = (student) => {
    const newStatus = student.accountStatus === 'Active' ? 'Suspended' : 'Active'
    onToggleStudentStatus(student.id, newStatus)
    triggerNotice(`Account for ${student.name} set to ${newStatus}.`)
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
              Student Athlete Directory
            </h2>
            <p className="text-xs text-slate-400">
              Manage student portal permissions, active ground loans, and account standing
            </p>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold self-start sm:self-auto">
            {filteredStudents.length} athletes listed
          </span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, or dept..."
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
              <option value="All" className="bg-slate-900 text-slate-200">All Account Statuses</option>
              <option value="Active" className="bg-slate-900 text-slate-200">Active Athletes</option>
              <option value="Suspended" className="bg-slate-900 text-slate-200">Suspended Accounts</option>
            </select>
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

      {/* Students Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-300">
                <th className="py-3.5 px-4 font-semibold">Student Athlete</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Primary Sport</th>
                <th className="py-3.5 px-4 font-semibold text-center">Active Bookings</th>
                <th className="py-3.5 px-4 font-semibold text-center">Borrowed Items</th>
                <th className="py-3.5 px-4 font-semibold">Account Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    No student athletes found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const isActive = s.accountStatus === 'Active'

                  return (
                    <tr key={s.id} className="hover:bg-white/[0.03] transition group">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-[10px] text-slate-400">{s.email} • {s.studentId}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {s.department}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          {s.sport}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-white">
                        {s.activeBookings}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-white">
                        {s.borrowedEquipment}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-red-500/15 text-red-300 border-red-500/30'
                          }`}
                        >
                          {s.accountStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingStudent(s)}
                            className="px-2.5 py-1 rounded-lg glass-button text-[11px] text-slate-300 hover:text-white"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggle(s)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                              isActive
                                ? 'bg-red-500/15 text-red-300 hover:bg-red-500/25 border-red-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border-emerald-500/30'
                            }`}
                          >
                            {isActive ? 'Suspend' : 'Activate'}
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

      {/* Student Details Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-white/15">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Athlete Profile Record</h3>
                <p className="text-xs text-slate-400">{viewingStudent.studentId}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                  {viewingStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{viewingStudent.name}</h4>
                  <p className="text-slate-400">{viewingStudent.email}</p>
                  <p className="text-[11px] text-cyan-300">{viewingStudent.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Reservations</span>
                  <span className="text-base font-bold text-white mt-1 block">
                    {viewingStudent.activeBookings} Grounds
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Equipment On Loan</span>
                  <span className="text-base font-bold text-white mt-1 block">
                    {viewingStudent.borrowedEquipment} Items
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Standing</span>
                  <span className={viewingStudent.accountStatus === 'Active' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                    {viewingStudent.accountStatus === 'Active' ? 'Good Standing (Full Booking Rights)' : 'Suspended (Restricted)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleToggle(viewingStudent)
                    setViewingStudent((prev) => ({
                      ...prev,
                      accountStatus: prev.accountStatus === 'Active' ? 'Suspended' : 'Active',
                    }))
                  }}
                  className="px-3 py-1.5 rounded-lg glass-button text-xs font-medium text-slate-200"
                >
                  {viewingStudent.accountStatus === 'Active' ? 'Suspend' : 'Reinstate'}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="glass-button px-4 py-2 rounded-xl text-white font-medium text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
