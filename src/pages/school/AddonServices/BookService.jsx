// Activity wala duplicate he ------------------------------------------------
// import { useEffect, useState } from 'react';
// import { api } from '../../../services/apiClient';
// import { toast } from 'sonner';
// import Select from 'react-select';
// import AsyncSelect from 'react-select/async';
// import Pagination from '../../../components/Pagination';

// export default function BookActivity() {
//   const [activities, setActivities] = useState([]);
//   const [selectedActivity, setSelectedActivity] = useState('');
//   const [date, setDate] = useState('');
//   const [slots, setSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);   // ← New: Track selected slot

//   // Form states (only visible after slot selection)
//   const [memberName, setMemberName] = useState('');
//   const [feeTypeOptions, setFeeTypeOptions] = useState([]);
//   const [selectedFeeType, setSelectedFeeType] = useState(null);
//   const [plan, setPlan] = useState('Daily');
//   const [amount, setAmount] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState('Paid');
//   const [paymentMode, setPaymentMode] = useState('Cash');
//   const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedStaff, setSelectedStaff] = useState(null);

//   // Booking list states
//   const [bookings, setBookings] = useState([]);
//   const [filterMember, setFilterMember] = useState('');
//   const [filterActivity, setFilterActivity] = useState('');
//   const [filterDateFrom, setFilterDateFrom] = useState('');
//   const [filterDateTo, setFilterDateTo] = useState('');
//   const [members, setMembers] = useState([]);
//   const [filteredMembers, setFilteredMembers] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

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
//     if (!selectedActivity || !date) {
//       setSlots([]);
//       setSelectedSlot(null);
//       return;
//     }
//     const res = await api.fitnessActivities.availability({
//       activityId: selectedActivity,
//       date
//     });
//     setSlots(res.data.data || []);
//     setSelectedSlot(null); // reset slot when activity/date changes
//   };

//   const fetchBookings = async () => {
//     try {
//       const res = await api.fitnessActivities.getBookings({
//         page, limit,
//         search: filterMember,
//         activity: filterActivity,
//         fromDate: filterDateFrom,
//         toDate: filterDateTo
//       });
//       setBookings(res.data.data || []);
//       setTotalPages(res.data.pagination?.totalPages || 1);
//       setTotalCount(res.data.pagination?.total || 0);
//     } catch (err) {
//       console.error(err);
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

//   const loadStaffOptions = async (inputValue) => {
//     try {
//       const res = await api.fitnessStaff.getAll({
//         search: inputValue || "",
//         status: "Active",
//         page: 1,
//         limit: 5
//       });
//       const data = res.data?.data?.staff || [];
//       return data.map((staff) => ({
//         value: staff._id,
//         label: `${staff.fullName || staff.name} (${staff.role || "Staff"})`,
//         data: staff
//       }));
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   };

//   /* =========================
//      AUTO-FILL AMOUNT
//   ========================= */
//   useEffect(() => {
//     if (!selectedFeeType?.data || !plan) return;
//     const feeData = selectedFeeType.data;
//     const planMap = { Annual: 'annual', Monthly: 'monthly', Weekly: 'weekly', Daily: 'daily', Hourly: 'hourly' };
//     const key = planMap[plan];
//     const autoAmount = feeData[key] || 0;
//     setAmount(autoAmount.toString());
//   }, [selectedFeeType, plan]);

//   /* =========================
//      BOOK SLOT
//   ========================= */
//   const handleBook = async () => {
//     if (!selectedSlot) {
//       toast.error("Please select a slot");
//       return;
//     }
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
//         slotId: selectedSlot.slotId,
//         date,
//         customerName: memberName,
//         phone: "0000000000",
//         feeTypeId: selectedFeeType?.value || null,
//         plan: plan,
//         amount: Number(amount),
//         paymentStatus: paymentStatus,
//         paymentMode: paymentMode,
//         paymentDate: paymentDate,
//         staffId: selectedStaff?.value || null
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
//       setSelectedStaff(null);
//       setSelectedSlot(null);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || err?.message || "Booking failed");
//     }
//   };

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

