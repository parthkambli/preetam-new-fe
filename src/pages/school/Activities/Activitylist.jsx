// // pages/school/Activities/ActivityList.jsx
// import { useState } from 'react';

// const dummyActivities = [
//   { _id: '1', name: 'Yoga',  date: '20/01/2026', time: '07:00 AM', place: 'Main Hall',   instructor: 'Mr. Sharma' },
//   { _id: '2', name: 'Music', date: '21/01/2026', time: '05:00 PM', place: 'Music Room',  instructor: 'Mr. Joshi'  },
//   { _id: '3', name: 'Art',   date: '22/01/2026', time: '04:00 PM', place: 'Art Room',    instructor: 'Ms. Kavita' },
// ];

// export default function ActivityList({ activities = dummyActivities, onView, onEdit }) {
//   const [search,     setSearch]     = useState('');
//   const [date,       setDate]       = useState('');
//   const [instructor, setInstructor] = useState('');

//   const [editId,   setEditId]   = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const [list,     setList]     = useState(activities);
//   const [saved,    setSaved]    = useState(false);

//   // Filter
//   const filtered = list.filter(a => {
//     const matchSearch     = !search     || a.name.toLowerCase().includes(search.toLowerCase());
//     const matchInstructor = !instructor || a.instructor.toLowerCase().includes(instructor.toLowerCase());
//     const matchDate       = !date       || (() => {
//       const [y, m, d] = date.split('-');
//       return a.date === `${d}/${m}/${y}`;
//     })();
//     return matchSearch && matchInstructor && matchDate;
//   });

//   const startEdit = (a) => {
//     setEditId(a._id);
//     setEditForm({ ...a });
//   };

//   const cancelEdit = () => { setEditId(null); setEditForm({}); };

