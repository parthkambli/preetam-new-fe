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
//   const [filterDate, setFilterDate] = useState('');

//   const [members, setMembers] = useState([]);
// const [filteredMembers, setFilteredMembers] = useState([]);

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
//   try {
//     const res = await api.fitnessActivities.getBookings();

//     console.log("BOOKINGS API:", res.data); // 👈 DEBUG

//     const data =
//       res.data?.data ||
//       res.data?.bookings ||
//       res.data ||
//       [];

//     setBookings(Array.isArray(data) ? data : []);
//   } catch (err) {
//     console.error("FETCH BOOKINGS ERROR:", err);
//     setBookings([]);
//   }
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
//     /* =========================
//      BOOK SLOT
//   ========================= */

//   const fetchMembers = async () => {
//   try {
//     const res = await api.fitnessMember.getAll();

//     const data =
//       res.data?.data ||
//       res.data ||
//       [];

//     setMembers(Array.isArray(data) ? data : []);
//   } catch (err) {
//     console.error("MEMBER FETCH ERROR:", err);
//   }
// };


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
//     fetchMembers();
//   }, []);

//   useEffect(() => {
//     fetchAvailability();
//   }, [selectedActivity, date]);

//   useEffect(() => {
//   if (!memberName.trim()) {
//     setFilteredMembers([]);
//     return;
//   }

//   const filtered = members.filter(m => {
//     const name = (m.name || m.fullName || "").toLowerCase();
//     return name.includes(memberName.toLowerCase());
//   });

//   setFilteredMembers(filtered);
// }, [memberName, members]);

//   // Filtered bookings
//   const filteredBookings = bookings.filter(b => {
//     const matchMember = b.customerName?.toLowerCase().includes(filterMember.toLowerCase());
//     const matchActivity = filterActivity === '' || b.activityName === filterActivity;
//     const matchDate = filterDate === '' || b.date === filterDate;
//     return matchMember && matchActivity && matchDate;
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
//         {filteredMembers.length > 0 && (
//   <div className="border rounded-lg mt-1 max-h-40 overflow-y-auto bg-white shadow">
//     {filteredMembers.map(m => {
//       const displayName = m.name || m.fullName || "Unknown";

//       return (
//         <div
//           key={m._id}
//           onClick={() => {
//             setMemberName(displayName);
//             setFilteredMembers([]);
//           }}
//           className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//         >
//           {displayName}
//         </div>
//       );
//     })}
//   </div>
// )}

//         <div>
//           <h3 className="text-sm font-semibold mb-2">Available Slots</h3>
//           <div className="border rounded-lg overflow-hidden">
//             {slots.length === 0 && (
//               <div className="text-center py-5 text-gray-400 text-sm">No slots available</div>
//             )}
//             {slots
//               .filter(slot => slot.membersOnly === false)   // ✅ Only show open slots
//               .map(slot => {
//                 const isFull = slot.booked >= slot.capacity;
//                 return (
//                   <div
//                     key={slot.slotId}
//                     className="flex justify-between items-center px-4 py-3 border-t"
//                   >
//                     <div>
//                       <p className="text-sm font-medium">
//                         {slot.startTime} - {slot.endTime}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {slot.booked}/{slot.capacity} booked • Open to All
//                       </p>
//                     </div>
//                     <button
//                       disabled={isFull}
//                       onClick={() => handleBook(slot)}
//                       className={`px-4 py-1.5 text-sm rounded-md text-white ${
//                         isFull ? 'bg-gray-400' : 'bg-[#000359] hover:bg-[#000280]'
//                       }`}
//                     >
//                       {isFull ? 'Full' : 'Book'}
//                     </button>
//                   </div>
//                 );
//               })}

//             {slots.filter(slot => slot.membersOnly === false).length === 0 && (
//               <div className="text-center py-8 text-gray-400">
//                 No open slots available for walk-in booking
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* BOOKING TABLE SECTION */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

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

//           {/* Date Filter */}
//           <input
//             type="date"
//             value={filterDate}
//             onChange={(e) => setFilterDate(e.target.value)}
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
//           />

//           {/* Clear Filters */}
//           {(filterMember || filterActivity || filterDate) && (
//             <button
//               onClick={() => { setFilterMember(''); setFilterActivity(''); setFilterDate(''); }}
//               className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
//             >
//               Clear Filters
//             </button>
//           )}
//         </div>

//         {/* Table */}
//         <div className="rounded-xl overflow-hidden border border-gray-200">
//           <table className="w-full text-sm">
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