//   // Effects
//   useEffect(() => {
//     fetchActivities();
//     fetchFeeTypes();
//     fetchBookings();
//     fetchMembers();
//   }, []);

//   useEffect(() => {
//     fetchAvailability();
//   }, [selectedActivity, date]);

//   useEffect(() => {
//     fetchBookings();
//   }, [page, limit, filterMember, filterActivity, filterDateFrom, filterDateTo]);

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

//   // const uniqueActivities = [...new Set(bookings.map(b => b.activityName).filter(Boolean))];

//   const activityOptions = activities.map((a) => ({
//   label: a.name,
//   value: a.name
// }));

//   return (
//     <div className="space-y-6">
//       {/* ====================== BOOK ACTIVITY FORM ====================== */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
//         <h2 className="text-xl font-semibold mb-6">Book Activity</h2>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
//           {/* LEFT SIDE - Selection + Slots */}
//           <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="w-72">
//                 <Select
//                   options={activities.map((a) => ({
//                     label: a.name,
//                     value: a._id
//                   }))}
//                   value={
//                     activities
//                       .map((a) => ({
//                         label: a.name,
//                         value: a._id
//                       }))
//                       .find((a) => a.value === selectedActivity) || null
//                   }
//                   onChange={(selected) => {
//                     setSelectedActivity(selected?.value || '');
//                     setSelectedSlot(null);
//                   }}
//                   placeholder="Select Activity"
//                   isClearable
//                   classNamePrefix="react-select"
//                 />
//               </div>

//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>

//             {/* Available Slots */}
//             <div>
//               <h3 className="text-sm font-semibold mb-3 text-gray-700">Available Slots</h3>
//               <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
//                 {slots.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-10 text-gray-400">
//                     <p className="text-sm">No slots available</p>
//                     <p className="text-xs mt-1">Please select activity and date</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-100 max-h-[260px] overflow-y-auto">
//                     {slots.map(slot => {
//                       const isFull = slot.booked >= slot.capacity;
//                       const isSelected = selectedSlot?.slotId === slot.slotId;

//                       return (
//                         <div
//                           key={slot.slotId}
//                           onClick={() => !isFull && setSelectedSlot(slot)}
//                           className={`flex justify-between items-center px-4 py-3 hover:bg-white transition-all cursor-pointer ${
//                             isSelected ? 'bg-blue-50 border-l-4 border-[#000359]' : ''
//                           } ${isFull ? 'opacity-60' : ''}`}
//                         >
//                           <div>
//                             <p className="font-medium text-gray-800 text-sm">
//                               {slot.startTime} - {slot.endTime}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {slot.booked}/{slot.capacity} booked
//                             </p>
//                           </div>
//                           <div>
//                             {isFull ? (
//                               <span className="px-4 py-1 text-xs font-medium bg-gray-400 text-white rounded-lg">Full</span>
//                             ) : (
//                               <span className={`px-4 py-1 text-xs font-medium rounded-lg ${isSelected ? 'bg-[#000359] text-white' : 'bg-gray-200 text-gray-700'}`}>
//                                 {isSelected ? 'Selected' : 'Select'}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE - Booking Form (only shows after slot is selected) */}
//           <div className="flex flex-col">
//             {selectedSlot ? (
//               <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 h-full">
//                 <h3 className="text-sm font-semibold mb-5 text-gray-700">
//                   Booking Details - {selectedSlot.startTime} - {selectedSlot.endTime}
//                 </h3>

//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1.5">Member Name</label>
//                     <input
//                       type="text"
//                       placeholder="Enter member name"
//                       value={memberName}
//                       onChange={(e) => setMemberName(e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
//                     />
//                     {filteredMembers.length > 0 && (
//                       <div className="border rounded-lg mt-1 max-h-48 overflow-y-auto bg-white shadow-sm">
//                         {filteredMembers.map(m => {
//                           const displayName = m.name || m.fullName || "Unknown";
//                           return (
//                             <div
//                               key={m._id}
//                               onClick={() => {
//                                 setMemberName(displayName);
//                                 setFilteredMembers([]);
//                               }}
//                               className="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer border-b last:border-none"
//                             >
//                               {displayName}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>

