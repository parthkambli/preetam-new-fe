import { useEffect, useState } from 'react';
import { api } from '../../services/apiClient';

const getIST = () => {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 5.5 * 60 * 60000);
};

const getISTDate = () => {
  const ist = getIST();
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const d = String(ist.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getISTDayName = () => {
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return names[getIST().getUTCDay()];
};

export default function SchoolStaffDashboard() {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = getISTDate();
    Promise.all([
      api.schoolStaffPanel.getProfile(),
      api.schoolStaffPanel.getAttendance({ date: today }),
      api.schoolStaffPanel.getMySchedule(),
      api.schoolStaffPanel.getEvents(),
    ])
      .then(([profileRes, attRes, schedRes, eventsRes]) => {
        setProfile(profileRes.data?.data || null);
        setAttendance(attRes.data?.attendance || []);
        setSchedules(schedRes.data?.schedules || []);
        setEvents(eventsRes.data?.data || []);
      })
      .catch((err) => {
        console.error('Dashboard load error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const todayDayName = getISTDayName();
  const todayClasses = attendance.length;
  const todayStudents = attendance.reduce((s, a) => s + (a.totalStudents || 0), 0);
  const presentToday = attendance.reduce((s, a) => s + (a.presentCount || 0), 0);
  const pendingToday = attendance.reduce(
    (s, a) => s + ((a.totalStudents || 0) - (a.presentCount || 0) - (a.absentCount || 0)),
    0
  );
  const todaySchedules = schedules.filter(s => s.day === todayDayName);

  if (loading) {
    return (
      <div className="p-6 text-gray-400 text-center py-12">Loading dashboard...</div>
    );
  }

  return (
    <div className="space-y-6 px-1 sm:px-0">
      {/* Profile */}
      {profile && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 flex items-center gap-4">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {profile.name?.charAt(0) || 'S'}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.role || 'Staff'}</p>
            {profile.mobile && (
              <p className="text-xs text-gray-400 mt-0.5">{profile.mobile}</p>
            )}
          </div>
          {profile.assignedActivities?.length > 0 && (
            <div className="ml-auto hidden sm:block">
              <p className="text-xs text-gray-400 mb-1">Activities</p>
              <div className="flex flex-wrap gap-1">
                {profile.assignedActivities.slice(0, 3).map((act) => (
                  <span key={act} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {act}
                  </span>
                ))}
                {profile.assignedActivities.length > 3 && (
                  <span className="text-xs text-gray-400">+{profile.assignedActivities.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Today's Classes", value: todayClasses, color: 'text-blue-600' },
          { label: "Today's Students", value: todayStudents, color: 'text-purple-600' },
          { label: 'Present Today', value: presentToday, color: 'text-green-600' },
          { label: 'Pending Today', value: pendingToday, color: 'text-amber-600' },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5"
          >
            <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">{card.label}</p>
            <p className={`text-3xl sm:text-4xl font-extrabold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Upcoming Classes */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Upcoming Classes</h3>
        {todaySchedules.length > 0 ? (
          <div className="space-y-2">
            {todaySchedules.map((s, i) => (
              <div
                key={`${s.periodId}_${s.activityId}_${i}`}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.activityName}</p>
                  <p className="text-xs text-gray-500">
                    {s.periodName} &mdash; {s.startTime?.slice(0, 5)} to {s.endTime?.slice(0, 5)}
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {s.day}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No upcoming classes</p>
        )}
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Upcoming Events</h3>
        {events.length > 0 ? (
          <div className="space-y-2">
            {events.slice(0, 5).map((ev) => (
              <div
                key={ev._id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{ev.title}</p>
                  <p className="text-xs text-gray-500">
                    {ev.date ? new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    {ev.startTime ? ` • ${ev.startTime?.slice(0, 5)}` : ''}
                    {ev.location ? ` • ${ev.location}` : ''}
                  </p>
                </div>
                {ev.type && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {ev.type}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No upcoming events</p>
        )}
      </div>
    </div>
  );
}
