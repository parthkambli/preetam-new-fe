// // pages/school/Activities/Activities.jsx
// import { useState } from 'react';
// import ActivityList from './Activitylist';
// import AddActivity from './AddActivity';
// import ScheduleActivity from './ScheduleActivity';

// export default function Activities() {
//   const [view, setView] = useState('list'); // 'list' | 'add' | 'schedule'

//   return (
//     <div className="p-4 sm:p-6 space-y-5">

//       {/* Header row */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <h1 className="text-xl font-semibold text-gray-800">
//           {view === 'list'     && 'Activities'}
//           {view === 'add'      && 'Add Activities'}
//           {view === 'schedule' && 'Scheduled Activities'}
//         </h1>

//         {/* Tab buttons */}
//         <div className="flex gap-2 flex-wrap">
//           <button
//             onClick={() => setView('schedule')}
//             className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap
//               ${view === 'schedule'
//                 ? 'bg-[#000359] text-white shadow-md'
//                 : 'border border-[#000359] text-[#000359] bg-white hover:bg-[#000359]/5'}`}
//           >
//             Scheduled Activities
//           </button>
//           <button
//             onClick={() => setView('add')}
//             className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap
//               ${view === 'add'
//                 ? 'bg-[#000359] text-white shadow-md'
//                 : 'border border-[#000359] text-[#000359] bg-white hover:bg-[#000359]/5'}`}
//           >
//             Add Activities
//           </button>
//         </div>
//       </div>

//       {/* Active view */}
//       {view === 'list'     && <ActivityList onView={() => {}} onSchedule={() => setView('schedule')} />}
//       {view === 'add'      && <AddActivity  onCancel={() => setView('list')} onSaved={() => setView('list')} />}
//       {view === 'schedule' && <ScheduleActivity onCancel={() => setView('list')} onSaved={() => setView('list')} />}

//     </div>
//   );
// }


// // pages/fitnessClub/Activities/Activities.jsx
// import { useState, useEffect } from 'react';
// import ActivityList from './Activitylist';
// import AddActivity from './Addactivity';
// import ScheduleActivity from './Scheduleactivity';
// import BookActivity from './BookActivity'
// import ActivityStats from './components/ActivityStats';
// import TodaySchedule from './components/TodaySchedule';
// import ActivityManager from './ActivityManager';
// import { format, addDays, startOfWeek } from "date-fns";
// import DateStrip from "./components/DateStrip";

// import { api } from '../../../services/apiClient';

// export default function Activities() {
//   // const [view, setView] = useState('list');
//   const [view, setView] = useState('dashboard');
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [selectedSlot, setSelectedSlot] = useState(null);
// const [slotBookings, setSlotBookings] = useState([]);
// const [showModal, setShowModal] = useState(false);

// const [editActivity, setEditActivity] = useState(null);


//   const [stats, setStats] = useState({
//   totalActivities: 0,
//   totalBookings: 0,
//   availableSlots: 0,
//   fullSlots: 0,
// });

// const [todaySlots, setTodaySlots] = useState([]);
// const [selectedDate, setSelectedDate] = useState(new Date());



//   const handleSaved = () => {
//     setRefreshKey(prev => prev + 1);
//     setView('list');
//   };

//   const fetchDashboard = async () => {
//   try {
//     const selected = format(selectedDate, "yyyy-MM-dd");
//     const isSameDate = (date) =>
//   format(new Date(date), "yyyy-MM-dd") === selected;


//     console.log("ACTIVITY:", activity.name);
// console.log("SLOT TIME:", `${slot.startTime} - ${slot.endTime}`);
// console.log("BOOKING TIME:", bookings[0]?.slotTime);



//     const [activitiesRes, bookingsRes] = await Promise.all([
//       api.fitnessActivities.getAll(),
//       api.fitnessActivities.getBookings(),
//     ]);

//     const activities = activitiesRes.data.data || [];
//     const bookings = bookingsRes.data.data || [];
// console.log("SAMPLE BOOKING:", bookings[0]);
//     const todayBookings = bookings.filter(
//   (b) => format(new Date(b.date), "yyyy-MM-dd") === selected
// );

//     let totalSlots = 0;
//     let fullSlots = 0;

//     const slots = [];

//     activities.forEach((activity) => {
//       activity.slots?.forEach((slot) => {
//         totalSlots++;

//         const booked = bookings.filter(
//   (b) =>
//     b.activityName === activity.name &&
//     b.slotTime === `${slot.startTime} - ${slot.endTime}` &&
//     isSameDate(b.date)
// ).length;

//         if (booked >= activity.capacity) fullSlots++;

//         slots.push({
//   activity: activity.name,
//   time: `${slot.startTime} - ${slot.endTime}`,
//   booked,
//   capacity: activity.capacity,
//   slotId: slot._id,
//   activityId: activity._id,
// });
//       });
//     });

//     setStats({
//       totalActivities: activities.length,
//       totalBookings: todayBookings.length,
//       availableSlots: totalSlots - fullSlots,
//       fullSlots,
//     });

//     setTodaySlots(slots);
//   } catch (err) {
//     console.error('Dashboard error:', err);
//   }
// };

// // console.log(todaySlots);

// useEffect(() => {
//   if (view === 'dashboard') {
//     fetchDashboard();
//   }
// }, [view, selectedDate]);

// const handleSlotClick = async (slot) => {
//   try {
//    const isSameDate = (date) =>
//   format(new Date(date), "yyyy-MM-dd") === selected;

//     const res = await api.fitnessActivities.getBookings();
//     const bookings = res.data.data || [];


//     const filtered = bookings.filter(
//   (b) =>
//     b.activityName === slot.activity &&
//     b.slotTime === slot.time &&
//     isSameDate(b.date)
// );

//     setSelectedSlot(slot);
//     setSlotBookings(filtered);
//     setShowModal(true);

//   } catch (err) {
//     console.error(err);
//   }
// };

//   return (
//     <div className="p-4 sm:p-6 space-y-5">

//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <h1 className="text-xl font-semibold text-gray-800">
//             {view === 'dashboard' && 'Activities'}
//             {view === 'list'      && 'Activities List'}
//             {view === 'add'       && 'Add Activities'}
//             {view === 'schedule'  && 'Scheduled Activities'}
//             {view === 'book'      && 'Book Activity'}
//         </h1>