//                   {/* Fee Details */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1.5">Fee Type (Optional)</label>
//                       <Select
//                         options={feeTypeOptions}
//                         value={selectedFeeType}
//                         onChange={setSelectedFeeType}
//                         placeholder="Select fee type"
//                         isClearable
//                         classNamePrefix="react-select"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1.5">Plan</label>
//                       <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
//                         <option value="Daily">Daily</option>
//                         <option value="Hourly">Hourly</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1.5">Amount (₹)</label>
//                       <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1.5">Payment Status</label>
//                       <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
//                         <option value="Paid">Paid</option>
//                         <option value="Pending">Pending</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1.5">Payment Mode</label>
//                       <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
//                         <option value="Cash">Cash</option>
//                         <option value="Bank Transfer">Bank Transfer</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1.5">Payment Date</label>
//                       <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
//                     </div>
//                     <div className="sm:col-span-2">
//                       <label className="block text-xs text-gray-600 mb-1.5">Responsible Staff</label>
//                       <AsyncSelect
//                         cacheOptions
//                         defaultOptions
//                         loadOptions={loadStaffOptions}
//                         value={selectedStaff}
//                         onChange={setSelectedStaff}
//                         placeholder="Search Responsible Staff"
//                         isClearable
//                         classNamePrefix="react-select"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     onClick={handleBook}
//                     className="w-full bg-[#000359] hover:bg-[#000280] active:scale-[0.985] transition-all text-white font-semibold py-3.5 rounded-xl mt-4"
//                   >
//                     Confirm Booking
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 h-full flex items-center justify-center text-center">
//                 <div>
//                   <p className="text-gray-400 text-sm">Select a slot from the left</p>
//                   <p className="text-xs text-gray-500 mt-1">to proceed with booking</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ====================== BOOKING TABLE ====================== */}
//       {/* (Your existing table code remains exactly the same) */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
//         </div>
//         <div className="flex flex-wrap gap-3 mb-5">
//           <input
//             type="text"
//             placeholder="Search Member Name"
//             value={filterMember}
//             onChange={(e) => {
//   setFilterMember(e.target.value);
//   setPage(1);
// }}
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#000359]"
//           />
//           <div className="w-72">
//   <Select
//     options={activityOptions}
//     value={
//       activityOptions.find(
//         (a) => a.value === filterActivity
//       ) || null
//     }
//     onChange={(selected) => {
//       setFilterActivity(selected?.value || '');
//       setPage(1);
//     }}
//     placeholder="Search Activity"
//     isClearable
//     classNamePrefix="react-select"
//   />
// </div>
//           <div className="flex items-center gap-2">
//             <input type="date" value={filterDateFrom} onChange={(e) => {
//   setFilterDateFrom(e.target.value);
//   setPage(1);
// }} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
//             <span className="text-sm text-gray-500">to</span>
//             <input type="date" value={filterDateTo} onChange={(e) => {
//   setFilterDateTo(e.target.value);
//   setPage(1);
// }}className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
//           </div>
//           {(filterMember || filterActivity || filterDateFrom || filterDateTo) && (
//             <button
//   onClick={() => {
//     setFilterMember('');
//     setFilterActivity('');
//     setFilterDateFrom('');
//     setFilterDateTo('');
//     setPage(1);
//   }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
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
//               {bookings.length === 0 && (
//                 <tr>
//                   <td colSpan="5" className="text-center py-12 text-gray-400 text-sm">
//                     No bookings found
//                   </td>
//                 </tr>
//               )}
//               {bookings.map((b, idx) => (
//                 <tr key={b._id} className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                   <td className="px-5 py-4 font-semibold text-gray-800">{b.customerName}</td>
//                   <td className="px-5 py-4 text-gray-600">{b.activityName}</td>
//                   <td className="px-5 py-4 text-gray-600">{b.slotTime}</td>
//                   <td className="px-5 py-4 text-gray-600">{b.date}</td>
                  
