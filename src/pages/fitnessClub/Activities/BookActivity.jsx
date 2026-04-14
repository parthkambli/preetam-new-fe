// import { useEffect, useState } from 'react';
// import { api } from '../../../services/apiClient';
// import { toast } from 'sonner';
// import Select from 'react-select';

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

//   // Fee Details with Fee Type support
//   const [feeTypeOptions, setFeeTypeOptions] = useState([]);
//   const [selectedFeeType, setSelectedFeeType] = useState(null);
//   const [plan, setPlan] = useState('Daily');
//   const [amount, setAmount] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState('Paid');
//   const [paymentMode, setPaymentMode] = useState('Cash');
//   const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

//   /* =========================
//      FETCH DATA
//   ========================= */
//   const fetchActivities = async () => {
//     const res = await api.fitnessActivities.getAll();
//     setActivities(res.data.data || []);
//   };

//   const fetchFeeTypes = async () => {
//     try {
//       const res = await api.fitnessFees.getTypes();
//       const types = res.data || [];
//       setFeeTypeOptions(types.map(ft => ({
//         value: ft._id,
//         label: ft.description,
//         data: ft
//       })));
//     } catch (err) {
//       console.error("Failed to load fee types", err);
//     }
//   };

//   const fetchAvailability = async () => {
//     if (!selectedActivity || !date) return;
//     const res = await api.fitnessActivities.availability({
//       activityId: selectedActivity,
//       date
//     });
//     setSlots(res.data.data || []);
//   };

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
//      AUTO-FILL AMOUNT when Fee Type + Plan changes
//   ========================= */
//   useEffect(() => {
//     if (!selectedFeeType?.data || !plan) return;

//     const feeData = selectedFeeType.data;
//     const planMap = {
//       Annual: 'annual',
//       Monthly: 'monthly',
//       Weekly: 'weekly',
//       Daily: 'daily',
//       Hourly: 'hourly'
//     };

//     const key = planMap[plan];
//     const autoAmount = feeData[key] || 0;
//     setAmount(autoAmount.toString());
//   }, [selectedFeeType, plan]);

//   /* =========================
//      BOOK SLOT
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
//         feeTypeId: selectedFeeType?.value || null,
//         plan: plan,
//         amount: Number(amount),
//         paymentStatus: paymentStatus,
//         paymentMode: paymentMode,
//         paymentDate: paymentDate,
//       });

//       toast.success("Booked successfully");
//       fetchAvailability();
//       fetchBookings();

//       // Reset form
//       setMemberName('');
//       setSelectedFeeType(null);
//       setAmount('');
//       setPaymentStatus('Paid');
//       setPaymentMode('Cash');
//       setPaymentDate(new Date().toISOString().split('T')[0]);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || err?.message || "Booking failed");
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
//       toast.error(err?.response?.data?.message || err?.message || "Cancel failed");
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//     fetchFeeTypes();
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

//       {/* Available Slots — all slots shown, no membersOnly filter */}
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

//         {/* Fee Details Section with Fee Type */}
//         <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
//           <h3 className="text-sm font-semibold mb-3 text-gray-700">Fee Details (for 1-day / ad-hoc booking)</h3>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Fee Type</label>
//               <Select
//                 options={feeTypeOptions}
//                 value={selectedFeeType}
//                 onChange={setSelectedFeeType}
//                 placeholder="Select fee type (optional)"
//                 isClearable
//                 classNamePrefix="react-select"
//               />
//             </div>

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

//             <div>
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
//       </div>

//       {/* BOOKING TABLE SECTION */}
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






// import { useEffect, useState } from 'react';
// import { api } from '../../../services/apiClient';
// import { toast } from 'sonner';
// import Select from 'react-select';

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

//   // Fee Details
//   const [feeTypeOptions, setFeeTypeOptions] = useState([]);
//   const [selectedFeeType, setSelectedFeeType] = useState(null);
//   const [plan, setPlan] = useState('Daily');
//   const [amount, setAmount] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState('Paid');
//   const [paymentMode, setPaymentMode] = useState('Cash');
//   const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

//   /* =========================
//      FETCH DATA
//   ========================= */
//   const fetchActivities = async () => {
//     const res = await api.fitnessActivities.getAll();
//     setActivities(res.data.data || []);
//   };

//   const fetchFeeTypes = async () => {
//     try {
//       const res = await api.fitnessFees.getTypes();
//       const types = res.data || [];
//       setFeeTypeOptions(types.map(ft => ({
//         value: ft._id,
//         label: ft.description,
//         data: ft
//       })));
//     } catch (err) {
//       console.error("Failed to load fee types", err);
//     }
//   };