//   const saveEdit = () => {
//     setList(prev => prev.map(a => a._id === editId ? { ...editForm } : a));
//     setEditId(null);
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   return (
//     <div className="space-y-4">

//       {saved && (
//         <div className="px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
//           <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//           Activity updated successfully.
//         </div>
//       )}

//       {/* Filters */}
//       <div className="flex flex-wrap gap-2 sm:gap-3">
//         <input
//           type="text"
//           placeholder="Search Activity"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48
//                      focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         />
//         <input
//           type="date"
//           value={date}
//           onChange={e => setDate(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto
//                      focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         />
//         <input
//           type="text"
//           placeholder="Instructor Name"
//           value={instructor}
//           onChange={e => setInstructor(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48
//                      focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         />
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm min-w-[620px]">
//             <thead>
//               <tr className="bg-[#000359] text-white text-left">
//                 {['Activity Name', 'Date', 'Time', 'Place', 'Instructor', 'Actions'].map(h => (
//                   <th key={h} className="px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-10 text-gray-400">No activities found.</td>
//                 </tr>
//               ) : filtered.map((a, i) => (
//                 editId === a._id ? (
//                   /* ── Inline edit row ── */
//                   <tr key={a._id} className="border-t border-gray-100 bg-blue-50/40">
//                     <td className="px-3 py-2">
//                       <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
//                         className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
//                     </td>
//                     <td className="px-3 py-2">
//                       <input type="date"
//                         value={editForm.date ? (() => { const [d,m,y] = editForm.date.split('/'); return `${y}-${m}-${d}`; })() : ''}
//                         onChange={e => {
//                           const [y,m,d] = e.target.value.split('-');
//                           setEditForm(p => ({ ...p, date: `${d}/${m}/${y}` }));
//                         }}
//                         className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
//                     </td>
//                     <td className="px-3 py-2">
//                       <input type="time"
//                         value={editForm.time ? (() => {
//                           const [t, ampm] = editForm.time.split(' ');
//                           let [h, min] = t.split(':');
//                           if (ampm === 'PM' && h !== '12') h = String(parseInt(h) + 12);
//                           if (ampm === 'AM' && h === '12') h = '00';
//                           return `${h.padStart(2,'0')}:${min}`;
//                         })() : ''}
//                         onChange={e => {
//                           const [h, min] = e.target.value.split(':');
//                           const hr = parseInt(h);
//                           const ampm = hr >= 12 ? 'PM' : 'AM';
//                           const h12 = hr % 12 || 12;
//                           setEditForm(p => ({ ...p, time: `${String(h12).padStart(2,'0')}:${min} ${ampm}` }));
//                         }}
//                         className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
//                     </td>
//                     <td className="px-3 py-2">
//                       <input value={editForm.place} onChange={e => setEditForm(p => ({ ...p, place: e.target.value }))}
//                         className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
//                     </td>
//                     <td className="px-3 py-2">
//                       <input value={editForm.instructor} onChange={e => setEditForm(p => ({ ...p, instructor: e.target.value }))}
//                         className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
//                     </td>
//                     <td className="px-3 py-2 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button onClick={saveEdit}
//                           className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors">
//                           Save
//                         </button>
//                         <button onClick={cancelEdit}
//                           className="border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded transition-colors">
//                           Cancel
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   /* ── Normal row ── */
//                   <tr key={a._id}
//                     className={`border-t border-gray-100 transition-colors hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
//                     <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">{a.name}</td>
//                     <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.date}</td>
//                     <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.time}</td>
//                     <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.place}</td>
//                     <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.instructor}</td>
//                     <td className="px-5 py-3.5 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => onView?.(a)}
//                           className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded transition-colors"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => startEdit(a)}
//                           className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }









// // pages/school/Activities/ActivityList.jsx
// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// export default function ActivityList({ onView, onSchedule }) {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [date, setDate] = useState('');
//   const [instructor, setInstructor] = useState('');

//   const [editId, setEditId] = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const [saved, setSaved] = useState(false);

//   // Fetch scheduled activities
//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         setLoading(true);
//         const res = await api.activities.getAllScheduled();
//         const data = res.data?.data || res.data || [];
//         setList(data);
//       } catch (err) {
//         console.error(err);
//         const msg = err.response?.data?.message || 'Failed to load scheduled activities';
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActivities();
//   }, []);

//   // Filter logic (unchanged)
//   const filtered = list.filter(a => {
//     const activityName = a.activity?.name || a.name || '';
//     const matchSearch = !search || activityName.toLowerCase().includes(search.toLowerCase());
//     const matchInstructor = !instructor || (a.instructorName || '').toLowerCase().includes(instructor.toLowerCase());
//     const matchDate = !date || (() => {
//       const activityDate = a.date ? new Date(a.date).toLocaleDateString('en-GB') : '';
//       const [y, m, d] = date.split('-');
//       return activityDate === `${d}/${m}/${y}`;
//     })();
//     return matchSearch && matchInstructor && matchDate;
//   });

//   const startEdit = (a) => {
//     setEditId(a._id);
//     setEditForm({
//       ...a,
//       activity: a.activity?._id || a.activity,
//       date: a.date ? new Date(a.date).toISOString().split('T')[0] : '',
//     });
//   };

//   const cancelEdit = () => {
//     setEditId(null);
//     setEditForm({});
//   };

//   const saveEdit = async () => {
//     if (!editId) return;

//     try {
//       await api.activities.updateScheduled(editId, {
//         activity: editForm.activity,
//         date: editForm.date,
//         time: editForm.time,
//         place: editForm.place,
//         instructorName: editForm.instructorName || editForm.instructor,
//       });

//       toast.success("Activity updated successfully");
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2500);

//       // Refresh list
//       const res = await api.activities.getAllScheduled();
//       setList(res.data?.data || res.data || []);
//       setEditId(null);
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to update activity';
//       toast.error(msg);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-gray-500">Loading activities...</div>;
//   }

//   return (
//     <div className="space-y-4">

//       {saved && (
//         <div className="px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
//           <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//           Activity updated successfully.
//         </div>
//       )}

//       {/* Filters - UI unchanged */}
//       <div className="flex flex-wrap gap-2 sm:gap-3">
//         <input
//           type="text"
//           placeholder="Search Activity"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         />
//         <input
//           type="date"
//           value={date}
//           onChange={e => setDate(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         />
//         <input
//           type="text"
//           placeholder="Instructor Name"
//           value={instructor}
//           onChange={e => setInstructor(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         />
//       </div>