//         <div className="flex gap-2 flex-wrap">
//           {/* <button
//             onClick={() => setView('schedule')}
//             className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap
//               ${view === 'schedule'
//                 ? 'bg-[#000359] text-white shadow-md'
//                 : 'border border-[#000359] text-[#000359] bg-white hover:bg-[#000359]/5'}`}
//           >
//             Scheduled Activities
//           </button> */}
          
//           <button
//   onClick={() => setView('book')}
//   className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap
//     ${view === 'book'
//       ? 'bg-[#000359] text-white shadow-md'
//       : 'border border-[#000359] text-[#000359] bg-white hover:bg-[#000359]/5'}`}
// >
//   Book Activity
// </button>

// <button
//   onClick={() => setView('manage')}
//   className={`px-5 py-2 rounded-md text-sm font-semibold
//     ${view === 'manage'
//       ? 'bg-[#000359] text-white'
//       : 'border border-[#000359] text-[#000359]'}`}
// >
//   Manage Activities
// </button>
//           <button
//             onClick={() => setView('add')}
//             className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap
//               ${view === 'add'
//                 ? 'bg-[#000359] text-white shadow-md'
//                 : 'border border-[#000359] text-[#000359] bg-white hover:bg-[#000359]/5'}`}
//           >
//             Add Activities
//           </button>
//         </div>
//       </div>
//       {view === 'dashboard' && (
//   <>
//     <DateStrip
//       selectedDate={selectedDate}
//       setSelectedDate={setSelectedDate}
//     />

//     <ActivityStats stats={stats} />
//     <TodaySchedule
//       slots={todaySlots}
//       onSlotClick={handleSlotClick}
//     />
//   </>
// )}
// {view === 'list' && (
//   <ActivityList
//     key={refreshKey}
//     onView={() => {}}
//     onSchedule={() => setView('schedule')}
//   />
// )}

// {view === 'add' && (
//   <AddActivity
//   editData={editActivity}
//   onCancel={() => {
//     setEditActivity(null);
//     setView('dashboard');
//   }}
//   onSaved={() => {
//     setEditActivity(null);
//     handleSaved();
//   }}
// />
// )}

// {view === 'book' && (
//   <BookActivity />
// )}

// {false && view === 'schedule' && (
//   <ScheduleActivity
//     onCancel={() => setView('list')}
//     onSaved={handleSaved}
//   />
// )}
// {view === 'manage' && (
//   <ActivityManager
//     onEdit={(activity) => {
//   setEditActivity(activity);
//   setView('add');
// }}
//   />
// )}

// {showModal && (
//   <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//     <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

//       <h3 className="text-lg font-semibold mb-3">
//         {selectedSlot?.activity}
//       </h3>

//       <p className="text-sm text-gray-500 mb-4">
//         {selectedSlot?.time}
//       </p>

//       {slotBookings.length === 0 ? (
//         <p className="text-sm text-gray-400">No bookings yet</p>
//       ) : (
//         <div className="space-y-2 max-h-60 overflow-y-auto">
//           {slotBookings.map((b) => (
//             <div
//               key={b._id}
//               className="border rounded-md px-3 py-2 text-sm"
//             >
//               {b.customerName}
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-5 text-right">
//         <button
//           onClick={() => setShowModal(false)}
//           className="px-4 py-2 text-sm bg-[#000359] text-white rounded-md"
//         >
//           Close
//         </button>
//       </div>

//     </div>
//   </div>
// )}

//     </div>
//   );
// }


// import { useState, useEffect } from 'react';
// // import ActivityList from './Activitylist';
// import AddActivity from './Addactivity';
// import BookActivity from './BookActivity';
// import ActivityStats from './components/ActivityStats';
// import TodaySchedule from './components/TodaySchedule';
// import ActivityManager from './ActivityManager';
// import { format } from "date-fns";
// import DateStrip from "./components/DateStrip";
// import { api } from '../../../services/apiClient';

// export default function Activities() {
//   const [view, setView] = useState('dashboard');
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [slotBookings, setSlotBookings] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const [editActivity, setEditActivity] = useState(null);

//   const [stats, setStats] = useState({
//     totalActivities: 0,
//     totalBookings: 0,
//     availableSlots: 0,
//     fullSlots: 0,
//   });

//   const [todaySlots, setTodaySlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const handleSaved = () => {
//     setRefreshKey(prev => prev + 1);
//     setView('add');
//   };

//   // ================= DASHBOARD =================
//   const fetchDashboard = async () => {
//     try {
//       const selected = format(selectedDate, "yyyy-MM-dd");

//       const isSameDate = (date) =>
//         format(new Date(date), "yyyy-MM-dd") === selected;

//       const [activitiesRes, bookingsRes] = await Promise.all([
//         api.fitnessActivities.getAll(),
//         api.fitnessActivities.getBookings(),
//       ]);

//       const activities = activitiesRes.data.data || [];
//       const bookings = bookingsRes.data.data || [];

//       const todayBookings = bookings.filter((b) => isSameDate(b.date));

//       let totalSlots = 0;
//       let fullSlots = 0;

//       const slots = [];

//       activities.forEach((activity) => {
//         activity.slots?.forEach((slot) => {
//           totalSlots++;

//           const slotTime = `${slot.startTime} - ${slot.endTime}`;

//           const booked = bookings.filter(
//             (b) =>
//               b.activityName === activity.name &&
//               b.slotTime.trim() === slotTime.trim() &&
//               isSameDate(b.date)
//           ).length;

//           if (booked >= activity.capacity) fullSlots++;

//           slots.push({
//             activity: activity.name,
//             time: slotTime,
//             booked,
//             capacity: activity.capacity,
//             slotId: slot._id,
//             activityId: activity._id,
//           });
//         });
//       });

//       setStats({
//         totalActivities: activities.length,
//         totalBookings: todayBookings.length,
//         availableSlots: totalSlots - fullSlots,
//         fullSlots,
//       });

//       setTodaySlots(slots);

//     } catch (err) {
//       console.error('Dashboard error:', err);
//     }
//   };

//   useEffect(() => {
//     if (view === 'dashboard') {
//       fetchDashboard();
//     }
//   }, [view, selectedDate]);

