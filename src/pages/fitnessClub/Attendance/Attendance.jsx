// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const attendanceData = [
//   { id: 1, activity: "Yoga",           date: "20/01/2026", time: "07:00 AM", total: 65, present: 60, absent: 5  },
//   { id: 2, activity: "Music",          date: "20/01/2026", time: "05:00 PM", total: 40, present: 35, absent: 5  },
//   { id: 3, activity: "Art",            date: "21/01/2026", time: "04:00 PM", total: 30, present: 28, absent: 2  },
//   { id: 4, activity: "Meditation",     date: "22/01/2026", time: "06:30 AM", total: 50, present: 47, absent: 3  },
//   { id: 5, activity: "Group Exercise", date: "22/01/2026", time: "07:30 AM", total: 55, present: 52, absent: 3  },
// ];

// const activities = ["All Activities", "Yoga", "Music", "Art", "Meditation", "Group Exercise"];

// export default function Attendance() {
//   const navigate = useNavigate();
//   const [selectedActivity, setSelectedActivity] = useState("All Activities");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const filtered = attendanceData.filter((row) =>
//     selectedActivity === "All Activities" || row.activity === selectedActivity
//   );

//   return (
//     <div className="p-6 min-h-screen bg-white font-sans">
//       {/* Page Title */}
//       <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">Attendance</h2>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         <select
//           value={selectedActivity}
//           onChange={(e) => setSelectedActivity(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[180px] cursor-pointer"
//         >
//           {activities.map((a) => (
//             <option key={a} value={a}>{a}</option>
//           ))}
//         </select>

//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[160px]"
//         />

//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[160px]"
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[700px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                 Activity Name
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                 Date
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                 Time
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                 Total Participants
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                 Present
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                 Absent
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
//                   No attendance records found.
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((row, idx) => (
//                 <tr
//                   key={row.id}
//                   className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
//                     idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
//                   }`}
//                 >
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.activity}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.date}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.time}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.total}</td>
//                   <td className="px-4 py-3 text-sm">
//                     <span className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full px-3 py-0.5 text-xs font-semibold min-w-[32px]">
//                       {row.present}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <span className="inline-flex items-center justify-center bg-red-100 text-red-500 rounded-full px-3 py-0.5 text-xs font-semibold min-w-[32px]">
//                       {row.absent}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <button
//                       onClick={() => navigate(`/fitness/student-attendance/${row.id}`)}
//                       className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-all duration-200 cursor-pointer"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }







// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {api} from "../../../services/apiClient";   // ← Make sure this path is correct

// export default function Attendance() {
//   const navigate = useNavigate();
//   const [selectedActivity, setSelectedActivity] = useState("All Activities");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const activities = ["All Activities", "Yoga", "Music", "Art", "Meditation", "Group Exercise"];

//   // Fetch attendance summary
//   const fetchAttendance = async () => {
//     console.log("🔄 Fetching attendance summary...");   // ← Debug log
//     setLoading(true);
    
//     try {
//       const params = {};
//       if (fromDate) params.fromDate = fromDate;
//       if (toDate) params.toDate = toDate;

//       console.log("📡 Calling API with params:", params);

//       const response = await api.attendance.getSummary(params);
      
//       console.log("✅ API Response:", response.data);   // ← Very important log
      
//       setAttendanceData(response.data || []);
//     } catch (error) {
//       console.error("❌ Failed to fetch attendance:", error.response?.data || error.message);
//       setAttendanceData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, [fromDate, toDate]);   // Re-fetch when dates change

//   const filtered = attendanceData.filter((row) =>
//     selectedActivity === "All Activities" || row.activity === selectedActivity
//   );

//   return (
//     <div className="p-6 min-h-screen bg-white font-sans">
//       <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">Attendance</h2>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         <select
//           value={selectedActivity}
//           onChange={(e) => setSelectedActivity(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[180px] cursor-pointer"
//         >
//           {activities.map((a) => (
//             <option key={a} value={a}>{a}</option>
//           ))}
//         </select>

