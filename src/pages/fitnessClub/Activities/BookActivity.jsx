import { useEffect, useState } from 'react';
import { api } from '../../../services/apiClient';
import { toast } from 'sonner';

export default function BookActivity() {

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);

  const [memberName, setMemberName] = useState('');
  const [bookings, setBookings] = useState([]);

  /* =========================
     FETCH ACTIVITIES
  ========================= */
  const fetchActivities = async () => {
    const res = await api.fitnessActivities.getAll();
    setActivities(res.data.data);
  };

  /* =========================
     FETCH AVAILABILITY
  ========================= */
  const fetchAvailability = async () => {
  if (!selectedActivity || !date) return;

  const res = await api.fitnessActivities.availability({
    activityId: selectedActivity,
    date
  });

  setSlots(res.data.data || []);
};

  /* =========================
     FETCH BOOKINGS
  ========================= */
 const fetchBookings = async () => {
  const res = await api.fitnessActivities.getBookings();
  setBookings(res.data.data || []);
};

  /* =========================
     BOOK SLOT
  ========================= */
  const handleBook = async (slot) => {

    if (!memberName.trim()) {
      toast.error("Enter member name");
      return;
    }

    try {
      await api.fitnessActivities.bookSlot({
  activityId: selectedActivity,
  slotId: slot.slotId,
  date,
  customerName: memberName,
  phone: "0000000000"
});

      toast.success("Booked successfully");

      fetchAvailability();
      fetchBookings();

      setMemberName('');

    } catch (err) {
toast.error(
  err?.response?.data?.message ||
  err?.message ||
  "Cancel failed"
);    }
  };
  /* =========================
     CANCEL BOOKING
  ========================= */

 const handleCancel = async (id) => {
  try {
    console.log("Cancelling:", id); // 👈 ADD

    await api.fitnessActivities.cancelBooking(id);

    toast.success("Booking cancelled");

    fetchBookings();
    fetchAvailability();

  } catch (err) {
    console.error("CANCEL ERROR:", err); // 👈 ADD

    toast.error(
      err?.response?.data?.message ||
      err?.message ||
      "Cancel failed"
    );
  }
};

  useEffect(() => {
    fetchActivities();
    fetchBookings();
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [selectedActivity, date]);

  return (
    <div className="space-y-6">

      {/* BOOK ACTIVITY CARD */}
      <div className="max-w-xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

        <h2 className="text-lg font-semibold">Book Activity</h2>

        {/* Activity + Date */}
        <div className="flex gap-3">
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select Activity</option>
            {activities.map(a => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Member Name */}
        <input
          type="text"
          placeholder="Enter member name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        {/* Slots */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Available Slots</h3>

          <div className="border rounded-lg overflow-hidden">

            {slots.length === 0 && (
              <div className="text-center py-5 text-gray-400 text-sm">
                No slots available
              </div>
            )}

            {slots.map(slot => {
              const isFull = slot.booked >= slot.capacity;

              return (
                <div
                  key={slot.slotId}
                  className="flex justify-between items-center px-4 py-3 border-t"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slot.booked}/{slot.capacity} booked
                    </p>
                  </div>

                  <button
                    disabled={isFull}
                    onClick={() => handleBook(slot)}
                    className={`px-4 py-1.5 text-sm rounded-md text-white ${
                      isFull
                        ? 'bg-gray-400'
                        : 'bg-[#000359] hover:bg-[#000280]'
                    }`}
                  >
                    {isFull ? 'Full' : 'Book'}
                  </button>
                </div>
              );
            })}

          </div>
        </div>

      </div>

      {/* BOOKING TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

        <h2 className="text-lg font-semibold mb-4">Booking Details</h2>

        <table className="w-full text-sm border rounded-lg overflow-hidden">
  <thead className="bg-gray-100 text-gray-600">
    <tr>
      <th className="text-left px-4 py-2">Member</th>
      <th className="text-left px-4 py-2">Activity</th>
      <th className="text-left px-4 py-2">Slot</th>
      <th className="text-left px-4 py-2">Date</th>
      <th className="text-left px-4 py-2">Action</th>
    </tr>
  </thead>

  <tbody>
    {bookings.length === 0 && (
      <tr>
        <td colSpan="5" className="text-center py-4 text-gray-400">
          No bookings yet
        </td>
      </tr>
    )}

    {bookings.map(b => (
      <tr key={b._id} className="border-t hover:bg-gray-50">
        <td className="px-4 py-2 font-medium">{b.customerName}</td>
        <td className="px-4 py-2">{b.activityName}</td>
        <td className="px-4 py-2">{b.slotTime}</td>
        <td className="px-4 py-2">{b.date}</td>

        <td className="px-4 py-2">
          <button
            onClick={() => handleCancel(b._id)}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Cancel
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

    </div>
  );
}