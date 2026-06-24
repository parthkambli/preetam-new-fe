import { useEffect, useState } from 'react';
import { api } from '../../services/apiClient';

const COLORS = [
  { border: 'border-purple-300', bg: 'bg-purple-50', accent: 'border-purple-500' },
  { border: 'border-yellow-300', bg: 'bg-yellow-50', accent: 'border-yellow-500' },
  { border: 'border-pink-300', bg: 'bg-pink-50', accent: 'border-pink-500' },
  { border: 'border-violet-300', bg: 'bg-violet-50', accent: 'border-violet-500' },
  { border: 'border-green-300', bg: 'bg-green-50', accent: 'border-green-500' },
  { border: 'border-cyan-300', bg: 'bg-cyan-50', accent: 'border-cyan-500' },
  { border: 'border-blue-300', bg: 'bg-blue-50', accent: 'border-blue-500' },
  { border: 'border-orange-300', bg: 'bg-orange-50', accent: 'border-orange-500' },
];

const toINR = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function SchoolDashboard() {
  const [data, setData] = useState({
    totalParticipants: 0,
    totalStaff: 0,
    upcomingEvents: 0,
    totalCheckinsToday: 0,
    mostActiveProgram: { name: 'N/A', count: 0 },
    todayTotalEnquiries: 0,
    participantsPresentToday: 0,
    totalActiveParticipants: 0,
    staffPresentToday: 0,
    totalStaffCount: 0,
    totalFeeAmount: 0,
    totalFeeCollected: 0,
    todaysActivityAttendance: [],
    todaysScheduleActives: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.schoolDashboard.getData();
        const d = res?.data || {};
        setData({
          totalParticipants: d.totalParticipants || 0,
          totalStaff: d.totalStaff || 0,
          upcomingEvents: d.upcomingEvents || 0,
          totalCheckinsToday: d.totalCheckinsToday || 0,
          mostActiveProgram: d.mostActiveProgram || { name: 'N/A', count: 0 },
          todayTotalEnquiries: d.todayTotalEnquiries || 0,
          participantsPresentToday: d.participantsPresentToday || 0,
          totalActiveParticipants: d.totalActiveParticipants || 0,
          staffPresentToday: d.staffPresentToday || 0,
          totalStaffCount: d.totalStaffCount || 0,
          totalFeeAmount: d.totalFeeAmount || 0,
          totalFeeCollected: d.totalFeeCollected || 0,
          todaysActivityAttendance: Array.isArray(d.todaysActivityAttendance)
            ? d.todaysActivityAttendance
            : [],
          todaysScheduleActives: Array.isArray(d.todaysScheduleActives)
            ? d.todaysScheduleActives
            : [],
        });
      } catch (err) {
        console.log('Dashboard API Error:', err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const presentPct =
    data.totalActiveParticipants > 0
      ? Math.round((data.participantsPresentToday / data.totalActiveParticipants) * 100)
      : 0;

  const staffPct =
    data.totalStaffCount > 0
      ? Math.round((data.staffPresentToday / data.totalStaffCount) * 100)
      : 0;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-4 sm:space-y-5">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Row 1: 3 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          { value: data.totalParticipants, label: 'Total Participants' },
          { value: data.totalStaff, label: 'Total Staff' },
          { value: data.upcomingEvents, label: 'Upcoming Events' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-200 px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 sm:gap-4"
          >
            <span className="text-2xl sm:text-3xl font-bold text-gray-800">
              {s.value}
            </span>
            <span className="text-sm sm:text-base text-gray-600 font-medium leading-tight">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Col 1 */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Participants Present Today */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm font-semibold text-green-600 mb-2 sm:mb-3">
              Participants Present Today
            </p>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <>
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 sm:mb-3">
                  {presentPct}%
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mb-2 sm:mb-3">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${presentPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {data.participantsPresentToday} of {data.totalActiveParticipants} participants
                  attended at least one activity
                </p>
              </>
            )}
          </div>

          {/* Total Check-ins Today */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-2">
              Total Activity Check-ins
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-1">
              {data.totalCheckinsToday}
            </p>
            <p className="text-xs text-gray-500">
              Multiple activities counted separately
            </p>
          </div>
        </div>

        {/* Col 2 */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Staff Attendance */}
          {/* <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm font-semibold text-green-600 mb-2 sm:mb-3">
              Staff Attendance
            </p>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <>
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 sm:mb-3">
                  {data.staffPresentToday} / {data.totalStaffCount}
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mb-2 sm:mb-3">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${staffPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Staff present in assigned activities
                </p>
              </>
            )}
          </div> */}

          {/* Most Active Program */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-2">
              Most Active Program
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-1">
              {data.mostActiveProgram?.name || 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
              {data.mostActiveProgram?.count || 0} participants attended today
            </p>
          </div>
        </div>

        {/* Col 3 */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Fee Management */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Fee Management
            </p>
            <div className="space-y-2">
              <div className="bg-blue-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {toINR(data.totalFeeAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Total Fee</p>
              </div>
              <div className="bg-green-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {toINR(data.totalFeeCollected)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Collected</p>
              </div>
            </div>
          </div>

          {/* Today Total Enquiries */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
              Today Total Enquiries
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              {data.todayTotalEnquiries}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Schedule Activities */}
      {/* <div>
        <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3">
          Today's Schedule Actives
        </h2>
        {data.todaysScheduleActives.length > 0 ? (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
            {data.todaysScheduleActives.map((item, index) => (
              <div
                key={item._id || index}
                className={`flex-shrink-0 border-2 ${COLORS[index % COLORS.length].border} ${COLORS[index % COLORS.length].bg} rounded-xl px-3 sm:px-5 py-2 sm:py-3 text-center min-w-[100px] sm:min-w-[110px]`}
              >
                <p className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  {item.activity?.activityName ||
                    item.activity?.name ||
                    item.activityName ||
                    item.name ||
                    'Activity'}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  {item.startTime || item.time || '-'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No schedules for today</p>
        )}
      </div> */}

      {/* Today's Activities Attendance */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3">
          Today's Actives Attendance
        </h2>
        {data.todaysActivityAttendance.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {data.todaysActivityAttendance.map((a, index) => {
              const color = COLORS[index % COLORS.length];
              const pct = a.total > 0 ? Math.round((a.present / a.total) * 100) : 0;
              return (
                <div
                  key={a.activityId || index}
                  className={`bg-white rounded-xl border border-gray-200 border-l-4 ${color.accent} px-4 sm:px-5 py-3 sm:py-4`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {a.activityName}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 rounded-lg px-3 sm:px-4 py-1 sm:py-1.5 font-medium">
                      {a.present} / {a.total} Present
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No attendance records for today</p>
        )}
      </div>
    </div>
  );
}
