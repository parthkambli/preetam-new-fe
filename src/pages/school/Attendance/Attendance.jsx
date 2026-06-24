import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/apiClient";

export default function Attendance() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  useEffect(() => {
    api.schoolAttendance.getActivities().then((res) => {
      const list = res.data?.data || [];
      setActivities(list);
    }).catch(() => {});
  }, []);

  const fetchAttendance = useCallback(async (date) => {
    setLoading(true);
    try {
      const params = { date };
      if (selectedActivity) params.activityId = selectedActivity;
      const res = await api.schoolAttendance.getSummary(params);
      setRecords(res.data?.attendance || []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [selectedActivity]);

  useEffect(() => {
    fetchAttendance(today);
  }, [fetchAttendance, today]);

  const handleFilter = () => {
    const date = fromDate || toDate || today;
    fetchAttendance(date);
  };

  const filtered = records.filter((row) => {
    if (selectedActivity && row.activityId !== selectedActivity) return false;
    if (fromDate && row.date < fromDate) return false;
    if (toDate && row.date > toDate) return false;
    return true;
  });

  return (
    <div className="p-6 min-h-screen bg-white font-sans">
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">Attendance</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[180px] cursor-pointer"
        >
          <option value="">All Activities</option>
          {activities.map((a) => (
            <option key={a._id} value={a._id}>{a.name}</option>
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

        <button
          onClick={handleFilter}
          className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-sm font-semibold px-4 py-2 rounded-md transition-all duration-200 cursor-pointer"
        >
          Filter
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">Activity Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">Total Participants</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">Present</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">Absent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No attendance records found.</td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr
                  key={`${row.periodId}-${row.activityId}-${row.date}`}
                  className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{row.activityName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.startTime} - {row.endTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.totalStudents}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full px-3 py-0.5 text-xs font-semibold min-w-[32px]">
                      {row.presentCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center justify-center bg-red-100 text-red-500 rounded-full px-3 py-0.5 text-xs font-semibold min-w-[32px]">
                      {row.absentCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => navigate(`/school/student-attendance/${row.periodId}/${row.activityId}/${row.date}`)}
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
