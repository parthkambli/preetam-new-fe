// pages/school/Activities/ActivityList.jsx
import { useState } from 'react';

const dummyActivities = [
  { _id: '1', name: 'Yoga',  date: '20/01/2026', time: '07:00 AM', place: 'Main Hall',   instructor: 'Mr. Sharma' },
  { _id: '2', name: 'Music', date: '21/01/2026', time: '05:00 PM', place: 'Music Room',  instructor: 'Mr. Joshi'  },
  { _id: '3', name: 'Art',   date: '22/01/2026', time: '04:00 PM', place: 'Art Room',    instructor: 'Ms. Kavita' },
];

export default function ActivityList({ activities = dummyActivities, onView, onEdit }) {
  const [search,     setSearch]     = useState('');
  const [date,       setDate]       = useState('');
  const [instructor, setInstructor] = useState('');

  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});
  const [list,     setList]     = useState(activities);
  const [saved,    setSaved]    = useState(false);

  // Filter
  const filtered = list.filter(a => {
    const matchSearch     = !search     || a.name.toLowerCase().includes(search.toLowerCase());
    const matchInstructor = !instructor || a.instructor.toLowerCase().includes(instructor.toLowerCase());
    const matchDate       = !date       || (() => {
      const [y, m, d] = date.split('-');
      return a.date === `${d}/${m}/${y}`;
    })();
    return matchSearch && matchInstructor && matchDate;
  });

  const startEdit = (a) => {
    setEditId(a._id);
    setEditForm({ ...a });
  };

  const cancelEdit = () => { setEditId(null); setEditForm({}); };

  const saveEdit = () => {
    setList(prev => prev.map(a => a._id === editId ? { ...editForm } : a));
    setEditId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">

      {saved && (
        <div className="px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Activity updated successfully.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search Activity"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48
                     focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto
                     focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <input
          type="text"
          placeholder="Instructor Name"
          value={instructor}
          onChange={e => setInstructor(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48
                     focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
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
                  <td colSpan={6} className="text-center py-10 text-gray-400">No activities found.</td>
                </tr>
              ) : filtered.map((a, i) => (
                editId === a._id ? (
                  /* ── Inline edit row ── */
                  <tr key={a._id} className="border-t border-gray-100 bg-blue-50/40">
                    <td className="px-3 py-2">
                      <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="date"
                        value={editForm.date ? (() => { const [d,m,y] = editForm.date.split('/'); return `${y}-${m}-${d}`; })() : ''}
                        onChange={e => {
                          const [y,m,d] = e.target.value.split('-');
                          setEditForm(p => ({ ...p, date: `${d}/${m}/${y}` }));
                        }}
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="time"
                        value={editForm.time ? (() => {
                          const [t, ampm] = editForm.time.split(' ');
                          let [h, min] = t.split(':');
                          if (ampm === 'PM' && h !== '12') h = String(parseInt(h) + 12);
                          if (ampm === 'AM' && h === '12') h = '00';
                          return `${h.padStart(2,'0')}:${min}`;
                        })() : ''}
                        onChange={e => {
                          const [h, min] = e.target.value.split(':');
                          const hr = parseInt(h);
                          const ampm = hr >= 12 ? 'PM' : 'AM';
                          const h12 = hr % 12 || 12;
                          setEditForm(p => ({ ...p, time: `${String(h12).padStart(2,'0')}:${min} ${ampm}` }));
                        }}
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
                    </td>
                    <td className="px-3 py-2">
                      <input value={editForm.place} onChange={e => setEditForm(p => ({ ...p, place: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
                    </td>
                    <td className="px-3 py-2">
                      <input value={editForm.instructor} onChange={e => setEditForm(p => ({ ...p, instructor: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359]/30" />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button onClick={saveEdit}
                          className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors">
                          Save
                        </button>
                        <button onClick={cancelEdit}
                          className="border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded transition-colors">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* ── Normal row ── */
                  <tr key={a._id}
                    className={`border-t border-gray-100 transition-colors hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                    <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">{a.name}</td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.date}</td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.time}</td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.place}</td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{a.instructor}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}