//         {filteredBookings.length > 0 && (
//           <p className="text-xs text-gray-400 mt-3">
//             Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
//           </p>
//         )}

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
//   const [filterDate, setFilterDate] = useState('');

//   const [members, setMembers] = useState([]);
//   const [filteredMembers, setFilteredMembers] = useState([]);

//   // Fee Details for booking
//   const [plan, setPlan] = useState('Daily');
//   const [amount, setAmount] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState('Paid');
//   const [paymentMode, setPaymentMode] = useState('Cash');
//   const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

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
//     try {
//       const res = await api.fitnessActivities.getBookings();
//       const data = res.data?.data || res.data?.bookings || res.data || [];
//       setBookings(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("FETCH BOOKINGS ERROR:", err);
//       setBookings([]);
//     }
//   };

//   /* =========================
//      FETCH MEMBERS (for suggestions)
//   ========================= */
//   const fetchMembers = async () => {
//     try {
//       const res = await api.fitnessMember.getAll();
//       const data = res.data?.data || res.data || [];
//       setMembers(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("MEMBER FETCH ERROR:", err);
//     }
//   };

//   /* =========================
//      BOOK SLOT — Updated with Fee Details
//   ========================= */
//   const handleBook = async (slot) => {
//     if (!memberName.trim()) {
//       toast.error("Enter member name");
//       return;
//     }
//     if (!amount || Number(amount) <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }

//     try {
//       await api.fitnessActivities.bookSlot({
//         activityId: selectedActivity,
//         slotId: slot.slotId,
//         date,
//         customerName: memberName,
//         phone: "0000000000",
//         // Fee details for proper allotment & payment record
//         plan: plan,
//         amount: Number(amount),
//         paymentStatus: paymentStatus,
//         paymentMode: paymentMode,
//         paymentDate: paymentDate,
//       });

//       toast.success("Booked successfully");
//       fetchAvailability();
//       fetchBookings();

//       // Reset only member name and fee fields (keep activity & date)
//       setMemberName('');
//       setAmount('');
//       setPaymentStatus('Paid');
//       setPaymentMode('Cash');
//       setPaymentDate(new Date().toISOString().split('T')[0]);
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
//     fetchMembers();
//   }, []);

//   useEffect(() => {
//     fetchAvailability();
//   }, [selectedActivity, date]);

//   // Member name suggestion
//   useEffect(() => {
//     if (!memberName.trim()) {
//       setFilteredMembers([]);
//       return;
//     }
//     const filtered = members.filter(m => {
//       const name = (m.name || m.fullName || "").toLowerCase();
//       return name.includes(memberName.toLowerCase());
//     });
//     setFilteredMembers(filtered);
//   }, [memberName, members]);

//   // Filtered bookings for table
//   const filteredBookings = bookings.filter(b => {
//     const matchMember = b.customerName?.toLowerCase().includes(filterMember.toLowerCase());
//     const matchActivity = filterActivity === '' || b.activityName === filterActivity;
//     const matchDate = filterDate === '' || b.date === filterDate;
//     return matchMember && matchActivity && matchDate;
//   });

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

//         {/* Member Name - Free text (kept exactly as before) */}
//         <input
//           type="text"
//           placeholder="Enter member name"
//           value={memberName}
//           onChange={(e) => setMemberName(e.target.value)}
//           className="w-full border rounded-lg px-3 py-2 text-sm"
//         />
//         {filteredMembers.length > 0 && (
//           <div className="border rounded-lg mt-1 max-h-40 overflow-y-auto bg-white shadow">
//             {filteredMembers.map(m => {
//               const displayName = m.name || m.fullName || "Unknown";
//               return (
//                 <div
//                   key={m._id}
//                   onClick={() => {
//                     setMemberName(displayName);
//                     setFilteredMembers([]);
//                   }}
//                   className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//                 >
//                   {displayName}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* ── NEW: Fee Details Section ── */}
//         <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
//           <h3 className="text-sm font-semibold mb-3 text-gray-700">Fee Details (for 1-day / ad-hoc booking)</h3>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Plan</label>
//               <select
//                 value={plan}
//                 onChange={(e) => setPlan(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               >
//                 <option value="Daily">Daily</option>
//                 <option value="Hourly">Hourly</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Amount (₹)</label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="Enter amount"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
//               <select
//                 value={paymentStatus}
//                 onChange={(e) => setPaymentStatus(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               >
//                 <option value="Paid">Paid</option>
//                 <option value="Pending">Pending</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
//               <select
//                 value={paymentMode}
//                 onChange={(e) => setPaymentMode(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               >
//                 <option value="Cash">Cash</option>
//                 <option value="Online">Online</option>
//                 <option value="UPI">UPI</option>
//                 <option value="Cheque">Cheque</option>
//               </select>
//             </div>