//         <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[700px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Activity Name</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Date</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Time</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Total Participants</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Present</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Absent</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={7} className="px-4 py-8 text-center">Loading attendance records...</td></tr>
//             ) : filtered.length === 0 ? (
//               <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No attendance records found.</td></tr>
//             ) : (
//               filtered.map((row, idx) => (
//                 <tr key={row._id || idx} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
//                   <td className="px-4 py-3">{row.activity}</td>
//                   <td className="px-4 py-3">{new Date(row.date).toLocaleDateString('en-IN')}</td>
//                   <td className="px-4 py-3">{row.time || "-"}</td>
//                   <td className="px-4 py-3">{row.total}</td>
//                   <td className="px-4 py-3">
//                     <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs">{row.present}</span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className="bg-red-100 text-red-500 px-3 py-0.5 rounded-full text-xs">{row.absent}</span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => navigate(`/fitness/student-attendance/${row.activityId}/${row.date}`)}
//                       className="bg-[#1e3a8a] text-white px-4 py-1.5 rounded-md text-xs"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }







// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../../services/apiClient";   // ← Use curly braces

// export default function Attendance() {
//   const navigate = useNavigate();
//   const [selectedActivity, setSelectedActivity] = useState("All Activities");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const activities = ["All Activities", "Yoga", "Music", "Art", "Meditation", "Group Exercise"];

//   const fetchAttendance = async () => {
//     setLoading(true);
//     try {
//       const params = {};
//       if (fromDate) params.fromDate = fromDate;
//       if (toDate) params.toDate = toDate;

//       const response = await api.attendance.getSummary(params);
//       setAttendanceData(response.data || []);
//     } catch (error) {
//       console.error("Failed to fetch attendance:", error.response?.data || error.message);
//       setAttendanceData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, [fromDate, toDate]);

//   const filtered = attendanceData.filter((row) =>
//     selectedActivity === "All Activities" || row.activity === selectedActivity
//   );

//   return (
//     <div className="p-6 min-h-screen bg-white font-sans">
//       <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">Attendance</h2>

//       {/* Filters - unchanged */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         <select value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)} className="...">
//           {activities.map((a) => <option key={a} value={a}>{a}</option>)}
//         </select>

//         <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[700px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Activity Name</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Date</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Time</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Total Participants</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Present</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Absent</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={7} className="px-4 py-8 text-center">Loading...</td></tr>
//             ) : filtered.length === 0 ? (
//               <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No records found</td></tr>
//             ) : (
//               filtered.map((row, idx) => (
//                 <tr key={row._id || idx} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
//                   <td className="px-4 py-3">{row.activity}</td>
//                   <td className="px-4 py-3">{new Date(row.date).toLocaleDateString('en-IN')}</td>
//                   <td className="px-4 py-3">{row.time || "-"}</td>
//                   <td className="px-4 py-3">{row.total}</td>
//                   <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs">{row.present}</span></td>
//                   <td className="px-4 py-3"><span className="bg-red-100 text-red-500 px-3 py-0.5 rounded-full text-xs">{row.absent}</span></td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => navigate(`/fitness/attendance/${row.activityId}`)}   // ← Changed as per your route
//                       className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-xs font-semibold px-4 py-1.5 rounded-md"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }












// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../../services/apiClient";

// export default function Attendance() {
//   const navigate = useNavigate();
//   const [selectedActivity, setSelectedActivity] = useState("All Activities");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [activities, setActivities] = useState(["All Activities"]);

//   const fetchAttendance = async () => {
//     setLoading(true);
//     try {
//       const params = {};
//       if (fromDate) params.fromDate = fromDate;
//       if (toDate) params.toDate = toDate;

//       const response = await api.attendance.getSummary(params);
//       setAttendanceData(response.data || []);
//     } catch (error) {
//       console.error("Failed to fetch attendance:", error.response?.data || error.message);
//       setAttendanceData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Activities for Dropdown using fitnessActivities.getAll
//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         setActivityLoading(true);
//         const response = await api.fitnessActivities.getAll();
//         const data = response?.data?.data || response?.data || [];
//         setActivities(data);
//       } catch (error) {
//         console.error("Failed to fetch activities:", error);
//         setActivities([]);
//       } finally {
//         setActivityLoading(false);
//       }
//     };

//     fetchActivities();
//   }, []);

//   useEffect(() => {
//   const fetchActivities = async () => {
//     try {
//       const res = await api.fitnessActivities.getAll();

//       const activityNames = res.data?.data?.map((a) => a.name) || [];

//       setActivities(["All Activities", ...activityNames]);
//     } catch (err) {
//       console.error("Failed to fetch activities", err);
//     }
//   };  

//   fetchActivities();
// }, []);

//   return (
//     <div className="p-6 min-h-screen bg-white font-sans">
//       <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">Attendance</h2>