//       {/* Table - UI unchanged */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm min-w-[620px]">
//             <thead>
//               <tr className="bg-[#000359] text-white text-left">
//                 {['Activity Name', 'Date', 'Time', 'Place', 'Instructor', 'Actions'].map(h => (
//                   <th key={h} className="px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-10 text-gray-400">No activities found.</td>
//                 </tr>
//               ) : filtered.map((a, i) => (
//                 editId === a._id ? (
//                   /* Inline edit row */
//                   <tr key={a._id} className="border-t border-gray-100 bg-blue-50/40">
//                     <td className="px-3 py-2">
//                       <input 
//                         value={editForm.activity?.name || editForm.activity} 
//                         disabled 
//                         className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-gray-100" 
//                       />
//                     </td>
//                     <td className="px-3 py-2">
//                       <input 
//                         type="date"
//                         value={editForm.date || ''}
//                         onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))}
//                         className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" 
//                       />
//                     </td>
//                     <td className="px-3 py-2">
//                       <input 
//                         type="time"
//                         value={editForm.time || ''}
//                         onChange={e => setEditForm(p => ({ ...p, time: e.target.value }))}
//                         className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" 
//                       />
//                     </td>
//                     <td className="px-3 py-2">
//                       <input 
//                         value={editForm.place || ''} 
//                         onChange={e => setEditForm(p => ({ ...p, place: e.target.value }))}
//                         className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" 
//                       />
//                     </td>
//                     <td className="px-3 py-2">
//                       <input 
//                         value={editForm.instructorName || editForm.instructor || ''} 
//                         onChange={e => setEditForm(p => ({ ...p, instructorName: e.target.value }))}
//                         className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" 
//                       />
//                     </td>
//                     <td className="px-3 py-2 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button onClick={saveEdit} className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors">
//                           Save
//                         </button>
//                         <button onClick={cancelEdit} className="border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded transition-colors">
//                           Cancel
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   /* Normal row */
//                   <tr key={a._id} className={`border-t border-gray-100 transition-colors hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
//                     <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">
//                       {a.activity?.name || a.name}
//                     </td>
//                     <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
//                       {a.date ? new Date(a.date).toLocaleDateString('en-GB') : '—'}
//                     </td>
//                     <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.time}</td>
//                     <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.place}</td>
//                     <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.instructorName}</td>
//                     <td className="px-5 py-3.5 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => onView?.(a)}
//                           className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded transition-colors"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => startEdit(a)}
//                           className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }





// pages/school/Activities/ActivityList.jsx
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

// ─── Validation for the inline edit row ──────────────────────────────────────
const validateEditForm = (form) => {
  const errors = {};

  if (!form.date) {
    errors.date = 'Date is required.';
  } else {
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    if (new Date(form.date) > twoYearsFromNow) {
      errors.date = 'Date seems too far in the future.';
    }
  }

  if (!form.time) {
    errors.time = 'Time is required.';
  }

  if (!form.place?.trim()) {
    errors.place = 'Place is required.';
  }

  const instructorVal = (form.instructorName || form.instructor || '').trim();
  if (!instructorVal) {
    errors.instructorName = 'Instructor name is required.';
  } else if (instructorVal.length < 2) {
    errors.instructorName = 'Instructor name must be at least 2 characters.';
  }

  return errors;
};