//             <div className="sm:col-span-2">
//               <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
//               <input
//                 type="date"
//                 value={paymentDate}
//                 onChange={(e) => setPaymentDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               />
//             </div>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-sm font-semibold mb-2">Available Slots</h3>
//           <div className="border rounded-lg overflow-hidden">
//             {slots.length === 0 && (
//               <div className="text-center py-5 text-gray-400 text-sm">No slots available</div>
//             )}
//             {slots
//               .filter(slot => slot.membersOnly === false)
//               .map(slot => {
//                 const isFull = slot.booked >= slot.capacity;
//                 return (
//                   <div
//                     key={slot.slotId}
//                     className="flex justify-between items-center px-4 py-3 border-t"
//                   >
//                     <div>
//                       <p className="text-sm font-medium">
//                         {slot.startTime} - {slot.endTime}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {slot.booked}/{slot.capacity} booked • Open to All
//                       </p>
//                     </div>
//                     <button
//                       disabled={isFull}
//                       onClick={() => handleBook(slot)}
//                       className={`px-4 py-1.5 text-sm rounded-md text-white ${
//                         isFull ? 'bg-gray-400' : 'bg-[#000359] hover:bg-[#000280]'
//                       }`}
//                     >
//                       {isFull ? 'Full' : 'Book'}
//                     </button>
//                   </div>
//                 );
//               })}

//             {slots.filter(slot => slot.membersOnly === false).length === 0 && (
//               <div className="text-center py-8 text-gray-400">
//                 No open slots available for walk-in booking
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* BOOKING TABLE SECTION - Unchanged */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
//         </div>

//         <div className="flex flex-wrap gap-3 mb-5">
//           <input
//             type="text"
//             placeholder="Search Member Name"
//             value={filterMember}
//             onChange={(e) => setFilterMember(e.target.value)}
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
//           />

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

//           <input
//             type="date"
//             value={filterDate}
//             onChange={(e) => setFilterDate(e.target.value)}
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
//           />

//           {(filterMember || filterActivity || filterDate) && (
//             <button
//               onClick={() => { setFilterMember(''); setFilterActivity(''); setFilterDate(''); }}
//               className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
//             >
//               Clear Filters
//             </button>
//           )}
//         </div>

//         <div className="rounded-xl overflow-hidden border border-gray-200">
//           <table className="w-full text-sm">
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

//         {filteredBookings.length > 0 && (
//           <p className="text-xs text-gray-400 mt-3">
//             Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }













// const FitnessActivity = require('../models/FitnessActivity');
// const FitnessBooking = require('../models/FitnessBooking');
// const FitnessMember = require('../models/FitnessMember');
// const FeeAllotment = require('../models/FitnessFeeAllotment');
// const FeePayment = require('../models/FitnessFeePayment');
// const mongoose = require('mongoose');

// /* =========================
//    HELPER: CHECK OVERLAP
// ========================= */
// function isOverlapping(slot1, slot2) {
//   return (
//     slot1.startTime < slot2.endTime &&
//     slot2.startTime < slot1.endTime
//   );
// }

// /* =========================
//    HELPER: Generate dates between start and end (inclusive)
// ========================= */
// function getDatesInRange(startDate, endDate) {
//   const dates = [];
//   let current = new Date(startDate);
//   const end = new Date(endDate);

//   while (current <= end) {
//     dates.push(current.toISOString().split('T')[0]);
//     current.setDate(current.getDate() + 1);
//   }
//   return dates;
// }

// /* =========================
//    HELPER: Generate recurring bookings for a member
// ========================= */
// exports.generateRecurringBookings = async (memberId, activityFeeIndex, activityId, slotId, startDate, endDate, customerName, phone) => {
//   const dates = getDatesInRange(startDate, endDate);
//   const bookings = [];

//   for (const date of dates) {
//     bookings.push({
//       activityId,
//       slotId,
//       date,
//       memberId: memberId || null,
//       activityFeeIndex,
//       isRecurring: true,
//       isException: false,
//       customerName: customerName || "Walk-in",
//       phone
//     });
//   }

//   if (bookings.length > 0) {
//     await FitnessBooking.insertMany(bookings);
//   }

//   return bookings.length;
// };

// /* =========================
//    ➕ CREATE ACTIVITY, UPDATE, DELETE, GET (unchanged - keeping as is)
// ========================= */
// // ... (All your createActivity, getActivities, updateActivity, deleteActivity, getAvailability functions remain exactly the same)
// // Paste them here as they are. I'm skipping them for brevity since you already have them working.

