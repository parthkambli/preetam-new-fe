import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../services/apiClient";

function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm border border-gray-200 ${className}`}
      {...props}
    />
  );
}

function CardHeader({ className = "", ...props }) {
  return (
    <div className={`px-5 sm:px-6 pt-5 sm:pt-6 pb-4 ${className}`} {...props} />
  );
}

function CardTitle({ className = "", ...props }) {
  return <h3 className={`text-xl sm:text-xl font-bold ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={`px-5 sm:px-6 pb-5 sm:pb-6 ${className}`} {...props} />;
}

const getISTNow = () => {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 5.5 * 60 * 60000);
};

const getISTDateParts = () => {
  const d = getISTNow();
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    date: d.getUTCDate(),
    day: d.getUTCDay(),
  };
};

const getISTWeekDates = () => {
  const { year, month, date, day } = getISTDateParts();
  const todayUTC = Date.UTC(year, month, date);
  const todayIST = new Date(todayUTC);
  const dayOfWeek = day;

  const monday = new Date(todayIST);
  monday.setUTCDate(todayIST.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days = [];

  for (let i = 0; i < 6; i++) {
    const d = new Date(monday);
    d.setUTCDate(monday.getUTCDate() + i);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');

    days.push({
      dayName: dayNames[i],
      dayAbbr: dayNames[i].slice(0, 3).toUpperCase(),
      dateNum: d.getUTCDate(),
      fullDate: `${y}-${m}-${dd}`,
      isToday:
        d.getUTCDate() === todayIST.getUTCDate() &&
        d.getUTCMonth() === todayIST.getUTCMonth() &&
        d.getUTCFullYear() === todayIST.getUTCFullYear(),
    });
  }

  return days;
};

const getDefaultDay = () => {
  const { day } = getISTDateParts();
  const names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return day === 0 ? 'monday' : names[day];
};

export default function SchoolStaffMySchedule() {
  const weekDays = useMemo(() => getISTWeekDates(), []);
  const [selectedDay, setSelectedDay] = useState(getDefaultDay);

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotStudents, setSlotStudents] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [studentCache, setStudentCache] = useState({});

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await api.schoolStaffPanel.getMySchedule();
      setSchedules(res.data?.schedules || []);
    } catch (err) {
      console.error('Failed to fetch schedule', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => s.day?.toLowerCase() === selectedDay);
  }, [schedules, selectedDay]);

  const handleCardClick = async (schedule) => {
    const cacheKey = `${selectedDay}_${schedule.activityId}_${schedule.periodId}`;

    setSelectedSlot({
      activityName: schedule.activityName,
      periodName: schedule.periodName,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      studentCount: schedule.studentCount,
    });

    if (studentCache[cacheKey]) {
      setSlotStudents(studentCache[cacheKey]);
      return;
    }

    try {
      setSlotLoading(true);
      const res = await api.schoolStaffPanel.getScheduleStudents({
        day: selectedDay,
        activityId: schedule.activityId,
        periodId: schedule.periodId,
      });
      const students = (res.data?.students || []).sort((a, b) =>
        (a.fullName || '').localeCompare(b.fullName || '')
      );
      setSlotStudents(students);
      setStudentCache(prev => ({ ...prev, [cacheKey]: students }));
    } catch (err) {
      console.error('Failed to fetch students', err);
      setSlotStudents([]);
    } finally {
      setSlotLoading(false);
    }
  };

  const dayNames = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
  };

  return (
    <div className="space-y-6 px-1 sm:px-0">
      <h2 className="text-[32px] sm:text-2xl font-bold text-[#000033]">
        My Schedule
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {weekDays.map((d) => (
          <button
            key={d.fullDate}
            onClick={() => { setSelectedDay(d.dayName.toLowerCase()); setSelectedSlot(null); }}
            className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px] h-[78px] sm:h-20 rounded-2xl transition-all shrink-0 ${
              selectedDay === d.dayName.toLowerCase()
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <span className="text-[10px] font-bold mb-1">{d.dayAbbr}</span>
            <span className="text-[28px] sm:text-xl font-bold leading-none">
              {d.dateNum}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            Loading schedule...
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No activities scheduled for {dayNames[selectedDay] || selectedDay}
          </div>
        ) : (
          filteredSchedules.map((s, i) => (
            <Card
              key={`${s.periodId}_${s.activityId}_${i}`}
              className="bg-white p-5 sm:p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick(s)}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-[28px] sm:text-xl font-bold text-gray-900">
                  {s.activityName}
                </h3>
                <p className="text-[16px] sm:text-sm text-blue-600 font-medium">
                  {s.periodName} &mdash; {s.startTime?.slice(0, 5)} to {s.endTime?.slice(0, 5)}
                </p>
                <p className="text-[20px] sm:text-lg font-semibold text-gray-800 mt-2">
                  {s.studentCount} Student{s.studentCount !== 1 ? 's' : ''}
                </p>
              </div>
            </Card>
          ))
        )}

        {selectedSlot && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedSlot(null)}
          >
            <Card
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="flex items-center justify-between border-b">
                <CardTitle className="text-[24px] sm:text-xl">
                  {selectedSlot.activityName}
                </CardTitle>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold flex items-center justify-center"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-sm text-gray-600 mb-4">
                  {selectedSlot.periodName} &mdash; {selectedSlot.startTime?.slice(0, 5)} to {selectedSlot.endTime?.slice(0, 5)}
                </p>
                <p className="text-sm font-semibold text-gray-800 mb-4">
                  {selectedSlot.studentCount} Student{selectedSlot.studentCount !== 1 ? 's' : ''}
                </p>

                {slotLoading ? (
                  <p className="text-gray-400 text-sm">Loading students...</p>
                ) : slotStudents.length === 0 ? (
                  <p className="text-gray-400 text-sm">No students enrolled</p>
                ) : (
                  <div className="space-y-3">
                    {slotStudents.map((student) => (
                      <div key={student._id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{student.fullName}</p>
                          <p className="text-xs text-gray-500">{student.admissionId}</p>
                        </div>
                        <span className="text-xs text-gray-400">{student.mobile}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