//   // ================= SLOT CLICK =================
//   const handleSlotClick = async (slot) => {
//     try {
//       const selected = format(selectedDate, "yyyy-MM-dd");

//       const isSameDate = (date) =>
//         format(new Date(date), "yyyy-MM-dd") === selected;

//       const res = await api.fitnessActivities.getBookings();
//       const bookings = res.data.data || [];

//       const filtered = bookings.filter(
//         (b) =>
//           b.activityName === slot.activity &&
//           b.slotTime.trim() === slot.time.trim() &&
//           isSameDate(b.date)
//       );

//       setSelectedSlot(slot);
//       setSlotBookings(filtered);
//       setShowModal(true);

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 space-y-5">

//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <h1 className="text-xl font-semibold text-gray-800">
//           {view === 'dashboard' && 'Activities'}
//           {view === 'list' && 'Activities List'}
//           {view === 'add' && 'Add Activities'}
//           {view === 'schedule' && 'Scheduled Activities'}
//           {view === 'book' && 'Book Activity'}
//         </h1>

//         <div className="flex gap-2 flex-wrap">
//           <button
//             onClick={() => setView('book')}
//             className={`px-5 py-2 rounded-md text-sm font-semibold
//               ${view === 'book'
//                 ? 'bg-[#000359] text-white'
//                 : 'border border-[#000359] text-[#000359]'}`}
//           >
//             Book Activity
//           </button>

//           <button
//             onClick={() => setView('manage')}
//             className={`px-5 py-2 rounded-md text-sm font-semibold
//               ${view === 'manage'
//                 ? 'bg-[#000359] text-white'
//                 : 'border border-[#000359] text-[#000359]'}`}
//           >
//             Manage Activities
//           </button>

//           <button
//             onClick={() => setView('add')}
//             className={`px-5 py-2 rounded-md text-sm font-semibold
//               ${view === 'add'
//                 ? 'bg-[#000359] text-white'
//                 : 'border border-[#000359] text-[#000359]'}`}
//           >
//             Add Activities
//           </button>
//         </div>
//       </div>

//       {/* DASHBOARD */}
//       {view === 'dashboard' && (
//         <>
//           <DateStrip
//             selectedDate={selectedDate}
//             setSelectedDate={setSelectedDate}
//           />

//           <ActivityStats stats={stats} />

//           <TodaySchedule
//             slots={todaySlots}
//             onSlotClick={handleSlotClick}
//           />
//         </>
//       )}

//       {/* {view === 'list' && (
//         <ActivityList
//           key={refreshKey}
//           onView={() => {}}
//           onSchedule={() => setView('schedule')}
//         />
//       )} */}

//       {view === 'add' && (
//         <AddActivity
//           editData={editActivity}
//           onCancel={() => {
//             setEditActivity(null);
//             setView('dashboard');
//           }}
//           onSaved={() => {
//             setEditActivity(null);
//             handleSaved();
//           }}
//         />
//       )}

//       {view === 'book' && <BookActivity />}

//       {view === 'manage' && (
//         <ActivityManager
//           onEdit={(activity) => {
//             setEditActivity(activity);
//             setView('add');
//           }}
//         />
//       )}

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

//             <h3 className="text-lg font-semibold mb-3">
//               {selectedSlot?.activity}
//             </h3>

//             <p className="text-sm text-gray-500 mb-4">
//               {selectedSlot?.time}
//             </p>