//                   <td className="px-5 py-4">
//                     <button onClick={() => handleCancel(b._id)} className="px-4 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
//                       Cancel
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <Pagination
//           page={page}
//           limit={limit}
//           totalPages={totalPages}
//           totalCount={totalCount}
//           setPage={setPage}
//           setLimit={setLimit}
//         />
//       </div>
//     </div>
//   );
// }






















// Activity api removed and using service dummy data----------------------------------
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Select from 'react-select';

const DUMMY_SERVICES = [
  {
    _id: 'svc1',
    name: 'Swimming',
    capacity: 20,
    slots: [
      { _id: 'slot1', startTime: '08:00', endTime: '09:00' },
      { _id: 'slot2', startTime: '10:00', endTime: '11:00' },
      { _id: 'slot3', startTime: '14:00', endTime: '15:00' },
    ],
    feeTypeId: { _id: 'fee1', description: 'Standard Fee', daily: 200, hourly: 50 },
  },
  {
    _id: 'svc2',
    name: 'Yoga',
    capacity: 15,
    slots: [
      { _id: 'slot4', startTime: '07:00', endTime: '08:00' },
      { _id: 'slot5', startTime: '17:00', endTime: '18:00' },
    ],
    feeTypeId: { _id: 'fee2', description: 'Premium Fee', daily: 400, hourly: 100 },
  },
  {
    _id: 'svc3',
    name: 'Basketball',
    capacity: 30,
    slots: [
      { _id: 'slot6', startTime: '09:00', endTime: '10:30' },
      { _id: 'slot7', startTime: '15:00', endTime: '16:30' },
    ],
    feeTypeId: { _id: 'fee1', description: 'Standard Fee', daily: 200, hourly: 50 },
  },
];

const DUMMY_MEMBERS = [
  { _id: 'm1', name: 'Aman Gupta' },
  { _id: 'm2', name: 'Neha Patil' },
  { _id: 'm3', name: 'Riya Shah' },
  { _id: 'm4', name: 'Karan Malhotra' },
  { _id: 'm5', name: 'Sneha Verma' },
];

const DUMMY_FEE_TYPES = [
  { _id: 'fee1', description: 'Standard Fee', daily: 200, hourly: 50 },
  { _id: 'fee2', description: 'Premium Fee', daily: 400, hourly: 100 },
];

const DUMMY_STAFF = [
  { _id: 'st1', fullName: 'Rahul Sharma', role: 'Coach' },
  { _id: 'st2', fullName: 'Priya Mehta', role: 'Instructor' },
  { _id: 'st3', fullName: 'Anita Joshi', role: 'Instructor' },
  { _id: 'st4', fullName: 'Vikram Singh', role: 'Coach' },
];