//   const fetchAvailability = async () => {
//     if (!selectedActivity || !date) return;
//     const res = await api.fitnessActivities.availability({
//       activityId: selectedActivity,
//       date
//     });
//     setSlots(res.data.data || []);
//   };

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
//      AUTO-FILL AMOUNT
//   ========================= */
//   useEffect(() => {
//     if (!selectedFeeType?.data || !plan) return;

//     const feeData = selectedFeeType.data;
//     const planMap = {
//       Annual: 'annual',
//       Monthly: 'monthly',
//       Weekly: 'weekly',
//       Daily: 'daily',
//       Hourly: 'hourly'
//     };

//     const key = planMap[plan];
//     const autoAmount = feeData[key] || 0;
//     setAmount(autoAmount.toString());
//   }, [selectedFeeType, plan]);

//   /* =========================
//      BOOK SLOT
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
//         feeTypeId: selectedFeeType?.value || null,
//         plan: plan,
//         amount: Number(amount),
//         paymentStatus: paymentStatus,
//         paymentMode: paymentMode,
//         paymentDate: paymentDate,
//       });

//       toast.success("Booked successfully");
//       fetchAvailability();
//       fetchBookings();

//       // Reset form
//       setMemberName('');
//       setSelectedFeeType(null);
//       setAmount('');
//       setPaymentStatus('Paid');
//       setPaymentMode('Cash');
//       setPaymentDate(new Date().toISOString().split('T')[0]);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || err?.message || "Booking failed");
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
//       toast.error(err?.response?.data?.message || err?.message || "Cancel failed");
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//     fetchFeeTypes();
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

//   const filteredBookings = bookings.filter(b => {
//     const matchMember = b.customerName?.toLowerCase().includes(filterMember.toLowerCase());
//     const matchActivity = filterActivity === '' || b.activityName === filterActivity;
//     const matchDate = filterDate === '' || b.date === filterDate;
//     return matchMember && matchActivity && matchDate;
//   });

//   const uniqueActivities = [...new Set(bookings.map(b => b.activityName).filter(Boolean))];

//   return (
//     <div className="space-y-6">
      
//       {/* ====================== BOOK ACTIVITY FORM ====================== */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
//         <h2 className="text-xl font-semibold mb-6">Book Activity</h2>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
//           {/* LEFT SIDE - Booking Details */}
//           <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <select
//                 value={selectedActivity}
//                 onChange={(e) => setSelectedActivity(e.target.value)}
//                 className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
//               >
//                 <option value="">Select Activity</option>
//                 {activities.map(a => (
//                   <option key={a._id} value={a._id}>{a.name}</option>
//                 ))}
//               </select>

//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>

//             <div>
//               <input
//                 type="text"
//                 placeholder="Enter member name"
//                 value={memberName}
//                 onChange={(e) => setMemberName(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
//               />

//               {filteredMembers.length > 0 && (
//                 <div className="border rounded-lg mt-1 max-h-48 overflow-y-auto bg-white shadow-sm z-10">
//                   {filteredMembers.map(m => {
//                     const displayName = m.name || m.fullName || "Unknown";
//                     return (
//                       <div
//                         key={m._id}
//                         onClick={() => {
//                           setMemberName(displayName);
//                           setFilteredMembers([]);
//                         }}
//                         className="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer border-b last:border-none"
//                       >
//                         {displayName}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Available Slots */}
//             <div>
//               <h3 className="text-sm font-semibold mb-3 text-gray-700">Available Slots</h3>
//               <div className="border border-gray-200 rounded-xl overflow-hidden min-h-[300px] bg-gray-50">
//                 {slots.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
//                     <p className="text-sm">No slots available</p>
//                     <p className="text-xs mt-1">Please select activity and date</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-100">
//                     {slots.map(slot => {
//                       const isFull = slot.booked >= slot.capacity;
//                       return (
//                         <div
//                           key={slot.slotId}
//                           className="flex justify-between items-center px-5 py-4 hover:bg-white transition-colors"
//                         >
//                           <div>
//                             <p className="font-medium text-gray-800">
//                               {slot.startTime} - {slot.endTime}
//                             </p>
//                             <p className="text-xs text-gray-500 mt-0.5">
//                               {slot.booked}/{slot.capacity} booked
//                             </p>
//                           </div>
//                           <button
//                             disabled={isFull}
//                             onClick={() => handleBook(slot)}
//                             className={`px-6 py-2 text-sm font-medium rounded-lg text-white transition-all ${
//                               isFull 
//                                 ? 'bg-gray-400 cursor-not-allowed' 
//                                 : 'bg-[#000359] hover:bg-[#000280] active:scale-95'
//                             }`}
//                           >
//                             {isFull ? 'Full' : 'Book Now'}
//                           </button>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE - Fee Details */}
//           <div className="lg:pt-12">
//             <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 sticky top-6">
//               <h3 className="text-sm font-semibold mb-5 text-gray-700">
//                 Fee Details (1-day / Ad-hoc Booking)
//               </h3>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-xs text-gray-600 mb-1.5">Fee Type (Optional)</label>
//                   <Select
//                     options={feeTypeOptions}
//                     value={selectedFeeType}
//                     onChange={setSelectedFeeType}
//                     placeholder="Select fee type"
//                     isClearable
//                     classNamePrefix="react-select"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs text-gray-600 mb-1.5">Plan</label>
//                   <select
//                     value={plan}
//                     onChange={(e) => setPlan(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
//                   >
//                     <option value="Daily">Daily</option>
//                     <option value="Hourly">Hourly</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-xs text-gray-600 mb-1.5">Amount (₹)</label>
//                   <input
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     placeholder="Enter amount"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs text-gray-600 mb-1.5">Payment Status</label>
//                   <select
//                     value={paymentStatus}
//                     onChange={(e) => setPaymentStatus(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
//                   >
//                     <option value="Paid">Paid</option>
//                     <option value="Pending">Pending</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-xs text-gray-600 mb-1.5">Payment Mode</label>
//                   <select
//                     value={paymentMode}
//                     onChange={(e) => setPaymentMode(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
//                   >
//                     <option value="Cash">Cash</option>
//                     <option value="Online">Online</option>
//                     <option value="UPI">UPI</option>
//                     <option value="Cheque">Cheque</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-xs text-gray-600 mb-1.5">Payment Date</label>
//                   <input
//                     type="date"
//                     value={paymentDate}
//                     onChange={(e) => setPaymentDate(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ====================== BOOKING TABLE ====================== */}
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
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#000359]"
//           />

