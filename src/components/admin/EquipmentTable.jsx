import { useState, useMemo } from 'react'

export default function EquipmentTable({
  equipmentList = [],
  onAddEquipment,
  onEditEquipment,
  onUpdateQuantity,
  onMarkDamaged,
  onRemoveEquipment,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [damageTargetItem, setDamageTargetItem] = useState(null)
  const [damageQty, setDamageQty] = useState(1)
  const [damageNote, setDamageNote] = useState('')
  const [actionNotice, setActionNotice] = useState('')

  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Ball Sports',
    sport: 'Football',
    totalQty: 10,
    condition: 'Good',
  })

  const categories = useMemo(
    () => ['All', ...new Set(equipmentList.map((e) => e.category))],
    [equipmentList]
  )

  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sport.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [equipmentList, searchTerm, categoryFilter, statusFilter])

  const triggerNotice = (msg) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3000)
  }

  // Handle Add Item Submit
  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newItem.name.trim()) return

    const qty = Number(newItem.totalQty) || 1
    const createdItem = {
      id: `EQ-${Date.now().toString().slice(-4)}`,
      name: newItem.name.trim(),
      category: newItem.category,
      sport: newItem.sport,
      totalQty: qty,
      availableQty: qty,
      borrowedQty: 0,
      damagedQty: 0,
      condition: newItem.condition,
      status: 'In Stock',
    }

    onAddEquipment(createdItem)
    setIsAddModalOpen(false)
    setNewItem({
      name: '',
      category: 'Ball Sports',
      sport: 'Football',
      totalQty: 10,
      condition: 'Good',
    })
    triggerNotice(`Added "${createdItem.name}" to campus inventory.`)
  }

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (!editingItem) return

    onEditEquipment(editingItem)
    setEditingItem(null)
    triggerNotice(`Updated details for "${editingItem.name}".`)
  }

  // Handle Mark Damaged Submit
  const handleDamageSubmit = (e) => {
    e.preventDefault()
    if (!damageTargetItem) return

    const qty = Math.min(Number(damageQty) || 1, damageTargetItem.availableQty)
    onMarkDamaged(damageTargetItem.id, qty, damageNote)
    setDamageTargetItem(null)
    setDamageQty(1)
    setDamageNote('')
    triggerNotice(`Marked ${qty} unit(s) of "${damageTargetItem.name}" as damaged.`)
  }

  // Handle Remove Item
  const handleRemove = (item) => {
    if (window.confirm(`Are you sure you want to remove "${item.name}" from inventory?`)) {
      onRemoveEquipment(item.id)
      triggerNotice(`Removed "${item.name}" from inventory.`)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Toast Notice */}
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

      {/* Header & Controls */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Athletic Gear & Equipment Stock
            </h2>
            <p className="text-xs text-slate-400">
              Manage inventory levels, conditions, wear reports, and item circulation
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="glass-button-primary px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Equipment</span>
          </button>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gear name or sport..."
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

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Stock Statuses</option>
              <option value="In Stock" className="bg-slate-900 text-slate-200">In Stock</option>
              <option value="Low Stock" className="bg-slate-900 text-slate-200">Low Stock</option>
              <option value="Out of Stock" className="bg-slate-900 text-slate-200">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-300">
                <th className="py-3.5 px-4 font-semibold">Equipment Item</th>
                <th className="py-3.5 px-4 font-semibold">Category / Sport</th>
                <th className="py-3.5 px-4 font-semibold text-center">Total</th>
                <th className="py-3.5 px-4 font-semibold text-center">Available</th>
                <th className="py-3.5 px-4 font-semibold text-center">Borrowed</th>
                <th className="py-3.5 px-4 font-semibold text-center">Damaged</th>
                <th className="py-3.5 px-4 font-semibold">Condition</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-slate-400">
                    No equipment found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((item) => {
                  const isLow = item.availableQty <= 3 && item.availableQty > 0
                  const isOut = item.availableQty === 0

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.03] transition group">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span>{item.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{item.category}</div>
                        <div className="text-[10px] text-cyan-400">{item.sport}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-200">
                        {item.totalQty}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`font-bold ${isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {item.availableQty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-semibold text-blue-300">
                        {item.borrowedQty}
                      </td>

                      <td className="py-3.5 px-4 text-center font-semibold text-amber-300">
                        {item.damagedQty}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-300 font-medium">
                          {item.condition}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isOut
                              ? 'bg-red-500/15 text-red-300 border-red-500/30'
                              : isLow
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Qty Plus/Minus */}
                          <div className="flex items-center glass-card rounded-lg p-0.5 border border-white/10 mr-1">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              disabled={item.availableQty <= 0}
                              className="px-1.5 py-0.5 text-slate-300 hover:text-white disabled:opacity-30 text-xs"
                              title="Decrease available stock"
                            >
                              -
                            </button>
                            <span className="px-1 text-[10px] text-slate-400 font-mono">Qty</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="px-1.5 py-0.5 text-slate-300 hover:text-white text-xs"
                              title="Increase available stock"
                            >
                              +
                            </button>
                          </div>

                          {/* Edit Item */}
                          <button
                            type="button"
                            onClick={() => setEditingItem({ ...item })}
                            className="p-1 rounded-lg glass-button text-slate-300 hover:text-cyan-300 text-xs"
                            title="Edit Equipment Details"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          {/* Mark Damaged */}
                          <button
                            type="button"
                            onClick={() => {
                              setDamageTargetItem(item)
                              setDamageQty(1)
                              setDamageNote('')
                            }}
                            disabled={item.availableQty <= 0}
                            className="p-1 rounded-lg glass-button text-amber-400 hover:text-amber-300 disabled:opacity-30 text-xs"
                            title="Mark Units Damaged"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </button>

                          {/* Remove Item */}
                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="p-1 rounded-lg glass-button text-slate-400 hover:text-red-400 text-xs"
                            title="Remove from Inventory"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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

      {/* Add Equipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-white/15">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white tracking-tight">Add New Equipment</h3>
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
                <label className="block text-slate-300 mb-1 font-medium">Equipment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Volleyball Pro-Match"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input cursor-pointer"
                  >
                    <option value="Ball Sports" className="bg-slate-900">Ball Sports</option>
                    <option value="Bat & Ball" className="bg-slate-900">Bat & Ball</option>
                    <option value="Racquet Sports" className="bg-slate-900">Racquet Sports</option>
                    <option value="Training Gear" className="bg-slate-900">Training Gear</option>
                    <option value="Protective Gear" className="bg-slate-900">Protective Gear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Associated Sport</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Football"
                    value={newItem.sport}
                    onChange={(e) => setNewItem({ ...newItem, sport: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Initial Total Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={newItem.totalQty}
                    onChange={(e) => setNewItem({ ...newItem, totalQty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Condition</label>
                  <select
                    value={newItem.condition}
                    onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input cursor-pointer"
                  >
                    <option value="Brand New" className="bg-slate-900">Brand New</option>
                    <option value="Excellent" className="bg-slate-900">Excellent</option>
                    <option value="Good" className="bg-slate-900">Good</option>
                    <option value="Fair" className="bg-slate-900">Fair</option>
                  </select>
                </div>
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
                  Add Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-white/15">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white tracking-tight">Edit Equipment</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <input
                    type="text"
                    required
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Condition</label>
                  <select
                    value={editingItem.condition}
                    onChange={(e) => setEditingItem({ ...editingItem, condition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input cursor-pointer"
                  >
                    <option value="Excellent" className="bg-slate-900">Excellent</option>
                    <option value="Good" className="bg-slate-900">Good</option>
                    <option value="Fair" className="bg-slate-900">Fair</option>
                    <option value="Worn" className="bg-slate-900">Worn</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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

      {/* Mark Damaged Modal */}
      {damageTargetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-amber-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Record Damaged Units</h3>
                <p className="text-xs text-slate-400">{damageTargetItem.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setDamageTargetItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDamageSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Number of Damaged Units (Max: {damageTargetItem.availableQty})
                </label>
                <input
                  type="number"
                  min="1"
                  max={damageTargetItem.availableQty}
                  value={damageQty}
                  onChange={(e) => setDamageQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Damage Notes / Incident Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe crack, puncture, tear, or structural defect..."
                  value={damageNote}
                  onChange={(e) => setDamageNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDamageTargetItem(null)}
                  className="px-4 py-2 rounded-xl glass-button text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition"
                >
                  Confirm & Transfer to Damaged
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
