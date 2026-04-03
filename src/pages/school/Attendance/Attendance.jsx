import { useState } from "react";
import { useNavigate } from "react-router-dom";

const attendanceData = [
  { id: 1, activity: "Yoga",           date: "20/01/2026", time: "07:00 AM", total: 65, present: 60, absent: 5  },
  { id: 2, activity: "Music",          date: "20/01/2026", time: "05:00 PM", total: 40, present: 35, absent: 5  },
  { id: 3, activity: "Art",            date: "21/01/2026", time: "04:00 PM", total: 30, present: 28, absent: 2  },
  { id: 4, activity: "Meditation",     date: "22/01/2026", time: "06:30 AM", total: 50, present: 47, absent: 3  },
  { id: 5, activity: "Group Exercise", date: "22/01/2026", time: "07:30 AM", total: 55, present: 52, absent: 3  },
];

const activities = ["All Activities", "Yoga", "Music", "Art", "Meditation", "Group Exercise"];

export default function Attendance() {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState("All Activities");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = attendanceData.filter((row) =>
    selectedActivity === "All Activities" || row.activity === selectedActivity
  );

  return (
    <div className="p-6 min-h-screen bg-white font-sans">
      {/* Page Title */}
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">Attendance</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[180px] cursor-pointer"
        >
          {activities.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[160px]"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[160px]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                Activity Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                Total Participants
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                Present
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                Absent
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{row.activity}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.total}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full px-3 py-0.5 text-xs font-semibold min-w-[32px]">
                      {row.present}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center justify-center bg-red-100 text-red-500 rounded-full px-3 py-0.5 text-xs font-semibold min-w-[32px]">
                      {row.absent}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => navigate(`/school/student-attendance/${row.id}`)}
                      className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-all duration-200 cursor-pointer"
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