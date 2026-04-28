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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [searchName, searchType, searchDate, limit]);

  // fetch data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const res = await api.fitnessEvents.getAll({
          title: searchName,
          type: searchType,
          date: searchDate,
          page,
          limit
        });

        const response = res.data;

        setEvents(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.count || 0);

      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Failed to load events";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchName, searchType, searchDate, page, limit]);

  const handleDelete = async (id) => {
    try {
      await api.fitnessEvents.delete(id);
      setPage(1);
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

  // pagination calculations
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  const handleFirst = () => setPage(1);
  const handleLast = () => setPage(totalPages);
  const handlePrev = () => page > 1 && setPage(p => p - 1);
  const handleNext = () => page < totalPages && setPage(p => p + 1);

  const handlePageInput = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= totalPages) {
      setPage(value);
    }
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
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
        />

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
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
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
        />
      </div>

      {/* TABLE SAME AS BEFORE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#1a2a5e] text-white">
                <th className="px-4 py-3 text-left">Event Title</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">No events found.</td>
                </tr>
              ) : (
                events.map((event, idx) => (
                  <tr key={event._id}>
                    <td className="px-4 py-3">{event.title}</td>
                    <td className="px-4 py-3">{event.type}</td>
                    <td className="px-4 py-3">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{event.startTime} – {event.endTime}</td>
                    <td className="px-4 py-3">{event.location}</td>
                    <td className="px-4 py-3">{event.description}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleEdit(event)}>Edit</button>
                      <button onClick={() => setDeleteConfirm(event._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


{/* 🔥 ADVANCED PAGINATION */}
<div className="flex flex-wrap items-center justify-between gap-4 mt-6 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">

  {/* LEFT — Items per page + count */}
  <div className="flex items-center gap-3 text-sm text-gray-500">
    <span className="font-medium text-gray-600">Rows per page</span>

    <select
      value={limit}
      onChange={(e) => {
        setLimit(Number(e.target.value));
        setPage(1);
      }}
      className="border border-[#1a2a5e]/30 px-2 py-1.5 rounded-lg bg-[#1a2a5e]/5 text-[#1a2a5e] text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]/30 focus:border-[#1a2a5e] transition"
    >
      {[10, 25, 50, 100].map(n => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>

    <span className="hidden sm:inline-block w-px h-4 bg-gray-200" />

    <span className="text-gray-400 text-xs">
      Showing{" "}
      <span className="font-semibold text-gray-700">{startItem}–{endItem}</span>
      {" "}of{" "}
      <span className="font-semibold text-gray-700">{totalCount}</span>
      {" "}results
    </span>
  </div>

  {/* RIGHT — Navigation controls */}
  <div className="flex items-center gap-1">

    {/* FIRST */}
    <button
      onClick={handleFirst}
      disabled={page === 1}
      title="First page"
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2a5e] text-white border border-[#1a2a5e] hover:bg-[#152147] hover:border-[#152147] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-xs font-bold shadow-sm"
    >
      «
    </button>

    {/* PREV */}
    <button
      onClick={handlePrev}
      disabled={page === 1}
      title="Previous page"
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2a5e] text-white border border-[#1a2a5e] hover:bg-[#152147] hover:border-[#152147] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-xs font-bold shadow-sm"
    >
      ‹
    </button>

    {/* PAGE BOX */}
    <div className="flex items-center gap-1.5 border border-[#1a2a5e]/20 bg-[#1a2a5e]/5 px-3 py-1.5 rounded-lg mx-1">
      <span className="text-xs text-[#1a2a5e]/60 font-medium">Page</span>
      <input
        type="number"
        value={page}
        onChange={handlePageInput}
        min={1}
        max={totalPages}
        className="w-10 text-center text-sm font-bold text-[#1a2a5e] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="text-xs text-[#1a2a5e]/40">/</span>
      <span className="text-xs font-semibold text-[#1a2a5e]/70">{totalPages}</span>
    </div>

    {/* NEXT */}
    <button
      onClick={handleNext}
      disabled={page === totalPages}
      title="Next page"
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2a5e] text-white border border-[#1a2a5e] hover:bg-[#152147] hover:border-[#152147] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-xs font-bold shadow-sm"
    >
      ›
    </button>

    {/* LAST */}
    <button
      onClick={handleLast}
      disabled={page === totalPages}
      title="Last page"
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2a5e] text-white border border-[#1a2a5e] hover:bg-[#152147] hover:border-[#152147] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-xs font-bold shadow-sm"
    >
      »
    </button>

  </div>
</div>
    </div>
  );
}










// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const EVENT_TYPES = ["All", "Competition", "Workshop", "Bootcamp", "Seminar", "Health Camp", "Members Meet", "Festival", "Other"];

// export default function Events() {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchName, setSearchName] = useState("");
//   const [searchType, setSearchType] = useState("");
//   const [searchDate, setSearchDate] = useState("");
//   const [deleteConfirm, setDeleteConfirm] = useState(null);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         const res = await api.fitnessEvents.getAll();
//         const data = res.data?.data || res.data || [];
//         setEvents(data);
//       } catch (err) {
//         console.error(err);
//         const msg = err.response?.data?.message || "Failed to load events";
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   const filtered = events.filter((e) => {
//     const nameMatch = e.title.toLowerCase().includes(searchName.toLowerCase());
//     const typeMatch = !searchType || searchType === "All" || e.type === searchType;
//     const dateMatch = !searchDate || new Date(e.date).toISOString().split('T')[0] === searchDate;
//     return nameMatch && typeMatch && dateMatch;
//   });

//   const handleDelete = async (id) => {
//     try {
//       await api.fitnessEvents.delete(id);
//       setEvents(prev => prev.filter(e => e._id !== id));
//       setDeleteConfirm(null);
//       toast.success("Event deleted successfully");
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to delete event";
//       toast.error(msg);
//     }
//   };

//   const handleEdit = (event) => {
//     navigate("/fitness/Addevent", { state: { event } });
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-gray-500">Loading events...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Events</h1>
//         <button
//           onClick={() => navigate("/fitness/Addevent")}
//           className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2 rounded-lg transition-colors duration-200 text-sm shadow-md"
//         >
//           Add Event
//         </button>
//       </div>

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
//   type="date"
//   value={searchDate}
//   onChange={(e) => {
//     const value = e.target.value;
//     const year = value.split("-")[0];

//     if (year.length > 4) return; // block invalid year
//     setSearchDate(value);
//   }}
//   min={new Date().toISOString().split('T')[0]}
//   max="9999-12-31"
//   className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
// />
//       </div>

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
//                   <tr key={event._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                     <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">{event.title}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{event.type}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                       {new Date(event.date).toLocaleDateString('en-GB')}
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                       {event.startTime} – {event.endTime}
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{event.location}</td>
//                     <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{event.description}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEdit(event)}
//                           className="border border-[#1a2a5e] text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-150"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => setDeleteConfirm(event._id)}
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