//       {/* Filters - unchanged except dropdown */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         <select 
//           value={selectedActivity} 
//           onChange={(e) => setSelectedActivity(e.target.value)} 
//           className="..."
//           disabled={activityLoading}
//         >
//           <option value="All Activities">All Activities</option>
          
//           {activityLoading ? (
//             <option disabled>Loading activities...</option>
//           ) : (
//             activities.map((act) => {
//               const activityName = act.title || act.activityName || act.name || "Unknown";
//               return (
//                 <option 
//                   key={act._id || act.id || activityName} 
//                   value={activityName}
//                 >
//                   {activityName}
//                 </option>
//               );
//             })
//           )}
//         </select>

//         <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//       </div>

//       {/* Table - completely unchanged */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[700px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Activity Name</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Date</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Time</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Total Participants</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Present</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Absent</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-white">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={7} className="px-4 py-8 text-center">Loading...</td></tr>
//             ) : filtered.length === 0 ? (
//               <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No records found</td></tr>
//             ) : (
//               filtered.map((row, idx) => (
//                 <tr key={row._id || idx} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
//                   <td className="px-4 py-3">{row.activity}</td>
//                   <td className="px-4 py-3">{new Date(row.date).toLocaleDateString('en-IN')}</td>
//                   <td className="px-4 py-3">{row.time || "-"}</td>
//                   <td className="px-4 py-3">{row.total}</td>
//                   <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs">{row.present}</span></td>
//                   <td className="px-4 py-3"><span className="bg-red-100 text-red-500 px-3 py-0.5 rounded-full text-xs">{row.absent}</span></td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => navigate(`/fitness/attendance/${row.activityId}`)}
//                       className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-xs font-semibold px-4 py-1.5 rounded-md"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }














import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/apiClient";

export default function Attendance() {
  const navigate = useNavigate();

  const [selectedActivity, setSelectedActivity] = useState("All Activities");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ← MISSING STATE - This was causing the error
  const [activityLoading, setActivityLoading] = useState(false);

  const [activities, setActivities] = useState(["All Activities"]);

  // Fetch Activities for Dropdown
  useEffect(() => {
    const fetchActivities = async () => {
      setActivityLoading(true);
      try {
        const res = await api.fitnessActivities.getAll();
        
        // Adjust according to your actual API response structure
        const activityList = res.data?.data || res.data || [];
        
        const activityNames = activityList.map((a) => a.name || a.title || a.activityName || "Unknown");
        
        setActivities(["All Activities", ...activityNames]);
      } catch (err) {
        console.error("Failed to fetch activities", err);
        setActivities(["All Activities"]);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Fetch Attendance Data
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {};
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response = await api.attendance.getSummary(params);
      // setAttendanceData(response.data || []);
      setAttendanceData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch attendance:", error.response?.data || error.message);
       setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // You probably want to call fetchAttendance when filters change
  useEffect(() => {
    fetchAttendance();
  }, [fromDate, toDate]);   // Add selectedActivity if you want to filter on frontend

  // Filter logic (you were using `filtered` but never defined it)
  const filtered = attendanceData.filter((row) => {
    if (selectedActivity === "All Activities") return true;
    return (
      row.activity === selectedActivity ||
      row.activityName === selectedActivity ||
      row.name === selectedActivity
    );
  });

  return (
    <div className="p-6 min-h-screen bg-white font-sans">
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">Attendance</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select 
          value={selectedActivity} 
          onChange={(e) => setSelectedActivity(e.target.value)} 
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          disabled={activityLoading}
        >
          {activityLoading ? (
            <option disabled>Loading activities...</option>
          ) : (
            activities.map((act, index) => (
              <option key={index} value={act}>
                {act}
              </option>
            ))
          )}
        </select>

        <input 
          type="date" 
          value={fromDate} 
          onChange={(e) => setFromDate(e.target.value)} 
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input 
          type="date" 
          value={toDate} 
          onChange={(e) => setToDate(e.target.value)} 
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-white">Activity Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white">Total Participants</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white">Present</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white">Absent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">Loading attendance data...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr 
                  key={row._id || idx} 
                  className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                >
                  <td className="px-4 py-3">{row.activity || row.activityName || "N/A"}</td>
                  <td className="px-4 py-3">{new Date(row.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">{row.time || "-"}</td>
                  <td className="px-4 py-3">{row.total || 0}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs">
                      {row.present || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-red-100 text-red-500 px-3 py-0.5 rounded-full text-xs">
                      {row.absent || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/fitness/attendance/${row.activityId || row._id}`)}
                      className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}