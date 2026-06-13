







import { useState, useEffect, useRef } from 'react';
import { format, addDays, isToday, isSameDay } from "date-fns";

import ServiceManager from './ServiceManager';
import AddServices from './AddServices';
import BookService from './BookService';

// ====================== SHARED DUMMY DATA ======================
export const DUMMY_SERVICES = [
  {
    _id: 'svc1',
    name: 'Swimming',
    capacity: 20,
    slots: [
      { _id: 'slot1', startTime: '08:00', endTime: '09:00', staffId: { _id: 'st1', fullName: 'Rahul Sharma', role: 'Coach' } },
      { _id: 'slot2', startTime: '10:00', endTime: '11:00', staffId: { _id: 'st2', fullName: 'Priya Mehta', role: 'Instructor' } },
      { _id: 'slot3', startTime: '14:00', endTime: '15:00', staffId: { _id: 'st1', fullName: 'Rahul Sharma', role: 'Coach' } },
    ],
    feeTypeId: { _id: 'fee1', description: 'Standard Fee' },
  },
  {
    _id: 'svc2',
    name: 'Yoga',
    capacity: 15,
    slots: [
      { _id: 'slot4', startTime: '07:00', endTime: '08:00', staffId: { _id: 'st3', fullName: 'Anita Joshi', role: 'Instructor' } },
      { _id: 'slot5', startTime: '17:00', endTime: '18:00', staffId: { _id: 'st3', fullName: 'Anita Joshi', role: 'Instructor' } },
    ],
    feeTypeId: { _id: 'fee2', description: 'Premium Fee' },
  },
  {
    _id: 'svc3',
    name: 'Basketball',
    capacity: 30,
    slots: [
      { _id: 'slot6', startTime: '09:00', endTime: '10:30', staffId: { _id: 'st4', fullName: 'Vikram Singh', role: 'Coach' } },
      { _id: 'slot7', startTime: '15:00', endTime: '16:30', staffId: { _id: 'st4', fullName: 'Vikram Singh', role: 'Coach' } },
    ],
    feeTypeId: { _id: 'fee1', description: 'Standard Fee' },
  },
];

export const INITIAL_BOOKINGS = [
  { _id: 'bk1', activityId: { _id: 'svc1' }, slotId: 'slot1', customerName: 'Aman Gupta',    date: format(new Date(), 'yyyy-MM-dd'), slotTime: '08:00 - 09:00', activityName: 'Swimming' },
  { _id: 'bk2', activityId: { _id: 'svc1' }, slotId: 'slot1', customerName: 'Neha Patil',    date: format(new Date(), 'yyyy-MM-dd'), slotTime: '08:00 - 09:00', activityName: 'Swimming' },
  { _id: 'bk3', activityId: { _id: 'svc2' }, slotId: 'slot4', customerName: 'Riya Shah',     date: format(new Date(), 'yyyy-MM-dd'), slotTime: '07:00 - 08:00', activityName: 'Yoga' },
  { _id: 'bk4', activityId: { _id: 'svc3' }, slotId: 'slot6', customerName: 'Karan Malhotra',date: format(new Date(), 'yyyy-MM-dd'), slotTime: '09:00 - 10:30', activityName: 'Basketball' },
];