const DUMMY_BOOKINGS = [
  { _id: 'bk1', activityId: { _id: 'svc1' }, slotId: 'slot1', customerName: 'Aman Gupta', date: format(new Date(), 'yyyy-MM-dd'), slotTime: '08:00 - 09:00', activityName: 'Swimming' },
  { _id: 'bk2', activityId: { _id: 'svc1' }, slotId: 'slot1', customerName: 'Neha Patil', date: format(new Date(), 'yyyy-MM-dd'), slotTime: '08:00 - 09:00', activityName: 'Swimming' },
  { _id: 'bk3', activityId: { _id: 'svc2' }, slotId: 'slot4', customerName: 'Riya Shah', date: format(new Date(), 'yyyy-MM-dd'), slotTime: '07:00 - 08:00', activityName: 'Yoga' },
  { _id: 'bk4', activityId: { _id: 'svc3' }, slotId: 'slot6', customerName: 'Karan Malhotra', date: format(new Date(), 'yyyy-MM-dd'), slotTime: '09:00 - 10:30', activityName: 'Basketball' },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export default function BookService() {
  const [activities] = useState(DUMMY_SERVICES);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Form states
  const [memberName, setMemberName] = useState('');
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [plan, setPlan] = useState('Daily');
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [filteredMembers, setFilteredMembers] = useState([]);

  // Booking list states
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS);
  const [filterMember, setFilterMember] = useState('');
  const [filterActivity, setFilterActivity] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const feeTypeOptions = DUMMY_FEE_TYPES.map(ft => ({
    value: ft._id,
    label: ft.description,
    data: ft,
  }));

  const staffOptions = DUMMY_STAFF.map(s => ({
    value: s._id,
    label: `${s.fullName} (${s.role})`,
  }));

  // Compute slots when activity + date selected
  useEffect(() => {
    if (!selectedActivity || !date) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    const activity = activities.find(a => a._id === selectedActivity);
    if (!activity) { setSlots([]); return; }

    const computed = activity.slots.map(slot => {
      const booked = bookings.filter(
        b => b.activityId?._id === selectedActivity &&
             b.slotId === slot._id &&
             b.date === date
      ).length;

      return {
        slotId: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        booked,
        capacity: activity.capacity,
      };
    });

    setSlots(computed);
    setSelectedSlot(null);
  }, [selectedActivity, date, bookings]);

  // Auto-fill amount from fee type + plan
  useEffect(() => {
    if (!selectedFeeType?.data || !plan) return;
    const planMap = { Daily: 'daily', Hourly: 'hourly' };
    const key = planMap[plan];
    setAmount((selectedFeeType.data[key] || 0).toString());
  }, [selectedFeeType, plan]);

  // Member name suggestion
  useEffect(() => {
    if (!memberName.trim()) { setFilteredMembers([]); return; }
    setFilteredMembers(
      DUMMY_MEMBERS.filter(m =>
        m.name.toLowerCase().includes(memberName.toLowerCase())
      )
    );
  }, [memberName]);

  // Derived: filtered + paginated bookings
  const filteredBookings = bookings.filter(b => {
    const matchMember = !filterMember || b.customerName.toLowerCase().includes(filterMember.toLowerCase());
    const matchActivity = !filterActivity || b.activityName === filterActivity;
    const matchFrom = !filterDateFrom || b.date >= filterDateFrom;
    const matchTo = !filterDateTo || b.date <= filterDateTo;
    return matchMember && matchActivity && matchFrom && matchTo;
  });

  const totalCount = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const paginatedBookings = filteredBookings.slice((page - 1) * limit, page * limit);

  const activityOptions = activities.map(a => ({ label: a.name, value: a.name }));

  const handleBook = () => {
    if (!selectedSlot) return alert("Please select a slot");
    if (!memberName.trim()) return alert("Enter member name");
    if (!amount || Number(amount) <= 0) return alert("Please enter a valid amount");

    const activity = activities.find(a => a._id === selectedActivity);
    const newBooking = {
      _id: `bk${Date.now()}`,
      activityId: { _id: selectedActivity },
      slotId: selectedSlot.slotId,
      customerName: memberName,
      date,
      slotTime: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
      activityName: activity?.name || '',
    };

    setBookings(prev => [newBooking, ...prev]);

    // Reset form
    setMemberName('');
    setSelectedFeeType(null);
    setAmount('');
    setPaymentStatus('Paid');
    setPaymentMode('Cash');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setSelectedStaff(null);
    setSelectedSlot(null);
  };

  const handleCancel = (id) => {
    setBookings(prev => prev.filter(b => b._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* ====================== BOOK SERVICE FORM ====================== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Book Service</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* LEFT - Selection + Slots */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-72">
                <Select
                  options={activities.map(a => ({ label: a.name, value: a._id }))}
                  value={activities.map(a => ({ label: a.name, value: a._id })).find(a => a.value === selectedActivity) || null}
                  onChange={(selected) => {
                    setSelectedActivity(selected?.value || '');
                    setSelectedSlot(null);
                  }}
                  placeholder="Select Service"
                  isClearable
                  classNamePrefix="react-select"
                />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Available Slots</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                {slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <p className="text-sm">No slots available</p>
                    <p className="text-xs mt-1">Please select service and date</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[260px] overflow-y-auto">
                    {slots.map(slot => {
                      const isFull = slot.booked >= slot.capacity;
                      const isSelected = selectedSlot?.slotId === slot.slotId;
                      return (
                        <div
                          key={slot.slotId}
                          onClick={() => !isFull && setSelectedSlot(slot)}
                          className={`flex justify-between items-center px-4 py-3 hover:bg-white transition-all cursor-pointer
                            ${isSelected ? 'bg-blue-50 border-l-4 border-[#000359]' : ''}
                            ${isFull ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="text-xs text-gray-500">{slot.booked}/{slot.capacity} booked</p>
                          </div>
                          <div>
                            {isFull ? (
                              <span className="px-4 py-1 text-xs font-medium bg-gray-400 text-white rounded-lg">Full</span>
                            ) : (
                              <span className={`px-4 py-1 text-xs font-medium rounded-lg ${isSelected ? 'bg-[#000359] text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {isSelected ? 'Selected' : 'Select'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Booking Form */}
          <div className="flex flex-col">
            {selectedSlot ? (
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 h-full">
                <h3 className="text-sm font-semibold mb-5 text-gray-700">
                  Booking Details — {selectedSlot.startTime} - {selectedSlot.endTime}
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">Member Name</label>
                    <input
                      type="text"
                      placeholder="Enter member name"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]"
                    />
                    {filteredMembers.length > 0 && (
                      <div className="border rounded-lg mt-1 max-h-48 overflow-y-auto bg-white shadow-sm">
                        {filteredMembers.map(m => (
                          <div
                            key={m._id}
                            onClick={() => { setMemberName(m.name); setFilteredMembers([]); }}
                            className="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer border-b last:border-none"
                          >
                            {m.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

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
                      <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
                        <option value="Daily">Daily</option>
                        <option value="Hourly">Hourly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1.5">Amount (₹)</label>
                      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1.5">Payment Status</label>
                      <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1.5">Payment Mode</label>
                      <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm">
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1.5">Payment Date</label>
                      <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1.5">Responsible Staff</label>
                      <Select
                        options={staffOptions}
                        value={selectedStaff}
                        onChange={setSelectedStaff}
                        placeholder="Select Staff"
                        isClearable
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleBook}
                    className="w-full bg-[#000359] hover:bg-[#000280] active:scale-[0.985] transition-all text-white font-semibold py-3.5 rounded-xl mt-4"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 h-full flex items-center justify-center text-center">
                <div>
                  <p className="text-gray-400 text-sm">Select a slot from the left</p>
                  <p className="text-xs text-gray-500 mt-1">to proceed with booking</p>
                </div>
              </div>
            )}
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
            onChange={(e) => { setFilterMember(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#000359]"
          />
          <div className="w-72">
            <Select
              options={activityOptions}
              value={activityOptions.find(a => a.value === filterActivity) || null}
              onChange={(selected) => { setFilterActivity(selected?.value || ''); setPage(1); }}
              placeholder="Search Service"
              isClearable
              classNamePrefix="react-select"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="date" value={filterDateFrom} onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1); }} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            <span className="text-sm text-gray-500">to</span>
            <input type="date" value={filterDateTo} onChange={(e) => { setFilterDateTo(e.target.value); setPage(1); }} className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
          </div>
          {(filterMember || filterActivity || filterDateFrom || filterDateTo) && (
            <button
              onClick={() => { setFilterMember(''); setFilterActivity(''); setFilterDateFrom(''); setFilterDateTo(''); setPage(1); }}
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
                <th className="text-left px-5 py-3.5 text-white font-semibold">Service</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Slot</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Date</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 text-sm">No bookings found</td>
                </tr>
              ) : (
                paginatedBookings.map((b, idx) => (
                  <tr key={b._id} className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-5 py-4 font-semibold text-gray-800">{b.customerName}</td>
                    <td className="px-5 py-4 text-gray-600">{b.activityName}</td>
                    <td className="px-5 py-4 text-gray-600">{b.slotTime}</td>
                    <td className="px-5 py-4 text-gray-600">{b.date}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleCancel(b._id)} className="px-4 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Simple inline pagination (replaces <Pagination> component) */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              {ITEMS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <span>{totalCount === 0 ? '0' : `${(page - 1) * limit + 1}–${Math.min(page * limit, totalCount)}`} of {totalCount}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-40">‹</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-40">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}