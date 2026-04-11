// import { useEffect, useState } from 'react';
// import { api } from '../../../services/apiClient';
// import { toast } from 'sonner';

// export default function BookActivity() {

//   const [activities, setActivities] = useState([]);
//   const [selectedActivity, setSelectedActivity] = useState('');
//   const [date, setDate] = useState('');
//   const [slots, setSlots] = useState([]);

//   const [memberName, setMemberName] = useState('');
//   const [bookings, setBookings] = useState([]);

//   /* =========================
//      FETCH ACTIVITIES
//   ========================= */
//   const fetchActivities = async () => {
//     const res = await api.fitnessActivities.getAll();
//     setActivities(res.data.data);
//   };

//   /* =========================
//      FETCH AVAILABILITY
//   ========================= */
//   const fetchAvailability = async () => {
//   if (!selectedActivity || !date) return;

//   const res = await api.fitnessActivities.availability({
//     activityId: selectedActivity,
//     date
//   });

//   setSlots(res.data.data || []);
// };

//   /* =========================
//      FETCH BOOKINGS
//   ========================= */
//  const fetchBookings = async () => {
//   const res = await api.fitnessActivities.getBookings();
//   setBookings(res.data.data || []);
// };

//   /* =========================
//      BOOK SLOT
//   ========================= */
//   const handleBook = async (slot) => {

//     if (!memberName.trim()) {
//       toast.error("Enter member name");
//       return;
//     }

//     try {
//       await api.fitnessActivities.bookSlot({
//   activityId: selectedActivity,
//   slotId: slot.slotId,
//   date,
//   customerName: memberName,
//   phone: "0000000000"
// });

//       toast.success("Booked successfully");

//       fetchAvailability();
//       fetchBookings();

//       setMemberName('');

//     } catch (err) {
// toast.error(
//   err?.response?.data?.message ||
//   err?.message ||
//   "Cancel failed"
// );    }
//   };
//   /* =========================
//      CANCEL BOOKING
//   ========================= */

//  const handleCancel = async (id) => {
//   try {
//     console.log("Cancelling:", id); // 👈 ADD

//     await api.fitnessActivities.cancelBooking(id);

//     toast.success("Booking cancelled");

//     fetchBookings();
//     fetchAvailability();

//   } catch (err) {
//     console.error("CANCEL ERROR:", err); // 👈 ADD

//     toast.error(
//       err?.response?.data?.message ||
//       err?.message ||
//       "Cancel failed"
//     );
//   }
// };

//   useEffect(() => {
//     fetchActivities();
//     fetchBookings();
//   }, []);

//   useEffect(() => {
//     fetchAvailability();
//   }, [selectedActivity, date]);

//   return (
//     <div className="space-y-6">

//       {/* BOOK ACTIVITY CARD */}
//       <div className="max-w-xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

//         <h2 className="text-lg font-semibold">Book Activity</h2>

//         {/* Activity + Date */}
//         <div className="flex gap-3">
//           <select
//             value={selectedActivity}
//             onChange={(e) => setSelectedActivity(e.target.value)}
//             className="flex-1 border rounded-lg px-3 py-2 text-sm"
//           >
//             <option value="">Select Activity</option>
//             {activities.map(a => (
//               <option key={a._id} value={a._id}>
//                 {a.name}
//               </option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="border rounded-lg px-3 py-2 text-sm"
//           />
//         </div>

//         {/* Member Name */}
//         <input
//           type="text"
//           placeholder="Enter member name"
//           value={memberName}
//           onChange={(e) => setMemberName(e.target.value)}
//           className="w-full border rounded-lg px-3 py-2 text-sm"
//         />

//         {/* Slots */}
//         <div>
//           <h3 className="text-sm font-semibold mb-2">Available Slots</h3>

//           <div className="border rounded-lg overflow-hidden">

//             {slots.length === 0 && (
//               <div className="text-center py-5 text-gray-400 text-sm">
//                 No slots available
//               </div>
//             )}

//             {slots.map(slot => {
//               const isFull = slot.booked >= slot.capacity;

//               return (
//                 <div
//                   key={slot.slotId}
//                   className="flex justify-between items-center px-4 py-3 border-t"
//                 >
//                   <div>
//                     <p className="text-sm font-medium">
//                       {slot.startTime} - {slot.endTime}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {slot.booked}/{slot.capacity} booked
//                     </p>
//                   </div>

//                   <button
//                     disabled={isFull}
//                     onClick={() => handleBook(slot)}
//                     className={`px-4 py-1.5 text-sm rounded-md text-white ${
//                       isFull
//                         ? 'bg-gray-400'
//                         : 'bg-[#000359] hover:bg-[#000280]'
//                     }`}
//                   >
//                     {isFull ? 'Full' : 'Book'}
//                   </button>
//                 </div>
//               );
//             })}