export default function Services() {
  const [view, setView] = useState('dashboard');
  const [editService, setEditService] = useState(null);

  // Lifted state — shared with BookService so dashboard stays in sync
  const [services, setServices] = useState(DUMMY_SERVICES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotBookings, setSlotBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [stats, setStats] = useState({ totalServices: 0, totalBookings: 0, availableSlots: 0, fullSlots: 0 });
  const [todaySlots, setTodaySlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ================= DASHBOARD =================
  useEffect(() => {
    if (view !== 'dashboard') return;

    const selected = format(selectedDate, 'yyyy-MM-dd');
    const dayBookings = bookings.filter(b => b.date === selected);

    let totalSlots = 0;
    let fullSlots = 0;
    const slots = [];

    services.forEach((svc) => {
      svc.slots?.forEach((slot) => {
        totalSlots++;
        const booked = dayBookings.filter(
          b => b.activityId?._id === svc._id && b.slotId === slot._id
        ).length;

        if (booked >= svc.capacity) fullSlots++;

        slots.push({
          service: svc.name,
          time: `${slot.startTime} - ${slot.endTime}`,
          booked,
          capacity: svc.capacity,
          slotId: slot._id,
          serviceId: svc._id,
        });
      });
    });

    setStats({
      totalServices: services.length,
      totalBookings: dayBookings.length,
      availableSlots: totalSlots - fullSlots,
      fullSlots,
    });
    setTodaySlots(slots);
  }, [view, selectedDate, services, bookings]);

  // ================= SLOT MODAL =================
  const handleSlotClick = (slot) => {
    const selected = format(selectedDate, 'yyyy-MM-dd');
    setSelectedSlot(slot);
    setSlotBookings(
      bookings.filter(
        b => b.date === selected &&
             b.activityId?._id === slot.serviceId &&
             b.slotId === slot.slotId
      )
    );
    setShowModal(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {view === 'dashboard' && 'Services Dashboard'}
          {view === 'add'       && (editService ? 'Edit Service' : 'Add Service')}
          {view === 'manage'    && 'Manage Services'}
          {view === 'book'      && 'Book Service'}
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setView('book')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${view === 'book' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'}`}
          >
            Book Service
          </button>
          <button
            onClick={() => setView('manage')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${view === 'manage' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'}`}
          >
            Manage
          </button>
          <button
            onClick={() => { setEditService(null); setView('add'); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${view === 'add' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'}`}
          >
            + Add Service
          </button>
        </div>
      </div>

      {/* ================= DASHBOARD ================= */}
      {view === 'dashboard' && (
        <>
          <DateStrip selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Total Services</p>
              <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.totalServices}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Today's Bookings</p>
              <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.totalBookings}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Available Slots</p>
              <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.availableSlots}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Full Slots</p>
              <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.fullSlots}</p>
            </div>
          </div>

          <TodaySchedule
            todaySlots={todaySlots}
            selectedDate={selectedDate}
            handleSlotClick={handleSlotClick}
          />
        </>
      )}

      {/* ================= MANAGE ================= */}
      {view === 'manage' && (
        <ServiceManager
          services={services}
          setServices={setServices}
          onEdit={(svc) => { setEditService(svc); setView('add'); }}
        />
      )}

      {/* ================= ADD / EDIT ================= */}
      {view === 'add' && (
        <AddServices
          editData={editService}
          services={services}
          setServices={setServices}
          onCancel={() => { setEditService(null); setView('manage'); }}
          onSaved={() => { setEditService(null); setView('dashboard'); }}
        />
      )}

      {/* ================= BOOK ================= */}
      {view === 'book' && (
        <BookService
          services={services}
          bookings={bookings}
          setBookings={setBookings}
        />
      )}

      {/* ================= SLOT MODAL ================= */}
      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{selectedSlot.service}</h3>
            <p className="text-sm text-gray-500 mb-4">{selectedSlot.time}</p>

            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Booked: <strong>{selectedSlot.booked}</strong></span>
              <span>Capacity: <strong>{selectedSlot.capacity}</strong></span>
            </div>

            {slotBookings.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No bookings yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {slotBookings.map((b) => (
                  <div key={b._id} className="p-3 bg-gray-50 rounded-lg">{b.customerName}</div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-3 bg-[#000359] text-white rounded-xl font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================== DATE STRIP ======================
const DateStrip = ({ selectedDate, setSelectedDate }) => {
  const scrollRef = useRef(null);
  const selectedRef = useRef(null);
  const [anchorOffset, setAnchorOffset] = useState(0);

  const today = new Date();
  const days = Array.from({ length: 45 }, (_, i) => ({
    date: addDays(today, i - 14 + anchorOffset),
    isSelected: isSameDay(addDays(today, i - 14 + anchorOffset), selectedDate),
    isToday: isToday(addDays(today, i - 14 + anchorOffset)),
  }));

  const centerDate = days[22].date;

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedDate, anchorOffset]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-sm font-medium text-gray-700">{format(centerDate, 'MMMM yyyy')}</span>
        <div className="flex gap-2">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#000359]"
          />
          <button onClick={() => setAnchorOffset(o => o - 7)} className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center">‹</button>
          <button onClick={() => { setSelectedDate(new Date()); setAnchorOffset(0); }} className="px-3 h-7 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">Today</button>
          <button onClick={() => setAnchorOffset(o => o + 7)} className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center">›</button>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto flex gap-1.5 px-3 pb-3 pt-1" style={{ scrollbarWidth: 'none' }}>
        {days.map(({ date, isSelected, isToday: todayFlag }, i) => (
          <button
            key={i}
            ref={isSelected ? selectedRef : null}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center w-[54px] flex-shrink-0 py-2.5 rounded-xl border transition-all
              ${isSelected ? 'bg-blue-600 border-transparent' : todayFlag ? 'border-gray-300' : 'border-transparent hover:bg-gray-50 hover:border-gray-100'}`}
          >
            <span className={`text-[11px] font-medium uppercase tracking-wide ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
              {format(date, 'EEE')}
            </span>
            <span className={`text-xl font-medium leading-snug ${isSelected ? 'text-white' : todayFlag ? 'text-blue-600' : 'text-gray-800'}`}>
              {format(date, 'd')}
            </span>
            <div className={`w-1 h-1 rounded-full mt-1 ${todayFlag && !isSelected ? 'bg-blue-500' : 'invisible'}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

// ====================== TODAY SCHEDULE ======================
const TodaySchedule = ({ todaySlots, selectedDate, handleSlotClick }) => {
  const [expandedServices, setExpandedServices] = useState({});

  const grouped = todaySlots.reduce((acc, slot) => {
    if (!acc[slot.service]) acc[slot.service] = [];
    acc[slot.service].push(slot);
    return acc;
  }, {});

  const toggleExpand = (name) =>
    setExpandedServices(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Schedule for {format(selectedDate, 'EEEE, dd MMMM yyyy')}
      </h2>

      {todaySlots.length === 0 ? (
        <div className="py-10 text-center text-gray-500">No services scheduled for this date</div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([name, slots]) => {
            const isExpanded = expandedServices[name];
            const hasMore = slots.length > 3;
            const visible = isExpanded ? slots : slots.slice(0, 3);

            return (
              <div key={name} className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-2.5 border-b">
                  <h3 className="text-base font-semibold text-gray-800">{name}</h3>
                </div>

                <div className="divide-y divide-gray-100 text-sm">
                  {visible.map((slot, idx) => {
                    const isFull = slot.booked >= slot.capacity;
                    const percentage = Math.min((slot.booked / slot.capacity) * 100, 100);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSlotClick(slot)}
                        className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="font-mono text-xs text-gray-500 w-28">{slot.time}</div>
                          <div>
                            <p className="font-medium text-gray-700">{isFull ? 'Session Full' : 'Available'}</p>
                            {!isFull && slot.booked > 0 && (
                              <div className="w-28 h-1 bg-gray-200 rounded-full mt-1">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${percentage}%` }} />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`px-3.5 py-1 rounded-xl text-xs font-semibold
                          ${isFull ? 'bg-red-100 text-red-700' : slot.booked === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {slot.booked}/{slot.capacity}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasMore && (
                  <div onClick={() => toggleExpand(name)} className="px-5 py-2.5 text-[#000359] text-sm font-medium flex items-center justify-center hover:bg-gray-50 cursor-pointer border-t">
                    {isExpanded ? 'Show Less ↑' : `View ${slots.length - 3} More Slots ↓`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};