// ─────────────────────────────────────────────────────────────────────────────
export default function ActivityList({ onView, onSchedule }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [instructor, setInstructor] = useState('');

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});   // inline field errors for edit row
  const [savingEdit, setSavingEdit] = useState(false);

  // ── Fetch activities ─────────────────────────────────────────────────────
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.activities.getAllScheduled();
      const data = res.data?.data || res.data || [];
      setList(data);
    } catch (err) {
      console.error('ActivityList fetch error:', err);
      if (!err.response) {
        toast.error('Cannot connect to server. Please check your internet connection.');
      } else if (err.response.status === 403) {
        toast.error('You do not have permission to view activities.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to load scheduled activities.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // ── Filter logic ─────────────────────────────────────────────────────────
  const filtered = list.filter(a => {
    const activityName = a.activity?.name || a.name || '';
    const matchSearch = !search || activityName.toLowerCase().includes(search.toLowerCase());
    const matchInstructor = !instructor ||
      (a.instructorName || '').toLowerCase().includes(instructor.toLowerCase());
    const matchDate = !date || (() => {
      const activityDate = a.date ? new Date(a.date).toLocaleDateString('en-GB') : '';
      const [y, m, d] = date.split('-');
      return activityDate === `${d}/${m}/${y}`;
    })();
    return matchSearch && matchInstructor && matchDate;
  });

  // ── Edit handlers ────────────────────────────────────────────────────────
  const startEdit = (a) => {
    setEditId(a._id);
    setEditErrors({});
    setEditForm({
      ...a,
      activity: a.activity?._id || a.activity,
      date: a.date ? new Date(a.date).toISOString().split('T')[0] : '',
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
    setEditErrors({});
  };

  const saveEdit = async () => {
    if (!editId) return;

    // 1. Validate before sending
    const errors = validateEditForm(editForm);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      toast.error(Object.values(errors)[0]);
      return;
    }

    setSavingEdit(true);

    try {
      await api.activities.updateScheduled(editId, {
        activity: editForm.activity,
        date: editForm.date,
        time: editForm.time,
        place: editForm.place?.trim(),
        instructorName: (editForm.instructorName || editForm.instructor || '').trim(),
      });

      toast.success('Activity updated successfully!');

      // Refresh the list
      const res = await api.activities.getAllScheduled();
      setList(res.data?.data || res.data || []);
      setEditId(null);
      setEditErrors({});

    } catch (err) {
      console.error('ActivityList saveEdit error:', err);

      if (!err.response) {
        toast.error('Cannot connect to server. Please check your internet connection.');
        return;
      }

      const { status, data } = err.response;

      switch (status) {
        case 400:
          if (data.errors?.length) {
            data.errors.forEach(msg => toast.error(msg));
          } else {
            toast.error(data.message || 'Invalid data. Please check your inputs.');
          }
          break;

        case 404:
          toast.error('This activity no longer exists. Refreshing list...');
          setTimeout(fetchActivities, 1500);
          setEditId(null);
          break;

        case 409:
          toast.error(data.message || 'A scheduling conflict occurred.');
          break;

        case 403:
          toast.error('You do not have permission to edit activities.');
          break;

        case 500:
          toast.error('Server error. Please try again in a moment.');
          break;

        default:
          toast.error(data?.message || `Unexpected error (${status}). Please try again.`);
      }
    } finally {
      setSavingEdit(false);
    }
  };

  // ── Edit field change with inline error clearing ──────────────────────────
  const setEditField = (key, value) => {
    setEditForm(prev => ({ ...prev, [key]: value }));
    if (editErrors[key]) {
      setEditErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  // ── Reusable inline error under edit cells ───────────────────────────────
  const EditCellError = ({ name }) => editErrors[name] ? (
    <p className="text-xs text-red-500 mt-0.5">{editErrors[name]}</p>
  ) : null;

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center gap-3 text-gray-500">
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading activities...
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search Activity"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <input
          type="text"
          placeholder="Instructor Name"
          value={instructor}
          onChange={e => setInstructor(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        {/* Quick refresh button */}
        <button
          onClick={fetchActivities}
          title="Refresh list"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[620px]">
            <thead>
              <tr className="bg-[#000359] text-white text-left">
                {['Activity Name', 'Date', 'Time', 'Place', 'Instructor', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    {list.length === 0
                      ? 'No activities scheduled yet.'
                      : 'No activities match your search.'
                    }
                  </td>
                </tr>
              ) : (
                filtered.map((a, i) =>
                  editId === a._id ? (
                    /* ── Inline edit row ── */
                    <tr key={a._id} className="border-t border-gray-100 bg-blue-50/40">

                      {/* Activity name — not editable */}
                      <td className="px-3 py-2">
                        <input
                          value={a.activity?.name || a.name || ''}
                          disabled
                          className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </td>

                      {/* Date */}
                      <td className="px-3 py-2">
                        <div>
                          <input
                            type="date"
                            value={editForm.date || ''}
                            onChange={e => setEditField('date', e.target.value)}
                            className={`border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30
                              ${editErrors.date ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                          />
                          <EditCellError name="date" />
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-3 py-2">
                        <div>
                          <input
                            type="time"
                            value={editForm.time || ''}
                            onChange={e => setEditField('time', e.target.value)}
                            className={`border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30
                              ${editErrors.time ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                          />
                          <EditCellError name="time" />
                        </div>
                      </td>

                      {/* Place */}
                      <td className="px-3 py-2">
                        <div>
                          <input
                            value={editForm.place || ''}
                            onChange={e => setEditField('place', e.target.value)}
                            className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30
                              ${editErrors.place ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                          />
                          <EditCellError name="place" />
                        </div>
                      </td>

                      {/* Instructor */}
                      <td className="px-3 py-2">
                        <div>
                          <input
                            value={editForm.instructorName || editForm.instructor || ''}
                            onChange={e => setEditField('instructorName', e.target.value)}
                            className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30
                              ${editErrors.instructorName ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                          />
                          <EditCellError name="instructorName" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            disabled={savingEdit}
                            className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors disabled:opacity-60 flex items-center gap-1"
                          >
                            {savingEdit && (
                              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            )}
                            {savingEdit ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={savingEdit}
                            className="border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    /* ── Normal display row ── */
                    <tr
                      key={a._id}
                      className={`border-t border-gray-100 transition-colors hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                        {a.activity?.name || a.name || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {a.date ? new Date(a.date).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {a.time || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {a.place || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                        {a.instructorName || '—'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onView?.(a)}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => startEdit(a)}
                            className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}