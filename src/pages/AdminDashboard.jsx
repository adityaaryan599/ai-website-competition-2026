import { useState } from 'react'
import {
  initialAdminStats,
  initialGroundBookings,
  initialGroundsAvailability,
  initialEquipmentInventory,
  initialBorrowRequests,
  initialBookingConflicts,
  initialDamagedEquipment,
  initialMatches,
  initialStudents,
  initialAdminNotifications,
} from '../data/adminData'

import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import OverviewTab from '../components/admin/OverviewTab'
import BookingTable from '../components/admin/BookingTable'
import EquipmentTable from '../components/admin/EquipmentTable'
import RequestTable from '../components/admin/RequestTable'
import ConflictCard from '../components/admin/ConflictCard'
import DamageTable from '../components/admin/DamageTable'
import MatchTable from '../components/admin/MatchTable'
import TournamentBracket from '../components/admin/TournamentBracket'
import StudentTable from '../components/admin/StudentTable'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Session-level Mock States
  const [stats, setStats] = useState(initialAdminStats)
  const [groundBookings, setGroundBookings] = useState(initialGroundBookings)
  const [grounds, setGrounds] = useState(initialGroundsAvailability)
  const [equipmentList, setEquipmentList] = useState(initialEquipmentInventory)
  const [borrowRequests, setBorrowRequests] = useState(initialBorrowRequests)
  const [conflicts, setConflicts] = useState(initialBookingConflicts)
  const [damagedList, setDamagedList] = useState(initialDamagedEquipment)
  const [matches, setMatches] = useState(initialMatches)
  const [students, setStudents] = useState(initialStudents)
  const [notifications, setNotifications] = useState(initialAdminNotifications)

  // Push new notification
  const addNotification = (title, message, type = 'info') => {
    setNotifications((prev) => [
      {
        id: `an-${Date.now()}`,
        title,
        message,
        type,
        time: 'Just now',
        unread: true,
      },
      ...prev,
    ])
  }

  // --- Ground Booking Handlers ---
  const handleApproveBooking = (bookingId) => {
    setGroundBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Approved' } : b))
    )
    setStats((prev) => ({
      ...prev,
      activeGroundBookings: prev.activeGroundBookings + 1,
    }))
    addNotification('Ground Booking Approved', `Reservation ${bookingId} has been confirmed.`, 'info')
  }

  const handleRejectBooking = (bookingId) => {
    setGroundBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Rejected' } : b))
    )
    addNotification('Ground Booking Rejected', `Reservation ${bookingId} was declined.`, 'warning')
  }

  const handleCancelBooking = (bookingId) => {
    const booking = groundBookings.find((b) => b.id === bookingId)
    setGroundBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    )
    if (booking?.status === 'Approved') {
      setStats((prev) => ({
        ...prev,
        activeGroundBookings: Math.max(0, prev.activeGroundBookings - 1),
      }))
    }
    addNotification('Ground Reservation Cancelled', `Reservation ${bookingId} has been cancelled.`, 'warning')
  }

  // --- Equipment Inventory Handlers ---
  const handleAddEquipment = (newItem) => {
    setEquipmentList((prev) => [newItem, ...prev])
    addNotification('Equipment Added', `Added ${newItem.name} to equipment inventory.`, 'info')
  }

  const handleEditEquipment = (updatedItem) => {
    setEquipmentList((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    )
    addNotification('Equipment Updated', `Updated specifications for ${updatedItem.name}.`, 'info')
  }

  const handleUpdateQuantity = (itemId, delta) => {
    setEquipmentList((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newAvail = Math.max(0, Math.min(item.totalQty, item.availableQty + delta))
          return {
            ...item,
            availableQty: newAvail,
            status: newAvail === 0 ? 'Out of Stock' : newAvail <= 3 ? 'Low Stock' : 'In Stock',
          }
        }
        return item
      })
    )
  }

  const handleMarkDamaged = (itemId, qty, note) => {
    const targetItem = equipmentList.find((e) => e.id === itemId)
    if (!targetItem) return

    setEquipmentList((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newAvail = Math.max(0, item.availableQty - qty)
          return {
            ...item,
            availableQty: newAvail,
            damagedQty: item.damagedQty + qty,
            status: newAvail === 0 ? 'Out of Stock' : newAvail <= 3 ? 'Low Stock' : 'In Stock',
          }
        }
        return item
      })
    )

    // Add to Damaged Equipment List
    const newDamageEntry = {
      id: `DMG-${Date.now().toString().slice(-4)}`,
      equipment: targetItem.name,
      student: 'General Incident / Wear',
      studentId: 'FACILITY-LOG',
      dateBorrowed: new Date().toISOString().slice(0, 10),
      dateReturned: new Date().toISOString().slice(0, 10),
      damageDescription: note || 'Structural defect or excessive wear noted by officer.',
      damageSeverity: 'Moderate',
      estimatedFee: 20 * qty,
      status: 'Under Review',
    }

    setDamagedList((prev) => [newDamageEntry, ...prev])
    setStats((prev) => ({
      ...prev,
      damagedEquipment: prev.damagedEquipment + qty,
    }))
    addNotification('Damage Recorded', `${qty}x ${targetItem.name} logged in damaged equipment incident registry.`, 'alert')
  }

  const handleRemoveEquipment = (itemId) => {
    const target = equipmentList.find((e) => e.id === itemId)
    setEquipmentList((prev) => prev.filter((item) => item.id !== itemId))
    addNotification('Equipment Retired', `Retired ${target?.name || 'item'} from active inventory.`, 'info')
  }

  // --- Borrow Requests Handlers ---
  const handleApproveRequest = (requestId) => {
    const request = borrowRequests.find((r) => r.id === requestId)
    if (!request) return

    setBorrowRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Borrowed' } : r))
    )

    setStats((prev) => ({
      ...prev,
      pendingRequests: Math.max(0, prev.pendingRequests - 1),
      equipmentBorrowed: prev.equipmentBorrowed + request.quantity,
    }))

    // Decrement available gear
    setEquipmentList((prev) =>
      prev.map((item) =>
        item.name.toLowerCase().includes(request.equipment.toLowerCase()) ||
        request.equipment.toLowerCase().includes(item.name.toLowerCase())
          ? { ...item, availableQty: Math.max(0, item.availableQty - request.quantity) }
          : item
      )
    )

    addNotification('Loan Approved', `Checked out ${request.quantity}x ${request.equipment} to ${request.studentName}.`, 'info')
  }

  const handleRejectRequest = (requestId) => {
    const request = borrowRequests.find((r) => r.id === requestId)
    setBorrowRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Rejected' } : r))
    )
    setStats((prev) => ({
      ...prev,
      pendingRequests: Math.max(0, prev.pendingRequests - 1),
    }))
    addNotification('Loan Request Declined', `Declined request ${requestId} for ${request?.studentName}.`, 'warning')
  }

  const handleMarkReturned = (requestId) => {
    const request = borrowRequests.find((r) => r.id === requestId)
    if (!request) return

    setBorrowRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Returned' } : r))
    )

    setStats((prev) => ({
      ...prev,
      equipmentBorrowed: Math.max(0, prev.equipmentBorrowed - request.quantity),
    }))

    // Restock gear
    setEquipmentList((prev) =>
      prev.map((item) =>
        item.name.toLowerCase().includes(request.equipment.toLowerCase()) ||
        request.equipment.toLowerCase().includes(item.name.toLowerCase())
          ? {
              ...item,
              availableQty: Math.min(item.totalQty, item.availableQty + request.quantity),
              status: 'In Stock',
            }
          : item
      )
    )

    addNotification('Equipment Restocked', `${request.studentName} returned ${request.quantity}x ${request.equipment}.`, 'info')
  }

  // --- Conflict Handlers ---
  const handleResolveConflict = (conflictId, note) => {
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === conflictId
          ? { ...c, resolutionStatus: 'Resolved', resolutionNote: note }
          : c
      )
    )
    addNotification('Conflict Resolved', `Resolved booking clash ${conflictId}.`, 'info')
  }

  const handleCancelConflictBooking = (conflictId, bookingId) => {
    // 1. Mark booking cancelled in bookings list
    handleCancelBooking(bookingId)

    // 2. Mark conflict resolved
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === conflictId
          ? {
              ...c,
              resolutionStatus: 'Resolved',
              resolutionNote: `Resolved by cancelling colliding booking ${bookingId}.`,
            }
          : c
      )
    )
  }

  // --- Damaged Equipment Handlers ---
  const handleUpdateDamageFee = (damageId, fee) => {
    setDamagedList((prev) =>
      prev.map((d) => (d.id === damageId ? { ...d, estimatedFee: fee, status: 'Fee Pending' } : d))
    )
    addNotification('Damage Fee Set', `Updated repair assessment fee on incident ${damageId}.`, 'info')
  }

  const handleResolveDamage = (damageId) => {
    setDamagedList((prev) =>
      prev.map((d) => (d.id === damageId ? { ...d, status: 'Resolved' } : d))
    )
    setStats((prev) => ({
      ...prev,
      damagedEquipment: Math.max(0, prev.damagedEquipment - 1),
    }))
    addNotification('Damage Resolved', `Closed damage case ${damageId}.`, 'info')
  }

  // --- Matches Handlers ---
  const handleAddMatch = (newMatch) => {
    setMatches((prev) => [newMatch, ...prev])
    addNotification('Fixture Added', `Scheduled match: ${newMatch.teams}.`, 'info')
  }

  const handleEditMatch = (updatedMatch) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
    )
    addNotification('Fixture Updated', `Updated match details for ${updatedMatch.teams}.`, 'info')
  }

  const handleCancelMatch = (matchId) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, status: 'Cancelled' } : m))
    )
    addNotification('Fixture Cancelled', `Cancelled match ${matchId}.`, 'warning')
  }

  // --- Grounds Maintenance Toggle ---
  const handleToggleGroundMaintenance = (groundId) => {
    setGrounds((prev) =>
      prev.map((g) => {
        if (g.id === groundId) {
          const nextStatus = g.status === 'Maintenance' ? 'Available' : 'Maintenance'
          return {
            ...g,
            status: nextStatus,
            availableSlots: nextStatus === 'Maintenance' ? 0 : g.totalSlots - 1,
          }
        }
        return g
      })
    )

    setStats((prev) => {
      const g = grounds.find((item) => item.id === groundId)
      const isNowMaintenance = g?.status !== 'Maintenance'
      return {
        ...prev,
        availableGrounds: isNowMaintenance
          ? Math.max(0, prev.availableGrounds - 1)
          : prev.availableGrounds + 1,
      }
    })
  }

  // --- Students Status Toggle ---
  const handleToggleStudentStatus = (studentId, newStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, accountStatus: newStatus } : s))
    )
    addNotification('Student Standing Changed', `Student ${studentId} status updated to ${newStatus}.`, 'info')
  }

  // Sidebar dynamic counter badges
  const sidebarCounts = {
    pendingBookings: groundBookings.filter((b) => b.status === 'Pending').length,
    lowStockItems: equipmentList.filter((e) => e.availableQty <= 3).length,
    pendingRequests: borrowRequests.filter((r) => r.status === 'Pending').length,
    unresolvedConflicts: conflicts.filter((c) => c.resolutionStatus === 'Unresolved').length,
    damagedCount: damagedList.filter((d) => d.status !== 'Resolved').length,
  }

  return (
    <div className="min-h-screen portal-container bg-[#070b14] text-slate-100 flex relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white transition-colors duration-300">
      {/* Liquid Glass Atmospheric Lighting: Ambient Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute top-[8%] -right-24 w-[650px] h-[650px] rounded-full bg-blue-600/15 blur-[150px]" />
        <div className="absolute -bottom-40 left-[25%] w-[700px] h-[700px] rounded-full bg-indigo-700/10 blur-[160px]" />
      </div>

      {/* Floating Translucent Glass Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        counts={sidebarCounts}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 relative z-10">
        {/* Floating Glass Header */}
        <AdminHeader
          activeTab={activeTab}
          setIsMobileOpen={setIsMobileOpen}
          notifications={notifications}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
        />

        {/* Role Notice & Security Architecture Pill */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto mb-4">
          <div className="p-3 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-cyan-500/20 bg-gradient-to-r from-blue-950/30 to-slate-900/40">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-300">
                <strong className="text-white">Admin Operations Workspace:</strong> Role-based access control hook active. Ready for Supabase RLS enforcement.
              </span>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold">
                Privilege: Sports Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Active Tab View */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              groundBookings={groundBookings}
              equipmentRequests={borrowRequests}
              grounds={grounds}
              onApproveBooking={handleApproveBooking}
              onRejectBooking={handleRejectBooking}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onToggleGroundMaintenance={handleToggleGroundMaintenance}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingTable
              bookings={groundBookings}
              onApproveBooking={handleApproveBooking}
              onRejectBooking={handleRejectBooking}
              onCancelBooking={handleCancelBooking}
            />
          )}

          {activeTab === 'inventory' && (
            <EquipmentTable
              equipmentList={equipmentList}
              onAddEquipment={handleAddEquipment}
              onEditEquipment={handleEditEquipment}
              onUpdateQuantity={handleUpdateQuantity}
              onMarkDamaged={handleMarkDamaged}
              onRemoveEquipment={handleRemoveEquipment}
            />
          )}

          {activeTab === 'requests' && (
            <RequestTable
              requests={borrowRequests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onMarkReturned={handleMarkReturned}
            />
          )}

          {activeTab === 'conflicts' && (
            <ConflictCard
              conflicts={conflicts}
              onResolveConflict={handleResolveConflict}
              onCancelConflictBooking={handleCancelConflictBooking}
            />
          )}

          {activeTab === 'damages' && (
            <DamageTable
              damagedList={damagedList}
              onUpdateFee={handleUpdateDamageFee}
              onResolveDamage={handleResolveDamage}
              onReviewDamage={() => {}}
            />
          )}

          {activeTab === 'matches' && (
            <MatchTable
              matches={matches}
              onAddMatch={handleAddMatch}
              onEditMatch={handleEditMatch}
              onCancelMatch={handleCancelMatch}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'fixtures' && <TournamentBracket />}

          {activeTab === 'students' && (
            <StudentTable
              students={students}
              onToggleStudentStatus={handleToggleStudentStatus}
            />
          )}
        </main>
      </div>
    </div>
  )
}
