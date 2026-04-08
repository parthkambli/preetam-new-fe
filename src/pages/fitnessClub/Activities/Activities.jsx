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


// pages/fitnessClub/Activities/Activities.jsx
import { useState } from 'react';
import ActivityList from './Activitylist';
import AddActivity from './Addactivity';
import ScheduleActivity from './Scheduleactivity';
import BookActivity from './BookActivity'

export default function Activities() {
  const [view, setView] = useState('list');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setRefreshKey(prev => prev + 1);
    setView('list');
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-800">
          {view === 'list'     && 'Activities'}
          {view === 'add'      && 'Add Activities'}
          {view === 'schedule' && 'Scheduled Activities'}
        </h1>

        <div className="flex gap-2 flex-wrap">
          {/* <button
            onClick={() => setView('schedule')}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap
              ${view === 'schedule'
                ? 'bg-[#000359] text-white shadow-md'
                : 'border border-[#000359] text-[#000359] bg-white hover:bg-[#000359]/5'}`}
          >
            Scheduled Activities
          </button> */}
          <button
  onClick={() => setView('book')}
  className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap
    ${view === 'book'
      ? 'bg-[#000359] text-white shadow-md'
      : 'border border-[#000359] text-[#000359] bg-white hover:bg-[#000359]/5'}`}
>
  Book Activity
</button>
          <button
            onClick={() => setView('add')}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap
              ${view === 'add'
                ? 'bg-[#000359] text-white shadow-md'
                : 'border border-[#000359] text-[#000359] bg-white hover:bg-[#000359]/5'}`}
          >
            Add Activities
          </button>
        </div>
      </div>

{view === 'list' && (
  <ActivityList
    key={refreshKey}
    onView={() => {}}
    onSchedule={() => setView('schedule')}
  />
)}

{view === 'add' && (
  <AddActivity
    onCancel={() => setView('list')}
    onSaved={handleSaved}
  />
)}

{view === 'book' && (
  <BookActivity />
)}

{false && view === 'schedule' && (
  <ScheduleActivity
    onCancel={() => setView('list')}
    onSaved={handleSaved}
  />
)}

    </div>
  );
}