// import { useParams } from "react-router-dom";

// // Mock data keyed by activity id
// const studentAttendanceData = {
//   1: [
//     { id: 1, name: "Ramesh Patil",    status: "Present" },
//     { id: 2, name: "Suman Desai",     status: "Present" },
//     { id: 3, name: "Mahesh Kulkarni", status: "Absent"  },
//     { id: 4, name: "Anita Joshi",     status: "Present" },
//     { id: 5, name: "Prakash Pawar",   status: "Absent"  },
//     { id: 6, name: "Sunita Shinde",   status: "Present" },
//   ],
//   2: [
//     { id: 1, name: "Kavita More",     status: "Present" },
//     { id: 2, name: "Vijay Kulkarni",  status: "Absent"  },
//     { id: 3, name: "Priya Shah",      status: "Present" },
//     { id: 4, name: "Rajan Mehta",     status: "Present" },
//     { id: 5, name: "Nalini Patil",    status: "Absent"  },
//   ],
//   3: [
//     { id: 1, name: "Suresh Joshi",    status: "Present" },
//     { id: 2, name: "Meena Desai",     status: "Present" },
//     { id: 3, name: "Ganesh Pawar",    status: "Absent"  },
//     { id: 4, name: "Lata Shinde",     status: "Present" },
//   ],
//   4: [
//     { id: 1, name: "Ramesh Patil",    status: "Present" },
//     { id: 2, name: "Anita Joshi",     status: "Present" },
//     { id: 3, name: "Suman Desai",     status: "Present" },
//     { id: 4, name: "Mahesh Kulkarni", status: "Absent"  },
//     { id: 5, name: "Sunita Shinde",   status: "Present" },
//     { id: 6, name: "Prakash Pawar",   status: "Absent"  },
//     { id: 7, name: "Vijay Kulkarni",  status: "Present" },
//   ],
//   5: [
//     { id: 1, name: "Kavita More",     status: "Present" },
//     { id: 2, name: "Suresh Joshi",    status: "Present" },
//     { id: 3, name: "Lata Shinde",     status: "Present" },
//     { id: 4, name: "Rajan Mehta",     status: "Absent"  },
//     { id: 5, name: "Nalini Patil",    status: "Present" },
//     { id: 6, name: "Ganesh Pawar",    status: "Absent"  },
//   ],
// };

// export default function ViewStudentAttendance() {
//   const { id } = useParams();
//   const students = studentAttendanceData[id] || [];

//   return (
//     <div className="p-6 min-h-screen bg-white font-sans">
//       {/* Page Title */}
//       <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">View Attendance</h2>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 max-w-3xl">
//         <table className="w-full min-w-[360px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               <th className="px-5 py-3 text-left text-xs font-semibold text-white w-3/4">
//                 Student Name
//               </th>
//               <th className="px-5 py-3 text-right text-xs font-semibold text-white w-1/4">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length === 0 ? (
//               <tr>
//                 <td colSpan={2} className="px-5 py-8 text-center text-sm text-gray-400">
//                   No attendance records found.
//                 </td>
//               </tr>
//             ) : (
//               students.map((student, idx) => (
//                 <tr
//                   key={student.id}
//                   className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
//                     idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
//                   }`}
//                 >
//                   <td className="px-5 py-3 text-sm text-gray-700 w-3/4">
//                     {student.name}
//                   </td>
//                   <td className="px-5 py-3 text-right w-1/4">
//                     {student.status === "Present" ? (
//                       <span className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full px-4 py-1 text-xs font-semibold min-w-[72px]">
//                         Present
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center justify-center bg-red-100 text-red-500 rounded-full px-4 py-1 text-xs font-semibold min-w-[72px]">
//                         Absent
//                       </span>
//                     )}
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
// import { useParams } from "react-router-dom";
// import {api} from "../../../services/apiClient";

// export default function ViewStudentAttendance() {
//   const { activityId, date } = useParams();   // Now using activityId and date
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activityName, setActivityName] = useState("");

