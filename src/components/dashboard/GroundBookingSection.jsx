import { useState } from 'react'

export default function GroundBookingSection({
  grounds = [],
  onBookGround,
  setActiveTab,
}) {
  const [selectedGroundId, setSelectedGroundId] = useState(grounds[0]?.id || 'ground-football')
  const [selectedSport, setSelectedSport] = useState(grounds[0]?.sport || 'Football')
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [duration, setDuration] = useState('1.5 Hours')
  const [purpose, setPurpose] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(null)
  const [formError, setFormError] = useState('')

  const selectedGround = grounds.find((g) => g.id === selectedGroundId) || grounds[0]

  const handleGroundChange = (ground) => {
    setSelectedGroundId(ground.id)
    setSelectedSport(ground.sport)
    setSelectedSlotId('')
    setBookingSuccess(null)
    setFormError('')
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    if (!selectedSlotId) {
      setFormError('Please select an available time slot for your reservation.')
      return
    }

    const slot = selectedGround.slots.find((s) => s.id === selectedSlotId)
    if (!slot || !slot.isAvailable) {
      setFormError('The selected time slot is no longer available. Please pick another.')
      return
    }

    const newBookingId = `GB-${Math.floor(10000 + Math.random() * 90000)}`

    const dateObj = new Date(selectedDate + 'T00:00:00')
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    const newBooking = {
      id: newBookingId,
      groundId: selectedGround.id,
      groundName: selectedGround.name,
      sport: selectedSport,
      date: formattedDate,
      timeSlot: slot.time,
      duration: duration,
      status: 'Confirmed',
      purpose: purpose.trim() || 'Team practice match',
      createdAt: new Date().toISOString(),
    }

    onBookGround(newBooking, selectedGround.id, selectedSlotId)

    setBookingSuccess({
      ...newBooking,
    })

    setSelectedSlotId('')
    setPurpose('')
  }

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {bookingSuccess && (
        <div className="p-5 rounded-2xl glass-card border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold text-base flex-shrink-0 mt-0.5 shadow-inner">
              ✓
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Ground Reserved Successfully!
              </h3>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Booking ID: <strong className="font-mono text-white">{bookingSuccess.id}</strong> &bull;{' '}
                {bookingSuccess.groundName} on {bookingSuccess.date} ({bookingSuccess.timeSlot}).
              </p>
              <p className="text-[11px] text-emerald-300/80 mt-1 italic">
                Simulated for current session. Added to your active bookings list.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setActiveTab('my-bookings')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/80 text-white text-xs font-semibold hover:bg-emerald-600 border border-emerald-400/40 shadow-sm transition"
            >
              View My Bookings &rarr;
            </button>
            <button
              type="button"
              onClick={() => setBookingSuccess(null)}
              className="px-2.5 py-1.5 rounded-xl glass-button text-xs text-slate-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Form Error Banner */}
      {formError && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200 font-medium">
          {formError}
        </div>
      )}

      {/* Ground Selection Cards */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-white tracking-tight">1. Select Campus Sports Ground</h2>
          <p className="text-xs text-slate-400">
            Choose the dedicated court or turf for your session
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {grounds.map((ground) => {
            const isSelected = selectedGroundId === ground.id
            return (
              <div
                key={ground.id}
                onClick={() => handleGroundChange(ground)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600/25 border-blue-400/60 shadow-[0_0_30px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] ring-1 ring-blue-400/50 scale-[1.02]'
                    : 'glass-card border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.08] text-cyan-300 border border-white/10 uppercase">
                    {ground.sport}
                  </span>
                  {ground.floodlights && (
                    <span className="text-[9px] font-semibold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-md border border-amber-500/30">
                      Lights
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-white mb-1 leading-snug">
                  {ground.name}
                </h3>
                <p className="text-[11px] text-slate-400 mb-2">{ground.surface}</p>
                <div className="text-[10px] text-slate-400 border-t border-white/[0.08] pt-2 flex items-center justify-between">
                  <span>{ground.capacity}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Booking Configuration & Slot Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Area (2 cols) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">2. Configure Date &amp; Details</h2>
            <p className="text-xs text-slate-400">Pick date, match duration and purpose</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sport selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="ground-sport">
                Sport
              </label>
              <select
                id="ground-sport"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs"
              >
                <option value={selectedGround.sport} className="bg-slate-900 text-white">
                  {selectedGround.sport}
                </option>
                <option value="Multi-sport Training" className="bg-slate-900 text-white">
                  Multi-sport Training
                </option>
                <option value="Fitness Conditioning" className="bg-slate-900 text-white">
                  Fitness Conditioning
                </option>
              </select>
            </div>

            {/* Date input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="ground-date">
                Reservation Date
              </label>
              <input
                id="ground-date"
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setSelectedSlotId('')
                }}
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="ground-duration">
                Session Duration
              </label>
              <select
                id="ground-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs"
              >
                <option value="1.0 Hour" className="bg-slate-900 text-white">1.0 Hour</option>
                <option value="1.5 Hours" className="bg-slate-900 text-white">1.5 Hours</option>
                <option value="2.0 Hours" className="bg-slate-900 text-white">2.0 Hours</option>
              </select>
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300">
                3. Available Time Slots ({selectedGround.name})
              </label>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_rgba(34,211,238,0.8)]" /> Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" /> Booked
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {selectedGround.slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.isAvailable}
                    onClick={() => {
                      setSelectedSlotId(slot.id)
                      setFormError('')
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                      !slot.isAvailable
                        ? 'bg-white/[0.02] text-slate-600 border-white/5 cursor-not-allowed line-through'
                        : isSelected
                        ? 'glass-button-primary text-white border-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                        : 'glass-button text-slate-200 border-white/10 hover:border-cyan-400/40 hover:text-white'
                    }`}
                  >
                    <span>{slot.time}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        !slot.isAvailable
                          ? 'text-slate-600'
                          : isSelected
                          ? 'text-cyan-200'
                          : 'text-emerald-400'
                      }`}
                    >
                      {slot.isAvailable ? (isSelected ? 'Selected ✓' : 'Available') : 'Booked'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Booking Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="ground-purpose">
              Purpose / Notes (Optional)
            </label>
            <input
              id="ground-purpose"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Department 7v7 friendly practice, tournament drills"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Right Summary Card (1 col) */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase">Reservation Summary</h3>
              <span className="text-[10px] font-bold text-cyan-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                Student Pass
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Ground:</span>
                <span className="font-semibold text-white text-right">{selectedGround.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Sport:</span>
                <span className="font-semibold text-cyan-300">{selectedSport}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-slate-300">{selectedGround.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-white">{selectedDate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Time Slot:</span>
                <span className="font-bold text-cyan-300">
                  {selectedSlotId
                    ? selectedGround.slots.find((s) => s.id === selectedSlotId)?.time
                    : 'None selected'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Duration:</span>
                <span className="font-semibold text-white">{duration}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Rate:</span>
                <span className="font-bold text-emerald-400">Complimentary (Student Pass)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] text-slate-400 mt-5 leading-relaxed">
              Ground rules: Student sports ID required upon entry. Athletic footwear mandatory for all turf and wood courts.
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleBookingSubmit}
              disabled={!selectedSlotId}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition shadow-lg ${
                selectedSlotId
                  ? 'glass-button-primary text-white shadow-blue-600/40'
                  : 'bg-white/[0.05] text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              {selectedSlotId ? 'Confirm Ground Booking' : 'Select a Slot to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