//             {slotBookings.length === 0 ? (
//               <p className="text-sm text-gray-400">No bookings yet</p>
//             ) : (
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {slotBookings.map((b) => (
//                   <div
//                     key={b._id}
//                     className="border rounded-md px-3 py-2 text-sm"
//                   >
//                     {b.customerName}
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="mt-5 text-right">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 text-sm bg-[#000359] text-white rounded-md"
//               >
//                 Close
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }








// import { useState, useEffect, useRef } from 'react';
// import { format, addDays, isToday, isSameDay } from "date-fns";
// import { api } from '../../../services/apiClient';

// export default function Activities() {
//   const [view, setView] = useState('dashboard');
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [slotBookings, setSlotBookings] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editActivity, setEditActivity] = useState(null);

//   const [stats, setStats] = useState({
//     totalActivities: 0,
//     totalBookings: 0,
//     availableSlots: 0,
//     fullSlots: 0,
//   });

//   const [todaySlots, setTodaySlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // ================= DASHBOARD DATA FETCH =================
//   const fetchDashboard = async () => {
//     try {
//       const selected = format(selectedDate, "yyyy-MM-dd");

//       const isSameDate = (date) =>
//         format(new Date(date), "yyyy-MM-dd") === selected;

//       const [activitiesRes, bookingsRes] = await Promise.all([
//         api.fitnessActivities.getAll(),
//         api.fitnessActivities.getBookings(),
//       ]);

//       const activities = activitiesRes.data.data || [];
//       const bookings = bookingsRes.data.data || [];

//       const todayBookings = bookings.filter((b) => isSameDate(b.date));

//       let totalSlots = 0;
//       let fullSlots = 0;
//       const slots = [];

//       activities.forEach((activity) => {
//         activity.slots?.forEach((slot) => {
//           totalSlots++;

//           const slotTime = `${slot.startTime} - ${slot.endTime}`;

//           const booked = bookings.filter(
//             (b) =>
//               b.activityName === activity.name &&
//               b.slotTime.trim() === slotTime.trim() &&
//               isSameDate(b.date)
//           ).length;

//           if (booked >= activity.capacity) fullSlots++;

//           slots.push({
//             activity: activity.name,
//             time: slotTime,
//             booked,
//             capacity: activity.capacity,
//             slotId: slot._id,
//             activityId: activity._id,
//           });
//         });
//       });

//       setStats({
//         totalActivities: activities.length,
//         totalBookings: todayBookings.length,
//         availableSlots: totalSlots - fullSlots,
//         fullSlots,
//       });

//       setTodaySlots(slots);
//     } catch (err) {
//       console.error('Dashboard error:', err);
//     }
//   };

//   useEffect(() => {
//     if (view === 'dashboard') {
//       fetchDashboard();
//     }
//   }, [view, selectedDate]);

//   // ================= SLOT CLICK =================
//   const handleSlotClick = async (slot) => {
//     try {
//       const selected = format(selectedDate, "yyyy-MM-dd");
//       const isSameDate = (date) =>
//         format(new Date(date), "yyyy-MM-dd") === selected;

//       const res = await api.fitnessActivities.getBookings();
//       const bookings = res.data.data || [];

//       const filtered = bookings.filter(
//         (b) =>
//           b.activityName === slot.activity &&
//           b.slotTime.trim() === slot.time.trim() &&
//           isSameDate(b.date)
//       );

//       setSelectedSlot(slot);
//       setSlotBookings(filtered);
//       setShowModal(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSaved = () => {
//     setRefreshKey(prev => prev + 1);
//     setView('dashboard');
//   };

//   // ================= INLINE COMPONENTS =================

//   // DateStrip with Direct Date Input
//   const DateStrip = () => {
//     const scrollRef = useRef(null);
//     const selectedRef = useRef(null);
//     const [anchorOffset, setAnchorOffset] = useState(0);

//     const today = new Date();

//     const days = Array.from({ length: 45 }, (_, i) => {
//       const date = addDays(today, i - 14 + anchorOffset);
//       return {
//         date,
//         isSelected: isSameDay(date, selectedDate),
//         isToday: isToday(date),
//       };
//     });

//     const centerDate = days[22].date;

//     return (
//       <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-3 pb-2 gap-3">
//           <span className="text-sm font-medium text-gray-700">
//             {format(centerDate, "MMMM yyyy")}
//           </span>

//           <div className="flex items-center gap-2">
//             <input
//               type="date"
//               value={format(selectedDate, "yyyy-MM-dd")}
//               onChange={(e) => setSelectedDate(new Date(e.target.value))}
//               className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#000359]"
//             />

//             <button
//               onClick={() => setAnchorOffset((o) => o - 7)}
//               className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
//             >
//               ‹
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedDate(new Date());
//                 setAnchorOffset(0);
//               }}
//               className="px-3 h-8 rounded-lg border border-gray-200 text-xs hover:bg-gray-50 whitespace-nowrap"
//             >
//               Today
//             </button>
//             <button
//               onClick={() => setAnchorOffset((o) => o + 7)}
//               className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
//             >
//               ›
//             </button>
//           </div>
//         </div>

//         {/* Scrollable Days */}
//         <div
//           ref={scrollRef}
//           className="overflow-x-auto flex gap-2 px-4 pb-4 pt-1 scrollbar-hide"
//         >
//           {days.map(({ date, isSelected, isToday: todayFlag }, i) => (
//             <button
//               key={i}
//               ref={isSelected ? selectedRef : null}
//               onClick={() => setSelectedDate(date)}
//               className={`flex flex-col items-center w-[52px] flex-shrink-0 py-3 rounded-2xl border transition-all
//                 ${isSelected
//                   ? "bg-[#000359] border-[#000359] text-white"
//                   : todayFlag
//                   ? "border-blue-200 bg-blue-50"
//                   : "border-transparent hover:bg-gray-50"
//                 }`}
//             >
//               <span className={`text-[10px] font-medium uppercase ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
//                 {format(date, "EEE")}
//               </span>
//               <span className={`text-2xl font-semibold mt-1 ${isSelected ? "text-white" : todayFlag ? "text-blue-600" : "text-gray-800"}`}>
//                 {format(date, "d")}
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Activity Stats
//   const ActivityStats = () => (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//       {[
//         { label: 'Total Activities', value: stats.totalActivities },
//         { label: 'Today\'s Bookings', value: stats.totalBookings },
//         // { label: 'Available Slots', value: stats.availableSlots },
//         // { label: 'Full Slots', value: stats.fullSlots },
//       ].map((item, i) => (
//         <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
//           <p className="text-sm text-gray-500">{item.label}</p>
//           <p className="text-3xl font-semibold text-[#000359] mt-2">{item.value}</p>
//         </div>
//       ))}
//     </div>
//   );

//   // Activity Card
//   const ActivityCard = ({ slot }) => {
//     const isFull = slot.booked >= slot.capacity;

//     return (
//       <div
//         onClick={() => handleSlotClick(slot)}
//         className="flex items-center justify-between border border-gray-200 rounded-xl px-5 py-4 hover:bg-gray-50 transition cursor-pointer active:scale-[0.985]"
//       >
//         <div>
//           <p className="font-semibold text-gray-800">{slot.activity}</p>
//           <p className="text-sm text-gray-500">{slot.time}</p>
//         </div>

//         <div className="text-right">
//           <span
//             className={`font-semibold text-sm px-3 py-1 rounded-full
//               ${isFull ? 'bg-red-100 text-red-600' :
//                 slot.booked >= slot.capacity - 2 ? 'bg-yellow-100 text-yellow-600' :
//                   'bg-green-100 text-green-600'}`}
//           >
//             {isFull ? 'FULL' : `${slot.booked}/${slot.capacity}`}
//           </span>
//         </div>
//       </div>
//     );
//   };

//   // Empty State
//   const EmptyState = ({ message }) => (
//     <div className="py-16 text-center">
//       <p className="text-gray-500">{message}</p>
//     </div>
//   );

//   // Today Schedule
//   const TodaySchedule = () => {
//     const [openGroups, setOpenGroups] = useState({});

//     const grouped = todaySlots.reduce((acc, slot) => {
//       if (!acc[slot.activity]) acc[slot.activity] = [];
//       acc[slot.activity].push(slot);
//       return acc;
//     }, {});

//     const toggleGroup = (activity) => {
//       setOpenGroups(prev => ({ ...prev, [activity]: !prev[activity] }));
//     };

//     return (
//       <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//         <h2 className="text-xl font-semibold mb-5">Schedule for {format(selectedDate, "EEEE, dd MMMM")}</h2>

//         {todaySlots.length === 0 ? (
//           <EmptyState message="No activities scheduled for this date" />
//         ) : (
//           <div className="space-y-4">
//             {Object.entries(grouped).map(([activity, slots]) => {
//               const isOpen = openGroups[activity] !== false; // default open

//               return (
//                 <div key={activity} className="border border-gray-100 rounded-xl overflow-hidden">
//                   <div
//                     onClick={() => toggleGroup(activity)}
//                     className="flex justify-between items-center px-5 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
//                   >
//                     <div>
//                       <span className="font-semibold text-gray-800">{activity}</span>
//                       <span className="ml-2 text-sm text-gray-500">({slots.length} slots)</span>
//                     </div>
//                     <span className="text-xl transition-transform">{isOpen ? '−' : '+'}</span>
//                   </div>

//                   {isOpen && (
//                     <div className="p-4 space-y-3">
//                       {slots.map((slot) => (
//                         <ActivityCard key={slot.slotId} slot={slot} />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           {view === 'dashboard' && 'Activities Dashboard'}
//           {view === 'add' && 'Add / Edit Activity'}
//           {view === 'manage' && 'Manage Activities'}
//           {view === 'book' && 'Book Activity'}
//         </h1>

//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => setView('book')}
//             className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${view === 'book'
//               ? 'bg-[#000359] text-white'
//               : 'border border-[#000359] text-[#000359] hover:bg-gray-50'}`}
//           >
//             Book Activity
//           </button>

//           <button
//             onClick={() => setView('manage')}
//             className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${view === 'manage'
//               ? 'bg-[#000359] text-white'
//               : 'border border-[#000359] text-[#000359] hover:bg-gray-50'}`}
//           >
//             Manage
//           </button>

//           <button
//             onClick={() => {
//               setEditActivity(null);
//               setView('add');
//             }}
//             className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${view === 'add'
//               ? 'bg-[#000359] text-white'
//               : 'border border-[#000359] text-[#000359] hover:bg-gray-50'}`}
//           >
//             + Add Activity
//           </button>
//         </div>
//       </div>

//       {/* DASHBOARD VIEW */}
//       {view === 'dashboard' && (
//         <>
//           <DateStrip />
//           <ActivityStats />
//           <TodaySchedule />
//         </>
//       )}

//       {/* Other Views */}
//       {view === 'add' && (
//         <div className="bg-white rounded-2xl p-6 border border-gray-100">
//           {/* Add your AddActivity component here or import it */}
//           <p className="text-gray-500">AddActivity Form will go here...</p>
//           <button
//             onClick={() => {
//               setEditActivity(null);
//               setView('dashboard');
//             }}
//             className="mt-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       )}

//       {view === 'manage' && (
//         <div className="bg-white rounded-2xl p-6 border border-gray-100">
//           {/* Add your ActivityManager here */}
//           <p className="text-gray-500">ActivityManager will go here...</p>
//         </div>
//       )}

//       {view === 'book' && (
//         <div className="bg-white rounded-2xl p-6 border border-gray-100">
//           {/* Add your BookActivity here */}
//           <p className="text-gray-500">BookActivity component will go here...</p>
//         </div>
//       )}

//       {/* SLOT DETAIL MODAL */}
//       {showModal && selectedSlot && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
//             <h3 className="text-xl font-semibold mb-1">{selectedSlot.activity}</h3>
//             <p className="text-gray-500 mb-6">{selectedSlot.time}</p>

//             {slotBookings.length === 0 ? (
//               <p className="text-gray-400 py-8 text-center">No bookings yet for this slot</p>
//             ) : (
//               <div className="max-h-72 overflow-y-auto space-y-2 mb-6">
//                 {slotBookings.map((b) => (
//                   <div key={b._id} className="bg-gray-50 p-3 rounded-lg text-sm">
//                     {b.customerName}
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-6 py-2.5 bg-[#000359] text-white rounded-xl font-medium hover:bg-[#000280] transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











// import { useState, useEffect, useRef } from 'react';
// import { format, addDays, isToday, isSameDay } from "date-fns";
// import { api } from '../../../services/apiClient';

// export default function Activities() {
//   const [view, setView] = useState('dashboard');
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [slotBookings, setSlotBookings] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editActivity, setEditActivity] = useState(null);

//   const [stats, setStats] = useState({
//     totalActivities: 0,
//     totalBookings: 0,
//     availableSlots: 0,
//     fullSlots: 0,
//   });

//   const [todaySlots, setTodaySlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // ================= DASHBOARD DATA FETCH =================
//   const fetchDashboard = async () => {
//     try {
//       const selected = format(selectedDate, "yyyy-MM-dd");

//       const isSameDate = (date) =>
//         format(new Date(date), "yyyy-MM-dd") === selected;

//       const [activitiesRes, bookingsRes] = await Promise.all([
//         api.fitnessActivities.getAll(),
//         api.fitnessActivities.getBookings(),
//       ]);

//       const activities = activitiesRes.data.data || [];
//       const bookings = bookingsRes.data.data || [];

//       const todayBookings = bookings.filter((b) => isSameDate(b.date));

//       let totalSlots = 0;
//       let fullSlots = 0;
//       const slots = [];

//       activities.forEach((activity) => {
//         activity.slots?.forEach((slot) => {
//           totalSlots++;

//           const slotTime = `${slot.startTime} - ${slot.endTime}`;

//           const booked = bookings.filter(
//             (b) =>
//               b.activityName === activity.name &&
//               b.slotTime.trim() === slotTime.trim() &&
//               isSameDate(b.date)
//           ).length;

//           if (booked >= activity.capacity) fullSlots++;

//           slots.push({
//             activity: activity.name,
//             time: slotTime,
//             booked,
//             capacity: activity.capacity,
//             slotId: slot._id,
//             activityId: activity._id,
//           });
//         });
//       });

//       setStats({
//         totalActivities: activities.length,
//         totalBookings: todayBookings.length,
//         availableSlots: totalSlots - fullSlots,
//         fullSlots,
//       });

//       setTodaySlots(slots);
//     } catch (err) {
//       console.error('Dashboard error:', err);
//     }
//   };

//   useEffect(() => {
//     if (view === 'dashboard') {
//       fetchDashboard();
//     }
//   }, [view, selectedDate]);

//   // ================= SLOT CLICK =================
//   const handleSlotClick = async (slot) => {
//     try {
//       const selected = format(selectedDate, "yyyy-MM-dd");
//       const isSameDate = (date) =>
//         format(new Date(date), "yyyy-MM-dd") === selected;

//       const res = await api.fitnessActivities.getBookings();
//       const bookings = res.data.data || [];

//       const filtered = bookings.filter(
//         (b) =>
//           b.activityName === slot.activity &&
//           b.slotTime.trim() === slot.time.trim() &&
//           isSameDate(b.date)
//       );

//       setSelectedSlot(slot);
//       setSlotBookings(filtered);
//       setShowModal(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSaved = () => {
//     setRefreshKey(prev => prev + 1);
//     setView('dashboard');
//   };

//   // ================= DATE STRIP (Original UI + Auto Scroll) =================
//   const DateStrip = () => {
//     const scrollRef = useRef(null);
//     const selectedRef = useRef(null);
//     const [anchorOffset, setAnchorOffset] = useState(0);

//     const today = new Date();

//     const days = Array.from({ length: 45 }, (_, i) => {
//       const date = addDays(today, i - 14 + anchorOffset);
//       return {
//         date,
//         isSelected: isSameDay(date, selectedDate),
//         isToday: isToday(date),
//       };
//     });

//     const centerDate = days[22].date;

//     // Auto scroll to selected date
//     useEffect(() => {
//       if (selectedRef.current && scrollRef.current) {
//         selectedRef.current.scrollIntoView({
//           behavior: "smooth",
//           inline: "center",
//           block: "nearest",
//         });
//       }
//     }, [selectedDate, anchorOffset]);

//     return (
//       <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 pt-3 pb-1">
//           <span className="text-sm font-medium text-gray-700">
//             {format(centerDate, "MMMM yyyy")}
//           </span>

//           <div className="flex gap-2">
//             <input
//               type="date"
//               value={format(selectedDate, "yyyy-MM-dd")}
//               onChange={(e) => setSelectedDate(new Date(e.target.value))}
//               className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#000359]"
//             />

//             <button
//               onClick={() => setAnchorOffset((o) => o - 7)}
//               className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-base"
//             >
//               ‹
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedDate(new Date());
//                 setAnchorOffset(0);
//               }}
//               className="px-3 h-7 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50"
//             >
//               Today
//             </button>
//             <button
//               onClick={() => setAnchorOffset((o) => o + 7)}
//               className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-base"
//             >
//               ›
//             </button>
//           </div>
//         </div>

//         {/* Scrollable Strip */}
//         <div
//           ref={scrollRef}
//           className="overflow-x-auto flex gap-1.5 px-3 pb-3 pt-1 scrollbar-hide"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         >
//           {days.map(({ date, isSelected, isToday: todayFlag }, i) => (
//             <button
//               key={i}
//               ref={isSelected ? selectedRef : null}
//               onClick={() => setSelectedDate(date)}
//               className={`flex flex-col items-center w-[54px] flex-shrink-0 py-2.5 rounded-xl border transition-all
//                 ${isSelected
//                   ? "bg-blue-600 border-transparent text-white"
//                   : todayFlag
//                   ? "border-gray-300"
//                   : "border-transparent hover:bg-gray-50 hover:border-gray-100"
//                 }`}
//             >
//               <span className={`text-[11px] font-medium uppercase tracking-wide ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
//                 {format(date, "EEE")}
//               </span>
//               <span className={`text-xl font-medium leading-snug ${isSelected ? "text-white" : todayFlag ? "text-blue-600" : "text-gray-800"}`}>
//                 {format(date, "d")}
//               </span>
//               <div className={`w-1 h-1 rounded-full mt-1 ${todayFlag && !isSelected ? "bg-blue-500" : "invisible"}`} />
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // ================= TODAY SCHEDULE - IMPROVED =================
//   const TodaySchedule = () => {
//     const [expandedActivities, setExpandedActivities] = useState({});

//     const grouped = todaySlots.reduce((acc, slot) => {
//       if (!acc[slot.activity]) acc[slot.activity] = [];
//       acc[slot.activity].push(slot);
//       return acc;
//     }, {});

//     const toggleExpand = (activity) => {
//       setExpandedActivities(prev => ({
//         ...prev,
//         [activity]: !prev[activity]
//       }));
//     };

//     return (
//       <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//         <h2 className="text-xl font-semibold mb-5">
//           Schedule for {format(selectedDate, "EEEE, dd MMMM yyyy")}
//         </h2>

//         {todaySlots.length === 0 ? (
//           <div className="py-16 text-center text-gray-500">
//             No activities scheduled for this date
//           </div>
//         ) : (
//           <div className="space-y-5">
//             {Object.entries(grouped).map(([activity, slots]) => {
//               const isExpanded = expandedActivities[activity];
//               const visibleSlots = slots.slice(0, 3);
//               const hasMore = slots.length > 3;

//               return (
//                 <div key={activity} className="border border-gray-200 rounded-xl overflow-hidden">
//                   {/* Activity Header */}
//                   <div className="bg-gray-50 px-5 py-4 border-b">
//                     <h3 className="font-semibold text-lg text-gray-800">{activity}</h3>
//                   </div>

//                   {/* Slots */}
//                   <div className="divide-y">
//                     {visibleSlots.map((slot, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => handleSlotClick(slot)}
//                         className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition"
//                       >
//                         <div>
//                           <p className="font-medium text-gray-700">{slot.time}</p>
//                         </div>
//                         <div>
//                           <span
//                             className={`px-4 py-1.5 rounded-full text-sm font-semibold
//                               ${slot.booked >= slot.capacity ? 'bg-red-100 text-red-600' :
//                                 slot.booked >= slot.capacity - 2 ? 'bg-yellow-100 text-yellow-600' :
//                                 'bg-green-100 text-green-600'}`}
//                           >
//                             {slot.booked >= slot.capacity ? 'Full' : `${slot.booked}/${slot.capacity}`}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* View More Button */}
//                   {hasMore && (
//                     <div
//                       onClick={() => toggleExpand(activity)}
//                       className="px-5 py-3 text-[#000359] text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer border-t"
//                     >
//                       {isExpanded ? "Show Less" : `View ${slots.length - 3} More Slots`}
//                       <span className="text-lg transition-transform">{isExpanded ? '↑' : '↓'}</span>
//                     </div>
//                   )}

//                   {/* Expanded Extra Slots */}
//                   {isExpanded && hasMore && (
//                     <div className="divide-y">
//                       {slots.slice(3).map((slot, idx) => (
//                         <div
//                           key={idx}
//                           onClick={() => handleSlotClick(slot)}
//                           className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition"
//                         >
//                           <div>
//                             <p className="font-medium text-gray-700">{slot.time}</p>
//                           </div>
//                           <div>
//                             <span
//                               className={`px-4 py-1.5 rounded-full text-sm font-semibold
//                                 ${slot.booked >= slot.capacity ? 'bg-red-100 text-red-600' :
//                                   slot.booked >= slot.capacity - 2 ? 'bg-yellow-100 text-yellow-600' :
//                                   'bg-green-100 text-green-600'}`}
//                             >
//                               {slot.booked >= slot.capacity ? 'Full' : `${slot.booked}/${slot.capacity}`}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           {view === 'dashboard' && 'Activities Dashboard'}
//           {view === 'add' && 'Add / Edit Activity'}
//           {view === 'manage' && 'Manage Activities'}
//           {view === 'book' && 'Book Activity'}
//         </h1>

//         <div className="flex flex-wrap gap-3">
//           <button onClick={() => setView('book')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${view === 'book' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'}`}>
//             Book Activity
//           </button>
//           <button onClick={() => setView('manage')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${view === 'manage' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'}`}>
//             Manage
//           </button>
//           <button onClick={() => { setEditActivity(null); setView('add'); }} className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${view === 'add' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'}`}>
//             + Add Activity
//           </button>
//         </div>
//       </div>

//       {/* Dashboard */}
//       {view === 'dashboard' && (
//         <>
//           <DateStrip />
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white border border-gray-200 rounded-2xl p-5">
//               <p className="text-sm text-gray-500">Total Activities</p>
//               <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.totalActivities}</p>
//             </div>
//             <div className="bg-white border border-gray-200 rounded-2xl p-5">
//               <p className="text-sm text-gray-500">Today's Bookings</p>
//               <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.totalBookings}</p>
//             </div>
//           </div>

//           <TodaySchedule />
//         </>
//       )}

//       {/* Other Views (Placeholders) */}
//       {view === 'add' && <div className="p-8 bg-white rounded-2xl border">AddActivity Component Here</div>}
//       {view === 'manage' && <div className="p-8 bg-white rounded-2xl border">ActivityManager Here</div>}
//       {view === 'book' && <div className="p-8 bg-white rounded-2xl border">BookActivity Here</div>}

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-md p-6">
//             <h3 className="text-xl font-semibold">{selectedSlot?.activity}</h3>
//             <p className="text-gray-500 mt-1 mb-6">{selectedSlot?.time}</p>

//             {slotBookings.length === 0 ? (
//               <p className="text-gray-400 py-10 text-center">No bookings yet</p>
//             ) : (
//               <div className="space-y-2 max-h-64 overflow-auto">
//                 {slotBookings.map(b => (
//                   <div key={b._id} className="p-3 bg-gray-50 rounded-lg">{b.customerName}</div>
//                 ))}
//               </div>
//             )}

//             <button
//               onClick={() => setShowModal(false)}
//               className="mt-6 w-full py-3 bg-[#000359] text-white rounded-xl font-medium"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }














import { useState, useEffect, useRef } from 'react';
import { format, addDays, isToday, isSameDay } from "date-fns";
import { api } from '../../../services/apiClient';

// Sub Components
import ActivityManager from './ActivityManager';
import AddActivity from './AddActivity';
import BookActivity from './BookActivity';

export default function Activities() {
  const [view, setView] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotBookings, setSlotBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editActivity, setEditActivity] = useState(null);

  const [stats, setStats] = useState({
    totalActivities: 0,
    totalBookings: 0,
    availableSlots: 0,
    fullSlots: 0,
  });

  const [todaySlots, setTodaySlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ================= DASHBOARD DATA FETCH =================
  const fetchDashboard = async () => {
    try {
      const selected = format(selectedDate, "yyyy-MM-dd");

      const isSameDate = (date) =>
        format(new Date(date), "yyyy-MM-dd") === selected;

      const [activitiesRes, bookingsRes] = await Promise.all([
        api.fitnessActivities.getAll(),
        api.fitnessActivities.getBookings(),
      ]);

      const activities = activitiesRes.data.data || [];
      const bookings = bookingsRes.data.data || [];

      const todayBookings = bookings.filter((b) => isSameDate(b.date));

      let totalSlots = 0;
      let fullSlots = 0;
      const slots = [];

      activities.forEach((activity) => {
        activity.slots?.forEach((slot) => {
          totalSlots++;

          const slotTime = `${slot.startTime} - ${slot.endTime}`;

          const booked = bookings.filter(
            (b) =>
              b.activityName === activity.name &&
              b.slotTime?.trim() === slotTime.trim() &&
              isSameDate(b.date)
          ).length;

          if (booked >= activity.capacity) fullSlots++;

          slots.push({
            activity: activity.name,
            time: slotTime,
            booked,
            capacity: activity.capacity,
            slotId: slot._id,
            activityId: activity._id,
          });
        });
      });

      setStats({
        totalActivities: activities.length,
        totalBookings: todayBookings.length,
        availableSlots: totalSlots - fullSlots,
        fullSlots,
      });

      setTodaySlots(slots);
    } catch (err) {
      console.error('Dashboard error:', err);
    }
  };

  useEffect(() => {
    if (view === 'dashboard') {
      fetchDashboard();
    }
  }, [view, selectedDate, refreshKey]);

  // ================= SLOT CLICK =================
  const handleSlotClick = async (slot) => {
    try {
      const selected = format(selectedDate, "yyyy-MM-dd");
      const isSameDate = (date) =>
        format(new Date(date), "yyyy-MM-dd") === selected;

      const res = await api.fitnessActivities.getBookings();
      const bookings = res.data.data || [];

      const filtered = bookings.filter(
        (b) =>
          b.activityName === slot.activity &&
          b.slotTime?.trim() === slot.time.trim() &&
          isSameDate(b.date)
      );

      setSelectedSlot(slot);
      setSlotBookings(filtered);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaved = () => {
    setRefreshKey((prev) => prev + 1);
    setView('dashboard');
    setEditActivity(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {view === 'dashboard' && 'Activities Dashboard'}
          {view === 'add' && 'Add / Edit Activity'}
          {view === 'manage' && 'Manage Activities'}
          {view === 'book' && 'Book Activity'}
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setView('book')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${
              view === 'book' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'
            }`}
          >
            Book Activity
          </button>

          <button
            onClick={() => setView('manage')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${
              view === 'manage' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'
            }`}
          >
            Manage
          </button>

          <button
            onClick={() => {
              setEditActivity(null);
              setView('add');
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${
              view === 'add' ? 'bg-[#000359] text-white' : 'border border-[#000359] text-[#000359]'
            }`}
          >
            + Add Activity
          </button>
        </div>
      </div>

      {/* ================= DASHBOARD VIEW ================= */}
      {view === 'dashboard' && (
        <>
          <DateStrip selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Total Activities</p>
              <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.totalActivities}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Today's Bookings</p>
              <p className="text-3xl font-semibold text-[#000359] mt-1">{stats.totalBookings}</p>
            </div>
          </div>

          <TodaySchedule
            todaySlots={todaySlots}
            selectedDate={selectedDate}
            handleSlotClick={handleSlotClick}
          />
        </>
      )}

      {/* ================= MANAGE VIEW ================= */}
      {view === 'manage' && (
        <ActivityManager
          onEdit={(activity) => {
            setEditActivity(activity);
            setView('add');
          }}
        />
      )}

      {/* ================= ADD / EDIT VIEW ================= */}
      {view === 'add' && (
        <AddActivity
          editData={editActivity}
          onCancel={() => {
            setEditActivity(null);
            setView('manage');
          }}
          onSaved={handleSaved}
        />
      )}

      {/* ================= BOOK VIEW ================= */}
      {view === 'book' && <BookActivity />}

      {/* ================= BOOKING MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold">{selectedSlot?.activity}</h3>
            <p className="text-gray-500 mt-1 mb-6">{selectedSlot?.time}</p>

            {slotBookings.length === 0 ? (
              <p className="text-gray-400 py-10 text-center">No bookings yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-auto">
                {slotBookings.map((b) => (
                  <div key={b._id} className="p-3 bg-gray-50 rounded-lg">
                    {b.customerName}
                  </div>
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
  const days = Array.from({ length: 45 }, (_, i) => {
    const date = addDays(today, i - 14 + anchorOffset);
    return {
      date,
      isSelected: isSameDay(date, selectedDate),
      isToday: isToday(date),
    };
  });

  const centerDate = days[22].date;

  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDate, anchorOffset]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-sm font-medium text-gray-700">
          {format(centerDate, "MMMM yyyy")}
        </span>

        <div className="flex gap-2">
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#000359]"
          />

          <button
            onClick={() => setAnchorOffset((o) => o - 7)}
            className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-base"
          >
            ‹
          </button>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setAnchorOffset(0);
            }}
            className="px-3 h-7 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => setAnchorOffset((o) => o + 7)}
            className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-base"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto flex gap-1.5 px-3 pb-3 pt-1 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {days.map(({ date, isSelected, isToday: todayFlag }, i) => (
          <button
            key={i}
            ref={isSelected ? selectedRef : null}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center w-[54px] flex-shrink-0 py-2.5 rounded-xl border transition-all
              ${isSelected
                ? "bg-blue-600 border-transparent text-white"
                : todayFlag
                ? "border-gray-300"
                : "border-transparent hover:bg-gray-50 hover:border-gray-100"
              }`}
          >
            <span className={`text-[11px] font-medium uppercase tracking-wide ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
              {format(date, "EEE")}
            </span>
            <span className={`text-xl font-medium leading-snug ${isSelected ? "text-white" : todayFlag ? "text-blue-600" : "text-gray-800"}`}>
              {format(date, "d")}
            </span>
            <div className={`w-1 h-1 rounded-full mt-1 ${todayFlag && !isSelected ? "bg-blue-500" : "invisible"}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

// ====================== TODAY SCHEDULE ======================
const TodaySchedule = ({ todaySlots, selectedDate, handleSlotClick }) => {
  const [expandedActivities, setExpandedActivities] = useState({});

  const grouped = todaySlots.reduce((acc, slot) => {
    if (!acc[slot.activity]) acc[slot.activity] = [];
    acc[slot.activity].push(slot);
    return acc;
  }, {});

  const toggleExpand = (activity) => {
    setExpandedActivities((prev) => ({
      ...prev,
      [activity]: !prev[activity],
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-5">
        Schedule for {format(selectedDate, "EEEE, dd MMMM yyyy")}
      </h2>

      {todaySlots.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          No activities scheduled for this date
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([activity, slots]) => {
            const isExpanded = expandedActivities[activity];
            const visibleSlots = slots.slice(0, 3);
            const hasMore = slots.length > 3;

            return (
              <div key={activity} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b">
                  <h3 className="font-semibold text-lg text-gray-800">{activity}</h3>
                </div>

                <div className="divide-y">
                  {visibleSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSlotClick(slot)}
                      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div>
                        <p className="font-medium text-gray-700">{slot.time}</p>
                      </div>
                      <div>
                        <span
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold
                            ${slot.booked >= slot.capacity ? 'bg-red-100 text-red-600' :
                              slot.booked >= slot.capacity - 2 ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'}`}
                        >
                          {slot.booked >= slot.capacity ? 'Full' : `${slot.booked}/${slot.capacity}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div
                    onClick={() => toggleExpand(activity)}
                    className="px-5 py-3 text-[#000359] text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer border-t"
                  >
                    {isExpanded ? "Show Less" : `View ${slots.length - 3} More Slots`}
                    <span className="text-lg transition-transform">{isExpanded ? '↑' : '↓'}</span>
                  </div>
                )}

                {isExpanded && hasMore && (
                  <div className="divide-y">
                    {slots.slice(3).map((slot, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSlotClick(slot)}
                        className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div>
                          <p className="font-medium text-gray-700">{slot.time}</p>
                        </div>
                        <div>
                          <span
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold
                              ${slot.booked >= slot.capacity ? 'bg-red-100 text-red-600' :
                                slot.booked >= slot.capacity - 2 ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'}`}
                          >
                            {slot.booked >= slot.capacity ? 'Full' : `${slot.booked}/${slot.capacity}`}
                          </span>
                        </div>
                      </div>
                    ))}
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