//   useEffect(() => {
//     const fetchStudentAttendance = async () => {
//       if (!activityId || !date) return;
      
//       setLoading(true);
//       try {
//         const response = await api.attendance.getStudentAttendance(activityId, date);
//         setStudents(response.data || []);
        
//         // Optional: You can set activity name if returned
//         if (response.data?.length > 0) {
//           setActivityName(response.data[0].activity?.name || "Activity");
//         }
//       } catch (error) {
//         console.error("Failed to fetch student attendance:", error);
//         setStudents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentAttendance();
//   }, [activityId, date]);

//   return (
//     <div className="p-6 min-h-screen bg-white font-sans">
//       {/* Page Title */}
//       <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">
//         View Attendance {activityName && `- ${activityName}`}
//       </h2>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 max-w-3xl">
//         <table className="w-full min-w-[360px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               <th className="px-5 py-3 text-left text-xs font-semibold text-white w-3/4">
//                 Student Name
//               </th>
//               <th className="px-5 py-3 text-right text-xs font-semibold text-white w-1/4">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={2} className="px-5 py-8 text-center text-sm text-gray-400">
//                   Loading attendance...
//                 </td>
//               </tr>
//             ) : students.length === 0 ? (
//               <tr>
//                 <td colSpan={2} className="px-5 py-8 text-center text-sm text-gray-400">
//                   No attendance records found.
//                 </td>
//               </tr>
//             ) : (
//               students.map((student, idx) => (
//                 <tr
//                   key={student._id || idx}
//                   className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
//                     idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
//                   }`}
//                 >
//                   <td className="px-5 py-3 text-sm text-gray-700 w-3/4">
//                     {student.member?.name || "Unknown"}
//                   </td>
//                   <td className="px-5 py-3 text-right w-1/4">
//                     {student.status === "Present" ? (
//                       <span className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full px-4 py-1 text-xs font-semibold min-w-[72px]">
//                         Present
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center justify-center bg-red-100 text-red-500 rounded-full px-4 py-1 text-xs font-semibold min-w-[72px]">
//                         Absent
//                       </span>
//                     )}
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
import { useParams } from "react-router-dom";
import { api } from "../../../services/apiClient";

export default function ViewStudentAttendance() {
  const { activityid } = useParams();   // Matches your route :activityid
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityName, setActivityName] = useState("");

  useEffect(() => {
    const fetchStudentAttendance = async () => {
      if (!activityid) return;

      setLoading(true);
      try {
        // Using today's date by default
        const today = new Date().toISOString().split('T')[0];

        const response = await api.attendance.getStudentAttendance(activityid, today);
        
        setStudents(response.data || []);
        
        if (response.data?.length > 0 && response.data[0].activity) {
          setActivityName(response.data[0].activity.name || "Activity");
        }
      } catch (error) {
        console.error("Failed to fetch student attendance:", error.response?.data || error.message);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAttendance();
  }, [activityid]);

  return (
    <div className="p-6 min-h-screen bg-white font-sans">
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">
        View Attendance {activityName && `- ${activityName}`}
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 max-w-3xl">
        <table className="w-full min-w-[360px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-white w-3/4">
                Student Name
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-white w-1/4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2} className="px-5 py-8 text-center">Loading attendance...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={2} className="px-5 py-8 text-center text-gray-400">No records found for today</td></tr>
            ) : (
              students.map((student, idx) => (
                <tr key={student._id || idx} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <td className="px-5 py-3 text-sm text-gray-700 w-3/4">
                    {student.member?.name || "Unknown Student"}
                  </td>
                  <td className="px-5 py-3 text-right w-1/4">
                    {student.status === "Present" ? (
                      <span className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full px-4 py-1 text-xs font-semibold min-w-[72px]">
                        Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center bg-red-100 text-red-500 rounded-full px-4 py-1 text-xs font-semibold min-w-[72px]">
                        Absent
                      </span>
                    )}
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