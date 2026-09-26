import { useState } from 'react'
import {
  initialGrounds,
  initialEquipment,
  initialGroundBookings,
  initialEquipmentBorrowings,
  initialMatches,
  initialNotifications,
} from '../data/sportsData'

import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import OverviewSection from '../components/dashboard/OverviewSection'
import GroundBookingSection from '../components/dashboard/GroundBookingSection'
import EquipmentSection from '../components/dashboard/EquipmentSection'
import MyBookingsSection from '../components/dashboard/MyBookingsSection'
import MatchPassesSection from '../components/dashboard/MatchPassesSection'
import StudentProfileSection from '../components/dashboard/StudentProfileSection'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Session-level Mock States
  const [grounds, setGrounds] = useState(initialGrounds)
  const [equipmentList, setEquipmentList] = useState(initialEquipment)
  const [groundBookings, setGroundBookings] = useState(initialGroundBookings)
  const [equipmentBorrowings, setEquipmentBorrowings] = useState(initialEquipmentBorrowings)
  const [matches, setMatches] = useState(initialMatches)
  const [notifications, setNotifications] = useState(initialNotifications)

  // Handler: Book a ground
  const handleBookGround = (newBooking, groundId, slotId) => {
    // 1. Add to active bookings list
    setGroundBookings((prev) => [newBooking, ...prev])

    // 2. Mark slot as booked in this session
    setGrounds((prevGrounds) =>
      prevGrounds.map((ground) => {
        if (ground.id === groundId) {
          return {
            ...ground,
            slots: ground.slots.map((slot) =>
              slot.id === slotId ? { ...slot, isAvailable: false } : slot
            ),
          }
        }
        return ground
      })
    )

    // 3. Add to notifications
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Ground Reservation',
        message: `Reserved ${newBooking.groundName} for ${newBooking.date} (${newBooking.timeSlot}).`,
        time: 'Just now',
        unread: true,
      },
      ...prev,
    ])
  }

  // Handler: Cancel ground reservation
  const handleCancelBooking = (bookingId) => {
    const booking = groundBookings.find((b) => b.id === bookingId)
    if (!booking) return

    setGroundBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    )

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Booking Cancelled',
        message: `Your reservation ${bookingId} was cancelled.`,
        time: 'Just now',
        unread: true,
      },
      ...prev,
    ])
  }

  // Handler: Borrow equipment
  const handleBorrowEquipment = (newBorrowing, equipmentId, quantity) => {
    setEquipmentBorrowings((prev) => [newBorrowing, ...prev])

    setEquipmentList((prevList) =>
      prevList.map((item) =>
        item.id === equipmentId
          ? { ...item, availableQty: Math.max(0, item.availableQty - quantity) }
          : item
      )
    )

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Equipment Checked Out',
        message: `Borrowed ${quantity}x ${newBorrowing.itemName}. Due on ${newBorrowing.dueDate}.`,
        time: 'Just now',
        unread: true,
      },
      ...prev,
    ])
  }

  // Handler: Return equipment
  const handleReturnEquipment = (borrowId) => {
    const borrowing = equipmentBorrowings.find((e) => e.id === borrowId)
    if (!borrowing || borrowing.status === 'Returned') return

    setEquipmentBorrowings((prev) =>
      prev.map((e) => (e.id === borrowId ? { ...e, status: 'Returned' } : e))
    )

    setEquipmentList((prevList) =>
      prevList.map((item) =>
        item.id === borrowing.equipmentId
          ? { ...item, availableQty: Math.min(item.totalQty, item.availableQty + borrowing.quantity) }
          : item
      )
    )

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Equipment Returned',
        message: `Returned ${borrowing.quantity}x ${borrowing.itemName}. Status verified.`,
        time: 'Just now',
        unread: true,
      },
      ...prev,
    ])
  }

  // Handler: Claim match pass
  const handleClaimPass = (matchId) => {
    setMatches((prevMatches) =>
      prevMatches.map((m) =>
        m.id === matchId
          ? { ...m, isClaimed: true, remainingPasses: Math.max(0, m.remainingPasses - 1) }
          : m
      )
    )

    const match = matches.find((m) => m.id === matchId)
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Match Pass Claimed',
        message: `Student pass issued for ${match?.title || 'collegiate match'}.`,
        time: 'Just now',
        unread: true,
      },
      ...prev,
    ])
  }

  const counts = {
    activeBookings: groundBookings.filter((b) => b.status === 'Confirmed').length,
    equipmentAvailable: equipmentList.reduce((acc, curr) => acc + curr.availableQty, 0),
    matchesCount: matches.length,
  }

  return (
    <div className="min-h-screen portal-container bg-[#070b14] text-slate-100 flex relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white transition-colors duration-300">
      {/* Liquid Glass Background Atmosphere: Fixed Ambient Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Soft top-left cyan ambient glow */}
        <div className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full bg-cyan-600/10 blur-[130px]" />
        {/* Deep royal blue glow near header and right */}
        <div className="absolute top-[8%] -right-24 w-[650px] h-[650px] rounded-full bg-blue-600/15 blur-[150px]" />
        {/* Deep indigo soft pool at bottom */}
        <div className="absolute -bottom-40 left-[25%] w-[700px] h-[700px] rounded-full bg-indigo-700/10 blur-[160px]" />
      </div>

      {/* Floating Translucent Glass Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        counts={counts}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 relative z-10">
        {/* Floating Glass Header */}
        <DashboardHeader
          activeTab={activeTab}
          setIsMobileOpen={setIsMobileOpen}
          notifications={notifications}
          setActiveTab={setActiveTab}
        />

        {/* Section View Routing */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {activeTab === 'overview' && (
            <OverviewSection
              groundBookings={groundBookings}
              equipmentBorrowings={equipmentBorrowings}
              matches={matches}
              setActiveTab={setActiveTab}
              onCancelBooking={handleCancelBooking}
              onReturnEquipment={handleReturnEquipment}
              onClaimPass={handleClaimPass}
            />
          )}

          {activeTab === 'book-ground' && (
            <GroundBookingSection
              grounds={grounds}
              onBookGround={handleBookGround}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentSection
              equipmentList={equipmentList}
              onBorrowEquipment={handleBorrowEquipment}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'my-bookings' && (
            <MyBookingsSection
              groundBookings={groundBookings}
              equipmentBorrowings={equipmentBorrowings}
              onCancelBooking={handleCancelBooking}
              onReturnEquipment={handleReturnEquipment}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'match-passes' && (
            <MatchPassesSection
              matches={matches}
              onClaimPass={handleClaimPass}
            />
          )}

          {activeTab === 'profile' && <StudentProfileSection />}
        </main>
      </div>
    </div>
  )
}
