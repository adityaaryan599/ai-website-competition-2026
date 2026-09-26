import { useState } from 'react'

export default function MyBookingsSection({
  groundBookings = [],
  equipmentBorrowings = [],
  onCancelBooking,
  onReturnEquipment,
  setActiveTab,
}) {
  const [subTab, setSubTab] = useState('grounds')
  const [actionNotice, setActionNotice] = useState('')

  const handleCancel = (bookingId) => {
    onCancelBooking(bookingId)
    setActionNotice(`Ground booking ${bookingId} has been cancelled.`)
    setTimeout(() => setActionNotice(''), 4000)
  }

  const handleReturn = (borrowId) => {
    onReturnEquipment(borrowId)
    setActionNotice(`Equipment checkout ${borrowId} marked as returned. Inventory updated.`)
    setTimeout(() => setActionNotice(''), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-4 rounded-2xl glass-card border border-blue-400/30 bg-blue-500/10 text-xs font-medium text-blue-200 flex items-center justify-between shadow-lg">
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice('')}
            className="text-xs text-blue-300 hover:text-white font-bold ml-2 p-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Tabs Header */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">My Activity &amp; Records</h2>
          <p className="text-xs text-slate-400">Track and manage campus facility reservations and gear checkouts</p>
        </div>

        {/* Sub-tab Switcher in Glass Capsule */}
        <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-2xl border border-white/10 backdrop-blur-md self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSubTab('grounds')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              subTab === 'grounds'
                ? 'bg-white/[0.14] text-white border border-white/20 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Grounds ({groundBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('equipment')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              subTab === 'equipment'
                ? 'bg-white/[0.14] text-white border border-white/20 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Equipment ({equipmentBorrowings.length})
          </button>
        </div>
      </div>

      {/* Ground Reservations Tab */}
      {subTab === 'grounds' && (
        <div className="space-y-4">
          {groundBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groundBookings.map((booking) => {
                const isConfirmed = booking.status === 'Confirmed'
                const isPending = booking.status === 'Pending Approval'
                const isCancelled = booking.status === 'Cancelled'

                return (
                  <div
                    key={booking.id}
                    className="glass-card-interactive rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.08] text-cyan-300 font-bold border border-white/10">
                          {booking.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${
                            isConfirmed
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                              : 'bg-white/[0.06] text-slate-400 border-white/10'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-0.5">
                        {booking.groundName}
                      </h3>
                      <p className="text-xs text-cyan-300 font-semibold mb-3">
                        {booking.sport} &bull; {booking.duration}
                      </p>

                      <div className="text-xs text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/10 space-y-1.5 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Date:</span>
                          <strong className="text-white">{booking.date}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Time Slot:</span>
                          <strong className="text-cyan-300 font-mono">{booking.timeSlot}</strong>
                        </div>
                        {booking.purpose && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Notes:</span>
                            <span className="text-slate-300 italic truncate max-w-[200px]">
                              {booking.purpose}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {isConfirmed ? 'Entry pass ready' : isCancelled ? 'Reservation void' : 'Under review'}
                      </span>
                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => handleCancel(booking.id)}
                          className="px-3.5 py-1.5 rounded-xl glass-button text-xs font-semibold text-slate-300 hover:text-red-300 hover:border-red-400/40"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center border border-white/10 shadow-xl">
              <p className="text-sm font-semibold text-white">No Ground Reservations Found</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                You have not booked any sports courts or turfs yet.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('book-ground')}
                className="px-4 py-2.5 rounded-xl glass-button-primary text-white text-xs font-bold shadow-md"
              >
                Book a Ground Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Equipment Loans Tab */}
      {subTab === 'equipment' && (
        <div className="space-y-4">
          {equipmentBorrowings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipmentBorrowings.map((borrow) => {
                const isActive = borrow.status === 'Active'

                return (
                  <div
                    key={borrow.id}
                    className="glass-card-interactive rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.08] text-cyan-300 font-bold border border-white/10">
                          {borrow.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                              : 'bg-white/[0.06] text-slate-400 border-white/10'
                          }`}
                        >
                          {borrow.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-0.5">
                        {borrow.itemName}
                      </h3>
                      <p className="text-xs text-cyan-300 font-semibold mb-3">
                        Quantity: {borrow.quantity} &bull; {borrow.sport}
                      </p>

                      <div className="text-xs text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/10 space-y-1.5 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Borrowed:</span>
                          <span className="text-white">{borrow.borrowedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Return Deadline:</span>
                          <strong className={isActive ? 'text-amber-300 font-semibold' : 'text-slate-400'}>
                            {borrow.dueDate}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Checkout Condition:</span>
                          <span className="text-slate-200">{borrow.conditionOnBorrow || 'Good'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {isActive ? 'In Athlete Custody' : 'Returned & Restocked'}
                      </span>
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => handleReturn(borrow.id)}
                          className="px-3.5 py-1.5 rounded-xl glass-button-primary text-white text-xs font-bold shadow-md"
                        >
                          Return Gear
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center border border-white/10 shadow-xl">
              <p className="text-sm font-semibold text-white">No Equipment Currently Borrowed</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                You do not have any sports gear checked out.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('equipment')}
                className="px-4 py-2.5 rounded-xl glass-button-primary text-white text-xs font-bold shadow-md"
              >
                Borrow Equipment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