//           </div>
//         </div>

//       </div>

//       {/* BOOKING TABLE */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

//         <h2 className="text-lg font-semibold mb-4">Booking Details</h2>

//         <table className="w-full text-sm border rounded-lg overflow-hidden">
//   <thead className="bg-gray-100 text-gray-600">
//     <tr>
//       <th className="text-left px-4 py-2">Member</th>
//       <th className="text-left px-4 py-2">Activity</th>
//       <th className="text-left px-4 py-2">Slot</th>
//       <th className="text-left px-4 py-2">Date</th>
//       <th className="text-left px-4 py-2">Action</th>
//     </tr>
//   </thead>

//   <tbody>
//     {bookings.length === 0 && (
//       <tr>
//         <td colSpan="5" className="text-center py-4 text-gray-400">
//           No bookings yet
//         </td>
//       </tr>
//     )}

//     {bookings.map(b => (
//       <tr key={b._id} className="border-t hover:bg-gray-50">
//         <td className="px-4 py-2 font-medium">{b.customerName}</td>
//         <td className="px-4 py-2">{b.activityName}</td>
//         <td className="px-4 py-2">{b.slotTime}</td>
//         <td className="px-4 py-2">{b.date}</td>

//         <td className="px-4 py-2">
//           <button
//             onClick={() => handleCancel(b._id)}
//             className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
//           >
//             Cancel
//           </button>
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>

//       </div>

//     </div>
//   );
// }




// import { useEffect, useState } from 'react';
// import { api } from '../../../services/apiClient';
// import { toast } from 'sonner';

// export default function BookActivity() {

//   const [activities, setActivities] = useState([]);
//   const [selectedActivity, setSelectedActivity] = useState('');
//   const [date, setDate] = useState('');
//   const [slots, setSlots] = useState([]);

//   const [memberName, setMemberName] = useState('');
//   const [bookings, setBookings] = useState([]);

//   // Filter states
//   const [filterMember, setFilterMember] = useState('');
//   const [filterActivity, setFilterActivity] = useState('');

//   /* =========================
//      FETCH ACTIVITIES
//   ========================= */
//   const fetchActivities = async () => {
//     const res = await api.fitnessActivities.getAll();
//     setActivities(res.data.data);
//   };

//   /* =========================
//      FETCH AVAILABILITY
//   ========================= */
//   const fetchAvailability = async () => {
//     if (!selectedActivity || !date) return;
//     const res = await api.fitnessActivities.availability({
//       activityId: selectedActivity,
//       date
//     });
//     setSlots(res.data.data || []);
//   };

//   /* =========================
//      FETCH BOOKINGS
//   ========================= */
//   const fetchBookings = async () => {
//     const res = await api.fitnessActivities.getBookings();
//     setBookings(res.data.data || []);
//   };

//   /* =========================
//      BOOK SLOT
//   ========================= */
//   const handleBook = async (slot) => {
//     if (!memberName.trim()) {
//       toast.error("Enter member name");
//       return;
//     }
//     try {
//       await api.fitnessActivities.bookSlot({
//         activityId: selectedActivity,
//         slotId: slot.slotId,
//         date,
//         customerName: memberName,
//         phone: "0000000000"
//       });
//       toast.success("Booked successfully");
//       fetchAvailability();
//       fetchBookings();
//       setMemberName('');
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//         err?.message ||
//         "Booking failed"
//       );
//     }
//   };

//   /* =========================
//      CANCEL BOOKING
//   ========================= */
//   const handleCancel = async (id) => {
//     try {
//       await api.fitnessActivities.cancelBooking(id);
//       toast.success("Booking cancelled");
//       fetchBookings();
//       fetchAvailability();
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//         err?.message ||
//         "Cancel failed"
//       );
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//     fetchBookings();
//   }, []);

//   useEffect(() => {
//     fetchAvailability();
//   }, [selectedActivity, date]);

//   // Filtered bookings
//   const filteredBookings = bookings.filter(b => {
//     const matchMember = b.customerName?.toLowerCase().includes(filterMember.toLowerCase());
//     const matchActivity = filterActivity === '' || b.activityName === filterActivity;
//     return matchMember && matchActivity;
//   });

//   // Unique activity names for filter dropdown
//   const uniqueActivities = [...new Set(bookings.map(b => b.activityName).filter(Boolean))];

//   return (
//     <div className="space-y-6">

//       {/* BOOK ACTIVITY CARD */}
//       <div className="max-w-xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
//         <h2 className="text-lg font-semibold">Book Activity</h2>

