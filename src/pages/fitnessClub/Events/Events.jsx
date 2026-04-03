// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const initialEvents = [
//   {
//     id: 1,
//     title: "Birthday – Savitaben Patel",
//     type: "Birthday",
//     date: "2025-10-10",
//     time: "10:00 – 11:30",
//     location: "Community Hall",
//     description: "Birthday celebration with cake, music & group activity.",
//   },
//   {
//     id: 2,
//     title: "Community Lunch",
//     type: "Lunch",
//     date: "2025-10-18",
//     time: "12:30 – 14:00",
//     location: "Dining Hall",
//     description: "Monthly community lunch for social bonding.",
//   },
//   {
//     id: 3,
//     title: "Health Check-up Camp",
//     type: "Health Camp",
//     date: "2025-11-02",
//     time: "09:00 – 13:00",
//     location: "Medical Room",
//     description: "BP, Sugar, ECG checkup by visiting doctors.",
//   },
// ];

// const EVENT_TYPES = ["All", "Birthday", "Lunch", "Health Camp", "Cultural", "Sports", "Other"];

// export default function Events() {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState(initialEvents);
//   const [searchName, setSearchName] = useState("");
//   const [searchType, setSearchType] = useState("");
//   const [searchDate, setSearchDate] = useState("");
//   const [deleteConfirm, setDeleteConfirm] = useState(null);

//   const filtered = events.filter((e) => {
//     const nameMatch = e.title.toLowerCase().includes(searchName.toLowerCase());
//     const typeMatch = !searchType || searchType === "All" || e.type === searchType;
//     const dateMatch = !searchDate || e.date === searchDate;
//     return nameMatch && typeMatch && dateMatch;
//   });

//   const handleDelete = (id) => {
//     setEvents((prev) => prev.filter((e) => e.id !== id));
//     setDeleteConfirm(null);
//   };

//   const handleEdit = (event) => {
//     navigate("/fitness/Addevent", { state: { event } });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Events</h1>
//         <button
//           onClick={() => navigate("/fitness/Addevent")}
//           className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2 rounded-lg transition-colors duration-200 text-sm shadow-md"
//         >
//           Add Event
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-5">
//         <input
//           type="text"
//           placeholder="Search By Event Name"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//           className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//         />
//         <select
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value)}
//           className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//         >
//           <option value="">Search By Type</option>
//           {EVENT_TYPES.filter((t) => t !== "All").map((t) => (
//             <option key={t} value={t}>{t}</option>
//           ))}
//         </select>
//         <input
//           type="date"
//           value={searchDate}
//           onChange={(e) => setSearchDate(e.target.value)}
//           className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//         />
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-[#1a2a5e] text-white">
//                 <th className="px-4 py-3 text-left font-semibold">Event Title</th>
//                 <th className="px-4 py-3 text-left font-semibold">Type</th>
//                 <th className="px-4 py-3 text-left font-semibold">Date</th>
//                 <th className="px-4 py-3 text-left font-semibold">Time</th>
//                 <th className="px-4 py-3 text-left font-semibold">Location</th>
//                 <th className="px-4 py-3 text-left font-semibold">Description</th>
//                 <th className="px-4 py-3 text-left font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
//                     No events found.
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((event, idx) => (
//                   <tr
//                     key={event.id}
//                     className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                   >
//                     <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
//                       {event.title}
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{event.type}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{event.date}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{event.time}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{event.location}</td>
//                     <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
//                       {event.description}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEdit(event)}
//                           className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-150"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => setDeleteConfirm(event.id)}
//                           className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-150"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Delete Confirm Modal */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-xl p-6 w-80 max-w-full mx-4">
//             <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Event</h3>
//             <p className="text-sm text-gray-600 mb-5">
//               Are you sure you want to delete this event? This action cannot be undone.
//             </p>
//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(deleteConfirm)}
//                 className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }










import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const EVENT_TYPES = ["All", "Competition", "Workshop", "Bootcamp", "Seminar", "Health Camp", "Members Meet", "Festival", "Other"];

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.fitnessEvents.getAll();
        const data = res.data?.data || res.data || [];
        setEvents(data);
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Failed to load events";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filtered = events.filter((e) => {
    const nameMatch = e.title.toLowerCase().includes(searchName.toLowerCase());
    const typeMatch = !searchType || searchType === "All" || e.type === searchType;
    const dateMatch = !searchDate || new Date(e.date).toISOString().split('T')[0] === searchDate;
    return nameMatch && typeMatch && dateMatch;
  });

  const handleDelete = async (id) => {
    try {
      await api.fitnessEvents.delete(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      setDeleteConfirm(null);
      toast.success("Event deleted successfully");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete event";
      toast.error(msg);
    }
  };

  const handleEdit = (event) => {
    navigate("/fitness/Addevent", { state: { event } });
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading events...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Events</h1>
        <button
          onClick={() => navigate("/fitness/Addevent")}
          className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2 rounded-lg transition-colors duration-200 text-sm shadow-md"
        >
          Add Event
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search By Event Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
        >
          <option value="">Search By Type</option>
          {EVENT_TYPES.filter((t) => t !== "All").map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#1a2a5e] text-white">
                <th className="px-4 py-3 text-left font-semibold">Event Title</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Time</th>
                <th className="px-4 py-3 text-left font-semibold">Location</th>
                <th className="px-4 py-3 text-left font-semibold">Description</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    No events found.
                  </td>
                </tr>
              ) : (
                filtered.map((event, idx) => (
                  <tr key={event._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">{event.title}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{event.type}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(event.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {event.startTime} – {event.endTime}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{event.location}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{event.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-150"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(event._id)}
                          className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 max-w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Event</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}