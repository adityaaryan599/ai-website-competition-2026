import { useState } from 'react'

export default function EquipmentSection({
  equipmentList = [],
  onBorrowEquipment,
  setActiveTab,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [quantities, setQuantities] = useState({})
  const [borrowSuccess, setBorrowSuccess] = useState(null)

  const categories = ['All', 'Ball Sports', 'Racket & Bat Sports', 'Training Gear']

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getQuantity = (id) => quantities[id] || 1

  const setQuantity = (id, val, max) => {
    const num = Math.max(1, Math.min(max, parseInt(val, 10) || 1))
    setQuantities((prev) => ({ ...prev, [id]: num }))
  }

  const handleBorrow = (item) => {
    const qty = getQuantity(item.id)
    if (qty > item.availableQty) return

    const newBorrowId = `EQ-${Math.floor(10000 + Math.random() * 90000)}`

    const dueDateObj = new Date()
    dueDateObj.setDate(dueDateObj.getDate() + (item.maxBorrowDays || 2))
    const dueDateStr = dueDateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    const newBorrowing = {
      id: newBorrowId,
      equipmentId: item.id,
      itemName: item.name,
      sport: item.sport,
      quantity: qty,
      borrowedDate: 'Today, ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      dueDate: dueDateStr,
      status: 'Active',
      conditionOnBorrow: item.condition,
    }

    onBorrowEquipment(newBorrowing, item.id, qty)

    setBorrowSuccess({
      ...newBorrowing,
    })

    setQuantities((prev) => ({ ...prev, [item.id]: 1 }))
  }

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {borrowSuccess && (
        <div className="p-5 rounded-2xl glass-card border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold text-base flex-shrink-0 mt-0.5 shadow-inner">
              ✓
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Equipment Borrowed Successfully!
              </h3>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Borrow ID: <strong className="font-mono text-white">{borrowSuccess.id}</strong> &bull;{' '}
                {borrowSuccess.quantity}x {borrowSuccess.itemName}. Return due by{' '}
                <strong className="text-white">{borrowSuccess.dueDate}</strong>.
              </p>
              <p className="text-[11px] text-emerald-300/80 mt-1 italic">
                Checkout simulated in current session. Inventory stock updated.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setActiveTab('my-bookings')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/80 text-white text-xs font-semibold hover:bg-emerald-600 border border-emerald-400/40 shadow-sm transition"
            >
              View My Loans &rarr;
            </button>
            <button
              type="button"
              onClick={() => setBorrowSuccess(null)}
              className="px-2.5 py-1.5 rounded-xl glass-button text-xs text-slate-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header, Search & Filter Bar */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Campus Sports Equipment Locker</h2>
          <p className="text-xs text-slate-400">
            Select gear for team training, friendly games, or collegiate competitions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter Pills in Glass Capsule */}
          <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-white/[0.14] text-white border border-white/20 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gear or sport..."
              className="glass-input pl-8 pr-3 py-1.5 rounded-xl text-xs w-44 sm:w-56"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-2.5 top-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredEquipment.map((item) => {
          const qty = getQuantity(item.id)
          const isOutOfStock = item.availableQty === 0
          const percentage = Math.round((item.availableQty / item.totalQty) * 100)

          return (
            <div
              key={item.id}
              className="glass-card-interactive rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-cyan-300 border border-blue-400/30 uppercase">
                    {item.sport}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm ${
                      isOutOfStock
                        ? 'bg-red-500/20 text-red-300 border-red-400/30'
                        : item.availableQty < 5
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    }`}
                  >
                    {isOutOfStock ? 'Out of Stock' : `${item.availableQty} Available`}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white mb-1 leading-snug">
                  {item.name}
                </h3>
                <p className="text-[11px] text-slate-400 mb-3">{item.brand}</p>

                {/* Layered Stock Meter */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-medium">
                    <span>Stock Level</span>
                    <span className="text-slate-200">
                      {item.availableQty} / {item.totalQty} Units
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isOutOfStock
                          ? 'bg-red-500'
                          : percentage < 40
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-white/[0.03] p-2.5 rounded-xl border border-white/10 mb-4 space-y-1">
                  <div className="flex justify-between">
                    <span>Condition:</span>
                    <strong className="text-slate-200">{item.condition}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Borrow:</span>
                    <strong className="text-slate-200">{item.maxBorrowDays} Days</strong>
                  </div>
                </div>
              </div>

              {/* Actions & Stepper */}
              <div className="pt-3 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 mb-2.5">
                  <label htmlFor={`qty-${item.id}`} className="text-xs text-slate-400 font-medium">
                    Qty:
                  </label>
                  <div className="flex items-center border border-white/15 rounded-xl overflow-hidden bg-white/[0.04]">
                    <button
                      type="button"
                      disabled={isOutOfStock || qty <= 1}
                      onClick={() => setQuantity(item.id, qty - 1, item.availableQty)}
                      className="px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-30 transition"
                    >
                      -
                    </button>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min="1"
                      max={item.availableQty}
                      value={qty}
                      disabled={isOutOfStock}
                      onChange={(e) => setQuantity(item.id, e.target.value, item.availableQty)}
                      className="w-10 text-center text-xs font-bold bg-transparent text-white border-x border-white/10 py-1 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={isOutOfStock || qty >= item.availableQty}
                      onClick={() => setQuantity(item.id, qty + 1, item.availableQty)}
                      className="px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-30 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => handleBorrow(item)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-md ${
                    isOutOfStock
                      ? 'bg-white/[0.04] text-slate-500 border border-white/5 cursor-not-allowed'
                      : 'glass-button-primary text-white shadow-blue-600/30'
                  }`}
                >
                  {isOutOfStock ? 'Unavailable' : `Borrow (${qty} ${qty > 1 ? 'Units' : 'Unit'})`}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