// exports.getActivities = async (req, res) => { /* your code */ };
// exports.getActivityById = async (req, res) => { /* your code */ };
// exports.updateActivity = async (req, res) => { /* your code */ };
// exports.deleteActivity = async (req, res) => { /* your code */ };
// exports.getAvailability = async (req, res) => { /* your code */ };

// /* =========================
//    🎯 BOOK SLOT - FINAL CLEAN VERSION
// ========================= */
// exports.bookSlot = async (req, res) => {
//   try {
//     const {
//       activityId,
//       slotId,
//       date,
//       customerName,
//       phone = "0000000000",
//       memberId,
//       plan = "Daily",
//       amount,
//       paymentStatus = "Paid",
//       paymentMode = "Cash",
//       paymentDate
//     } = req.body;

//     if (!activityId || !slotId || !date || !customerName?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'activityId, slotId, date, and customerName are required'
//       });
//     }

//     if (!amount || Number(amount) <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid fee amount is required'
//       });
//     }

//     const activity = await FitnessActivity.findById(activityId);
//     if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

//     const slot = activity.slots.id(slotId);
//     if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

//     // Capacity check
//     const existingCount = await FitnessBooking.countDocuments({ slotId, date: new Date(date) });
//     if (existingCount >= activity.capacity) {
//       return res.status(400).json({ success: false, message: 'Slot is full' });
//     }

//     // Case 1: Existing member changing time slot on the same day
//     if (memberId) {
//       const existingBooking = await FitnessBooking.findOne({
//         memberId,
//         activityId,
//         date: new Date(date)
//       });

//       if (existingBooking) {
//         existingBooking.slotId = slotId;
//         await existingBooking.save();

//         return res.json({
//           success: true,
//           message: 'Member slot updated successfully',
//           booking: existingBooking
//         });
//       }
//     }

//     // Case 2: New booking (walk-in or extra session)
//     const booking = await FitnessBooking.create({
//       activityId,
//       slotId,
//       date: new Date(date),
//       memberId: memberId || null,
//       customerName: customerName.trim(),
//       phone,
//       isRecurring: false,
//       isException: true
//     });

//     // Create Fee Records
//     const numAmount = Number(amount);
//     const finalPaymentDate = paymentDate ? new Date(paymentDate) : new Date();

//     const allotment = await FeeAllotment.create({
//       memberId: memberId || null,
//       feeTypeId: null,
//       description: `Ad-hoc Booking - ${activity.name} (${plan})`,
//       feePlan: plan,
//       amount: numAmount,
//       dueDate: new Date(date),
//       status: paymentStatus === 'Paid' ? 'Paid' : 'Pending',
//       organizationId: req.organizationId,
//     });

//     if (paymentStatus === 'Paid') {
//       await FeePayment.create({
//         memberId: memberId || null,
//         allotmentId: allotment._id,
//         amount: numAmount,
//         paymentMode,
//         paymentDate: finalPaymentDate,
//         description: `Booking: ${activity.name} - ${plan} on ${new Date(date).toLocaleDateString('en-IN')}`,
//         organizationId: req.organizationId,
//       });

//       allotment.status = 'Paid';
//       await allotment.save();
//     }

//     res.json({
//       success: true,
//       message: memberId ? 'Extra session booked with fee record' : 'Walk-in booking created with fee record',
//       booking,
//       allotmentId: allotment._id
//     });

//   } catch (err) {
//     console.error("Book Slot Error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.message || 'Failed to book slot' 
//     });
//   }
// };

// /* =========================
//    📋 GET ALL BOOKINGS
// ========================= */
// exports.getBookings = async (req, res) => {
//   try {
//     const bookings = await FitnessBooking.find()
//       .populate('activityId')
//       .sort({ createdAt: -1 });

//     const formatted = bookings.map(b => {
//       let activityName = 'N/A';
//       let slotTime = 'N/A';

//       if (b.activityId && b.activityId.slots) {
//         activityName = b.activityId.name;
//         const slot = b.activityId.slots.id(b.slotId);
//         if (slot) slotTime = `${slot.startTime} - ${slot.endTime}`;
//       }

//       return {
//         _id: b._id,
//         customerName: b.customerName,
//         activityName,
//         slotTime,
//         date: b.date ? b.date.toISOString().split('T')[0] : null,
//         isRecurring: b.isRecurring,
//         isException: b.isException
//       };
//     });

//     res.json({ success: true, data: formatted });
//   } catch (err) {
//     console.error("getBookings error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* =========================
//    📋 CANCEL BOOKING
// ========================= */
// exports.cancelBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await FitnessBooking.findByIdAndDelete(id);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//     res.json({ success: true, message: 'Booking cancelled successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };














import { useEffect, useState } from 'react';
import { api } from '../../../services/apiClient';
import { toast } from 'sonner';
import Select from 'react-select';

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

  // Fee Details with Fee Type support
  const [feeTypeOptions, setFeeTypeOptions] = useState([]);
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [plan, setPlan] = useState('Daily');
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  /* =========================
     FETCH DATA
  ========================= */
  const fetchActivities = async () => {
    const res = await api.fitnessActivities.getAll();
    setActivities(res.data.data || []);
  };

  const fetchFeeTypes = async () => {
    try {
      const res = await api.fitnessFees.getTypes();
      const types = res.data || [];
      setFeeTypeOptions(types.map(ft => ({
        value: ft._id,
        label: ft.description,
        data: ft
      })));
    } catch (err) {
      console.error("Failed to load fee types", err);
    }
  };

  const fetchAvailability = async () => {
    if (!selectedActivity || !date) return;
    const res = await api.fitnessActivities.availability({
      activityId: selectedActivity,
      date
    });
    setSlots(res.data.data || []);
  };

  const fetchBookings = async () => {
    try {
      const res = await api.fitnessActivities.getBookings();
      const data = res.data?.data || res.data?.bookings || res.data || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH BOOKINGS ERROR:", err);
      setBookings([]);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.fitnessMember.getAll();
      const data = res.data?.data || res.data || [];
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("MEMBER FETCH ERROR:", err);
    }
  };

  /* =========================
     AUTO-FILL AMOUNT when Fee Type + Plan changes
  ========================= */
  useEffect(() => {
    if (!selectedFeeType?.data || !plan) return;

    const feeData = selectedFeeType.data;
    const planMap = {
      Annual: 'annual',
      Monthly: 'monthly',
      Weekly: 'weekly',
      Daily: 'daily',
      Hourly: 'hourly'
    };

    const key = planMap[plan];
    const autoAmount = feeData[key] || 0;
    setAmount(autoAmount.toString());
  }, [selectedFeeType, plan]);

  /* =========================
     BOOK SLOT
  ========================= */
  const handleBook = async (slot) => {
    if (!memberName.trim()) {
      toast.error("Enter member name");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await api.fitnessActivities.bookSlot({
        activityId: selectedActivity,
        slotId: slot.slotId,
        date,
        customerName: memberName,
        phone: "0000000000",
        feeTypeId: selectedFeeType?.value || null,
        plan: plan,
        amount: Number(amount),
        paymentStatus: paymentStatus,
        paymentMode: paymentMode,
        paymentDate: paymentDate,
      });

      toast.success("Booked successfully");
      fetchAvailability();
      fetchBookings();

      // Reset form
      setMemberName('');
      setSelectedFeeType(null);
      setAmount('');
      setPaymentStatus('Paid');
      setPaymentMode('Cash');
      setPaymentDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Booking failed");
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
      toast.error(err?.response?.data?.message || err?.message || "Cancel failed");
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchFeeTypes();
    fetchBookings();
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [selectedActivity, date]);

  // Member name suggestion
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

  const filteredBookings = bookings.filter(b => {
    const matchMember = b.customerName?.toLowerCase().includes(filterMember.toLowerCase());
    const matchActivity = filterActivity === '' || b.activityName === filterActivity;
    const matchDate = filterDate === '' || b.date === filterDate;
    return matchMember && matchActivity && matchDate;
  });

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

        {/* Fee Details Section with Fee Type */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">Fee Details (for 1-day / ad-hoc booking)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fee Type</label>
              <Select
                options={feeTypeOptions}
                value={selectedFeeType}
                onChange={setSelectedFeeType}
                placeholder="Select fee type (optional)"
                isClearable
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="Daily">Daily</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Available Slots</h3>
          <div className="border rounded-lg overflow-hidden">
            {slots.length === 0 && (
              <div className="text-center py-5 text-gray-400 text-sm">No slots available</div>
            )}
            {slots
              .filter(slot => slot.membersOnly === false)
              .map(slot => {
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
                        {slot.booked}/{slot.capacity} booked • Open to All
                      </p>
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

            {slots.filter(slot => slot.membersOnly === false).length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No open slots available for walk-in booking
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOOKING TABLE SECTION - Unchanged */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <input
            type="text"
            placeholder="Search Member Name"
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
          />

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

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent"
          />

          {(filterMember || filterActivity || filterDate) && (
            <button
              onClick={() => { setFilterMember(''); setFilterActivity(''); setFilterDate(''); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          )}
        </div>

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