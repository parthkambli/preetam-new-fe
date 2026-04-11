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


import { useState, useEffect } from 'react';
import ActivityList from './Activitylist';
import AddActivity from './Addactivity';
import ScheduleActivity from './Scheduleactivity';
import BookActivity from './BookActivity';
import ActivityStats from './components/ActivityStats';
import TodaySchedule from './components/TodaySchedule';
import ActivityManager from './ActivityManager';
import { format } from "date-fns";
import DateStrip from "./components/DateStrip";
import { api } from '../../../services/apiClient';

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

  const handleSaved = () => {
    setRefreshKey(prev => prev + 1);
    setView('list');
  };

  // ================= DASHBOARD =================
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
              b.slotTime.trim() === slotTime.trim() &&
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
  }, [view, selectedDate]);

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
          b.slotTime.trim() === slot.time.trim() &&
          isSameDate(b.date)
      );

      setSelectedSlot(slot);
      setSlotBookings(filtered);
      setShowModal(true);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-800">
          {view === 'dashboard' && 'Activities'}
          {view === 'list' && 'Activities List'}
          {view === 'add' && 'Add Activities'}
          {view === 'schedule' && 'Scheduled Activities'}
          {view === 'book' && 'Book Activity'}
        </h1>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setView('book')}
            className={`px-5 py-2 rounded-md text-sm font-semibold
              ${view === 'book'
                ? 'bg-[#000359] text-white'
                : 'border border-[#000359] text-[#000359]'}`}
          >
            Book Activity
          </button>

          <button
            onClick={() => setView('manage')}
            className={`px-5 py-2 rounded-md text-sm font-semibold
              ${view === 'manage'
                ? 'bg-[#000359] text-white'
                : 'border border-[#000359] text-[#000359]'}`}
          >
            Manage Activities
          </button>

          <button
            onClick={() => setView('add')}
            className={`px-5 py-2 rounded-md text-sm font-semibold
              ${view === 'add'
                ? 'bg-[#000359] text-white'
                : 'border border-[#000359] text-[#000359]'}`}
          >
            Add Activities
          </button>
        </div>
      </div>

      {/* DASHBOARD */}
      {view === 'dashboard' && (
        <>
          <DateStrip
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <ActivityStats stats={stats} />

          <TodaySchedule
            slots={todaySlots}
            onSlotClick={handleSlotClick}
          />
        </>
      )}

      {view === 'list' && (
        <ActivityList
          key={refreshKey}
          onView={() => {}}
          onSchedule={() => setView('schedule')}
        />
      )}

      {view === 'add' && (
        <AddActivity
          editData={editActivity}
          onCancel={() => {
            setEditActivity(null);
            setView('dashboard');
          }}
          onSaved={() => {
            setEditActivity(null);
            handleSaved();
          }}
        />
      )}

      {view === 'book' && <BookActivity />}

      {view === 'manage' && (
        <ActivityManager
          onEdit={(activity) => {
            setEditActivity(activity);
            setView('add');
          }}
        />
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

            <h3 className="text-lg font-semibold mb-3">
              {selectedSlot?.activity}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              {selectedSlot?.time}
            </p>

            {slotBookings.length === 0 ? (
              <p className="text-sm text-gray-400">No bookings yet</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {slotBookings.map((b) => (
                  <div
                    key={b._id}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    {b.customerName}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-[#000359] text-white rounded-md"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}