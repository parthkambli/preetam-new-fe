
import { useState } from "react";

const attendanceRecords = [
  { date: "17/01/2026", inTime: "09:02 AM", outTime: "06:11 PM", workingHours: "9h 09m", status: "Present" },
  { date: "16/01/2026", inTime: "09:10 AM", outTime: "06:05 PM", workingHours: "8h 55m", status: "Present" },
  { date: "15/01/2026", inTime: "—",        outTime: "—",        workingHours: "0h",     status: "Absent"  },
  { date: "14/01/2026", inTime: "09:00 AM", outTime: "05:58 PM", workingHours: "8h 58m", status: "Present" },
  { date: "13/01/2026", inTime: "09:15 AM", outTime: "06:00 PM", workingHours: "8h 45m", status: "Present" },
  { date: "12/01/2026", inTime: "—",        outTime: "—",        workingHours: "0h",     status: "Absent"  },
  { date: "11/01/2026", inTime: "09:05 AM", outTime: "06:10 PM", workingHours: "9h 05m", status: "Present" },
];

export default function ViewAttendance({
  staffName = "Ravi Sharma",
  month     = "January",
  year      = "2026",
  records   = attendanceRecords,
}) {
  const [searchName, setSearchName] = useState("");
  const [date,       setDate]       = useState("");
  const [status,     setStatus]     = useState("");

  const filtered = records.filter((r) => {
    const matchDate   = !date   || r.date === new Date(date).toLocaleDateString("en-GB").replace(/\//g, "/");
    const matchStatus = !status || r.status === status;
    return matchDate && matchStatus;
  });

  // Summary counts
  const presentCount = records.filter(r => r.status === "Present").length;
  const absentCount  = records.filter(r => r.status === "Absent").length;

  return (
    <div className="space-y-5">

      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search Staff Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-52
                     focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto
                     focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44
                     focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        >
          <option value="">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm min-w-[130px]">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Present</p>
            <p className="text-lg font-bold text-gray-800 leading-tight">{presentCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm min-w-[130px]">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Absent</p>
            <p className="text-lg font-bold text-gray-800 leading-tight">{absentCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm min-w-[130px]">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Days</p>
            <p className="text-lg font-bold text-gray-800 leading-tight">{records.length}</p>
          </div>
        </div>
      </div>

      {/* Section heading */}
      <h3 className="text-base font-semibold text-gray-800">
        {staffName} – {month} {year} Attendance
      </h3>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-[#000359] text-white text-left">
                {["Date", "In Time", "Out Time", "Working Hours", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">No records found.</td>
                </tr>
              ) : filtered.map((row, i) => (
                <tr
                  key={i}
                  className={`border-t border-gray-100 transition-colors hover:bg-blue-50
                    ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}
                >
                  <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">{row.date}</td>
                  <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">{row.inTime}</td>
                  <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">{row.outTime}</td>
                  <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">{row.workingHours}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      row.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}