//         <div className="flex gap-3">
//           <select
//             value={selectedActivity}
//             onChange={(e) => setSelectedActivity(e.target.value)}
//             className="flex-1 border rounded-lg px-3 py-2 text-sm"
//           >
//             <option value="">Select Activity</option>
//             {activities.map(a => (
//               <option key={a._id} value={a._id}>{a.name}</option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="border rounded-lg px-3 py-2 text-sm"
//           />
//         </div>

//         <input
//           type="text"
//           placeholder="Enter member name"
//           value={memberName}
//           onChange={(e) => setMemberName(e.target.value)}
//           className="w-full border rounded-lg px-3 py-2 text-sm"
//         />

//         <div>
//           <h3 className="text-sm font-semibold mb-2">Available Slots</h3>
//           <div className="border rounded-lg overflow-hidden">
//             {slots.length === 0 && (
//               <div className="text-center py-5 text-gray-400 text-sm">No slots available</div>
//             )}
//             {slots.map(slot => {
//               const isFull = slot.booked >= slot.capacity;
//               return (
//                 <div
//                   key={slot.slotId}
//                   className="flex justify-between items-center px-4 py-3 border-t"
//                 >
//                   <div>
//                     <p className="text-sm font-medium">{slot.startTime} - {slot.endTime}</p>
//                     <p className="text-xs text-gray-500">{slot.booked}/{slot.capacity} booked</p>
//                   </div>
//                   <button
//                     disabled={isFull}
//                     onClick={() => handleBook(slot)}
//                     className={`px-4 py-1.5 text-sm rounded-md text-white ${
//                       isFull ? 'bg-gray-400' : 'bg-[#000359] hover:bg-[#000280]'
//                     }`}
//                   >
//                     {isFull ? 'Full' : 'Book'}
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* BOOKING TABLE SECTION */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

//         {/* Header Row */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
//         </div>

//         {/* Filters Row */}
//         <div className="flex flex-wrap gap-3 mb-5">
//           {/* Member Search */}
//           <input
//             type="text"
//             placeholder="Search Member Name"
//             value={filterMember}
//             onChange={(e) => setFilterMember(e.target.value)}
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
//           />

//           {/* Activity Filter */}
//           <select
//             value={filterActivity}
//             onChange={(e) => setFilterActivity(e.target.value)}
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
//           >
//             <option value="">All Activities</option>
//             {uniqueActivities.map(name => (
//               <option key={name} value={name}>{name}</option>
//             ))}
//           </select>

//           {/* Clear Filters */}
//           {(filterMember || filterActivity) && (
//             <button
//               onClick={() => { setFilterMember(''); setFilterActivity(''); }}
//               className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
//             >
//               Clear Filters
//             </button>
//           )}
//         </div>

//         {/* Table */}
//         <div className="rounded-xl overflow-hidden border border-gray-200">
//           <table className="w-full text-sm">

//             {/* Dark Navy Header */}
//             <thead>
//               <tr style={{ backgroundColor: '#000359' }}>
//                 <th className="text-left px-5 py-3.5 text-white font-semibold">Member</th>
//                 <th className="text-left px-5 py-3.5 text-white font-semibold">Activity</th>
//                 <th className="text-left px-5 py-3.5 text-white font-semibold">Slot</th>
//                 <th className="text-left px-5 py-3.5 text-white font-semibold">Date</th>
//                 <th className="text-left px-5 py-3.5 text-white font-semibold">Action</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100">
//               {filteredBookings.length === 0 && (
//                 <tr>
//                   <td colSpan="5" className="text-center py-10 text-gray-400 text-sm">
//                     {bookings.length === 0 ? 'No bookings yet' : 'No results match your filters'}
//                   </td>
//                 </tr>
//               )}

//               {filteredBookings.map((b, idx) => (
//                 <tr
//                   key={b._id}
//                   className={`hover:bg-blue-50 transition-colors duration-150 ${
//                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                   }`}
//                 >
//                   <td className="px-5 py-3.5 font-semibold text-gray-800">{b.customerName}</td>
//                   <td className="px-5 py-3.5 text-gray-600">{b.activityName}</td>
//                   <td className="px-5 py-3.5 text-gray-600">{b.slotTime}</td>
//                   <td className="px-5 py-3.5 text-gray-600">{b.date}</td>
//                   <td className="px-5 py-3.5">
//                     <button
//                       onClick={() => handleCancel(b._id)}
//                       className="px-4 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>
//         </div>

//         {/* Row Count */}
//         {filteredBookings.length > 0 && (
//           <p className="text-xs text-gray-400 mt-3">
//             Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
//           </p>
//         )}

//       </div>

//     </div>
//   );
// }





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

  // Filter states
  const [filterMember, setFilterMember] = useState('');
  const [filterActivity, setFilterActivity] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [members, setMembers] = useState([]);
