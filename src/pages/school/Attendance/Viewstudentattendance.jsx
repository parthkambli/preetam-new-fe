import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../services/apiClient";

export default function ViewStudentAttendance() {
  const { periodId, activityId, date } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!periodId || !activityId || !date) return;
    setLoading(true);
    api.schoolAttendance.getStudents({ periodId, activityId, date })
      .then((res) => {
        setStudents(res.data?.students || []);
      })
      .catch(() => {
        setStudents([]);
      })
      .finally(() => setLoading(false));
  }, [periodId, activityId, date]);

  return (
    <div className="p-6 min-h-screen bg-white font-sans">
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">View Attendance</h2>
      <p className="text-sm text-gray-500 mb-4">Date: {date}</p>

      <div className="overflow-x-auto rounded-lg border border-gray-200 max-w-3xl">
        <table className="w-full min-w-[360px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-white w-3/4">Student Name</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-white w-1/4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-sm text-gray-400">Loading...</td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-sm text-gray-400">No attendance records found.</td>
              </tr>
            ) : (
              students.map((student, idx) => (
                <tr
                  key={student._id}
                  className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                >
                  <td className="px-5 py-3 text-sm text-gray-700 w-3/4">{student.fullName}</td>
                  <td className="px-5 py-3 text-right w-1/4">
                    {student.status === "Present" ? (
                      <span className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full px-4 py-1 text-xs font-semibold min-w-[72px]">
                        Present
                      </span>
                    ) : student.status === "Absent" ? (
                      <span className="inline-flex items-center justify-center bg-red-100 text-red-500 rounded-full px-4 py-1 text-xs font-semibold min-w-[72px]">
                        Absent
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-500 rounded-full px-4 py-1 text-xs font-semibold min-w-[72px]">
                        Not Marked
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