//           <select
//             value={filterActivity}
//             onChange={(e) => setFilterActivity(e.target.value)}
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#000359]"
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
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
//           />

//           {(filterMember || filterActivity || filterDate) && (
//             <button
//               onClick={() => { 
//                 setFilterMember(''); 
//                 setFilterActivity(''); 
//                 setFilterDate(''); 
//               }}
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
//                   <td colSpan="5" className="text-center py-12 text-gray-400 text-sm">
//                     {bookings.length === 0 ? 'No bookings yet' : 'No results match your filters'}
//                   </td>
//                 </tr>
//               )}

//               {filteredBookings.map((b, idx) => (
//                 <tr
//                   key={b._id}
//                   className={`hover:bg-blue-50 transition-colors ${
//                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                   }`}
//                 >
//                   <td className="px-5 py-4 font-semibold text-gray-800">{b.customerName}</td>
//                   <td className="px-5 py-4 text-gray-600">{b.activityName}</td>
//                   <td className="px-5 py-4 text-gray-600">{b.slotTime}</td>
//                   <td className="px-5 py-4 text-gray-600">{b.date}</td>
//                   <td className="px-5 py-4">
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

  // Fee Details
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
     AUTO-FILL AMOUNT
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
      
      {/* ====================== BOOK ACTIVITY FORM ====================== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Book Activity</h2>

        {/* CHANGE 1: items-stretch makes both columns grow to match each other's height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT SIDE - Booking Details */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
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
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Enter member name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
              />

              {filteredMembers.length > 0 && (
                <div className="border rounded-lg mt-1 max-h-48 overflow-y-auto bg-white shadow-sm z-10">
                  {filteredMembers.map(m => {
                    const displayName = m.name || m.fullName || "Unknown";
                    return (
                      <div
                        key={m._id}
                        onClick={() => {
                          setMemberName(displayName);
                          setFilteredMembers([]);
                        }}
                        className="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer border-b last:border-none"
                      >
                        {displayName}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available Slots — CHANGE 2: reduced max-h from 300px implied to 180px, compact row padding */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Available Slots</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                {slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <p className="text-sm">No slots available</p>
                    <p className="text-xs mt-1">Please select activity and date</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[180px] overflow-y-auto">
                    {slots.map(slot => {
                      const isFull = slot.booked >= slot.capacity;
                      return (
                        <div
                          key={slot.slotId}
                          className="flex justify-between items-center px-4 py-2.5 hover:bg-white transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="text-xs text-gray-500">
                              {slot.booked}/{slot.capacity} booked
                            </p>
                          </div>
                          <button
                            disabled={isFull}
                            onClick={() => handleBook(slot)}
                            className={`px-5 py-1.5 text-xs font-medium rounded-lg text-white transition-all ${
                              isFull 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-[#000359] hover:bg-[#000280] active:scale-95'
                            }`}
                          >
                            {isFull ? 'Full' : 'Book Now'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Fee Details — CHANGE 3: removed lg:pt-12, use h-full to fill column */}
          <div className="flex flex-col">
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 h-full">
              <h3 className="text-sm font-semibold mb-5 text-gray-700">
                Fee Details (1-day / Ad-hoc Booking)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Fee Type (Optional)</label>
                  <Select
                    options={feeTypeOptions}
                    value={selectedFeeType}
                    onChange={setSelectedFeeType}
                    placeholder="Select fee type"
                    isClearable
                    classNamePrefix="react-select"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Plan</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================== BOOKING TABLE ====================== */}
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
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#000359]"
          />

          <select
            value={filterActivity}
            onChange={(e) => setFilterActivity(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#000359]"
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
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
          />

          {(filterMember || filterActivity || filterDate) && (
            <button
              onClick={() => { 
                setFilterMember(''); 
                setFilterActivity(''); 
                setFilterDate(''); 
              }}
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
                  <td colSpan="5" className="text-center py-12 text-gray-400 text-sm">
                    {bookings.length === 0 ? 'No bookings yet' : 'No results match your filters'}
                  </td>
                </tr>
              )}

              {filteredBookings.map((b, idx) => (
                <tr
                  key={b._id}
                  className={`hover:bg-blue-50 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-5 py-4 font-semibold text-gray-800">{b.customerName}</td>
                  <td className="px-5 py-4 text-gray-600">{b.activityName}</td>
                  <td className="px-5 py-4 text-gray-600">{b.slotTime}</td>
                  <td className="px-5 py-4 text-gray-600">{b.date}</td>
                  <td className="px-5 py-4">
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














// _________________ DO NOT Delete ___________
// ____________Members Only Check box ______________




// import { useEffect, useState } from 'react';
// import { api } from '../../../services/apiClient';
// import { toast } from 'sonner';
// import Select from 'react-select';

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

//   // Fee Details with Fee Type support
//   const [feeTypeOptions, setFeeTypeOptions] = useState([]);
//   const [selectedFeeType, setSelectedFeeType] = useState(null);
//   const [plan, setPlan] = useState('Daily');
//   const [amount, setAmount] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState('Paid');
//   const [paymentMode, setPaymentMode] = useState('Cash');
//   const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

//   /* =========================
//      FETCH DATA
//   ========================= */
//   const fetchActivities = async () => {
//     const res = await api.fitnessActivities.getAll();
//     setActivities(res.data.data || []);
//   };

//   const fetchFeeTypes = async () => {
//     try {
//       const res = await api.fitnessFees.getTypes();
//       const types = res.data || [];
//       setFeeTypeOptions(types.map(ft => ({
//         value: ft._id,
//         label: ft.description,
//         data: ft
//       })));
//     } catch (err) {
//       console.error("Failed to load fee types", err);
//     }
//   };

//   const fetchAvailability = async () => {
//     if (!selectedActivity || !date) return;
//     const res = await api.fitnessActivities.availability({
//       activityId: selectedActivity,
//       date
//     });
//     setSlots(res.data.data || []);
//   };

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
//      AUTO-FILL AMOUNT when Fee Type + Plan changes
//   ========================= */
//   useEffect(() => {
//     if (!selectedFeeType?.data || !plan) return;

//     const feeData = selectedFeeType.data;
//     const planMap = {
//       Annual: 'annual',
//       Monthly: 'monthly',
//       Weekly: 'weekly',
//       Daily: 'daily',
//       Hourly: 'hourly'
//     };

//     const key = planMap[plan];
//     const autoAmount = feeData[key] || 0;
//     setAmount(autoAmount.toString());
//   }, [selectedFeeType, plan]);

//   /* =========================
//      BOOK SLOT
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
//         feeTypeId: selectedFeeType?.value || null,
//         plan: plan,
//         amount: Number(amount),
//         paymentStatus: paymentStatus,
//         paymentMode: paymentMode,
//         paymentDate: paymentDate,
//       });

//       toast.success("Booked successfully");
//       fetchAvailability();
//       fetchBookings();

//       // Reset form
//       setMemberName('');
//       setSelectedFeeType(null);
//       setAmount('');
//       setPaymentStatus('Paid');
//       setPaymentMode('Cash');
//       setPaymentDate(new Date().toISOString().split('T')[0]);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || err?.message || "Booking failed");
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
//       toast.error(err?.response?.data?.message || err?.message || "Cancel failed");
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//     fetchFeeTypes();
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

//         {/* Fee Details Section with Fee Type */}
//         <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
//           <h3 className="text-sm font-semibold mb-3 text-gray-700">Fee Details (for 1-day / ad-hoc booking)</h3>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1">Fee Type</label>
//               <Select
//                 options={feeTypeOptions}
//                 value={selectedFeeType}
//                 onChange={setSelectedFeeType}
//                 placeholder="Select fee type (optional)"
//                 isClearable
//                 classNamePrefix="react-select"
//               />
//             </div>

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

//             <div>
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