const [filteredMembers, setFilteredMembers] = useState([]);

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
  try {
    const res = await api.fitnessActivities.getBookings();

    console.log("BOOKINGS API:", res.data); // 👈 DEBUG

    const data =
      res.data?.data ||
      res.data?.bookings ||
      res.data ||
      [];

    setBookings(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("FETCH BOOKINGS ERROR:", err);
    setBookings([]);
  }
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
        "Booking failed"
      );
    }
  };
    /* =========================
     BOOK SLOT
  ========================= */

  const fetchMembers = async () => {
  try {
    const res = await api.fitnessMember.getAll();

    const data =
      res.data?.data ||
      res.data ||
      [];

    setMembers(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("MEMBER FETCH ERROR:", err);
  }
};


  /* =========================
     CANCEL BOOKING
  ========================= */
  const handleCancel = async (id) => {
    try {
      await api.fitnessActivities.cancelBooking(id);
      toast.success("Booking cancelled");
      fetchBookings();
      fetchAvailability();
    } catch (err) {
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
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [selectedActivity, date]);

  useEffect(() => {
  if (!memberName.trim()) {
    setFilteredMembers([]);
    return;
  }

  const filtered = members.filter(m => {
    const name = (m.name || m.fullName || "").toLowerCase();
    return name.includes(memberName.toLowerCase());
  });

  setFilteredMembers(filtered);
}, [memberName, members]);

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchMember = b.customerName?.toLowerCase().includes(filterMember.toLowerCase());
    const matchActivity = filterActivity === '' || b.activityName === filterActivity;
    const matchDate = filterDate === '' || b.date === filterDate;
    return matchMember && matchActivity && matchDate;
  });

  // Unique activity names for filter dropdown
  const uniqueActivities = [...new Set(bookings.map(b => b.activityName).filter(Boolean))];

  return (
    <div className="space-y-6">

      {/* BOOK ACTIVITY CARD */}
      <div className="max-w-xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold">Book Activity</h2>

        <div className="flex gap-3">
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select Activity</option>
            {activities.map(a => (
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <input
          type="text"
          placeholder="Enter member name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
        {filteredMembers.length > 0 && (
  <div className="border rounded-lg mt-1 max-h-40 overflow-y-auto bg-white shadow">
    {filteredMembers.map(m => {
      const displayName = m.name || m.fullName || "Unknown";

      return (
        <div
          key={m._id}
          onClick={() => {
            setMemberName(displayName);
            setFilteredMembers([]);
          }}
          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
        >
          {displayName}
        </div>
      );
    })}
  </div>
)}

        <div>
          <h3 className="text-sm font-semibold mb-2">Available Slots</h3>
          <div className="border rounded-lg overflow-hidden">
            {slots.length === 0 && (
              <div className="text-center py-5 text-gray-400 text-sm">No slots available</div>
            )}
            {slots.map(slot => {
              const isFull = slot.booked >= slot.capacity;
              return (
                <div
                  key={slot.slotId}
                  className="flex justify-between items-center px-4 py-3 border-t"
                >
                  <div>
                    <p className="text-sm font-medium">{slot.startTime} - {slot.endTime}</p>
                    <p className="text-xs text-gray-500">{slot.booked}/{slot.capacity} booked</p>
                  </div>
                  <button
                    disabled={isFull}
                    onClick={() => handleBook(slot)}
                    className={`px-4 py-1.5 text-sm rounded-md text-white ${
                      isFull ? 'bg-gray-400' : 'bg-[#000359] hover:bg-[#000280]'
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

      {/* BOOKING TABLE SECTION */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 mb-5">

          {/* Member Search */}
          <input
            type="text"
            placeholder="Search Member Name"
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
          />

          {/* Activity Filter */}
          <select
            value={filterActivity}
            onChange={(e) => setFilterActivity(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
          >
            <option value="">All Activities</option>
            {uniqueActivities.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
          />

          {/* Clear Filters */}
          {(filterMember || filterActivity || filterDate) && (
            <button
              onClick={() => { setFilterMember(''); setFilterActivity(''); setFilterDate(''); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#000359' }}>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Member</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Activity</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Slot</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Date</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400 text-sm">
                    {bookings.length === 0 ? 'No bookings yet' : 'No results match your filters'}
                  </td>
                </tr>
              )}

              {filteredBookings.map((b, idx) => (
                <tr
                  key={b._id}
                  className={`hover:bg-blue-50 transition-colors duration-150 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{b.customerName}</td>
                  <td className="px-5 py-3.5 text-gray-600">{b.activityName}</td>
                  <td className="px-5 py-3.5 text-gray-600">{b.slotTime}</td>
                  <td className="px-5 py-3.5 text-gray-600">{b.date}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="px-4 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length > 0 && (
          <p className="text-xs text-gray-400 mt-3">
            Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>
    </div>
  );
}