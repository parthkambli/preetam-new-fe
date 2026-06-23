import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "../../services/apiClient";
import QRScanner from "../../components/QRScanner";

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

const getDefaultDate = () => {
  const { year, month, date } = getISTDateParts();
  const y = year;
  const m = String(month + 1).padStart(2, '0');
  const d = String(date).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function SchoolStaffAttendance() {
  const weekDays = useMemo(() => getISTWeekDates(), []);
  const [selectedDay, setSelectedDay] = useState(getDefaultDay);
  const [selectedDate, setSelectedDate] = useState(getDefaultDate);

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotStudents, setSlotStudents] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [studentCache, setStudentCache] = useState({});

  const [showScanner, setShowScanner] = useState(false);
  const [scannedAdmissionId, setScannedAdmissionId] = useState(null);
  const [scanPeriods, setScanPeriods] = useState([]);
  const [scanPeriodsLoading, setScanPeriodsLoading] = useState(false);
  const [scanMarking, setScanMarking] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  useEffect(() => {
    const dayMap = {
      monday: weekDays[0],
      tuesday: weekDays[1],
      wednesday: weekDays[2],
      thursday: weekDays[3],
      friday: weekDays[4],
      saturday: weekDays[5],
    };
    const dayObj = dayMap[selectedDay];
    if (dayObj) {
      setSelectedDate(dayObj.fullDate);
    }
  }, [selectedDay]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.schoolStaffPanel.getAttendance({ date: selectedDate });
      setAttendance(res.data?.attendance || []);
    } catch (err) {
      console.error('Failed to fetch attendance', err);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (slot) => {
    const cacheKey = `${selectedDate}_${slot.periodId}_${slot.activityId}`;

    setSelectedSlot(slot);

    if (studentCache[cacheKey]) {
      setSlotStudents(studentCache[cacheKey]);
      return;
    }

    try {
      setSlotLoading(true);
      const res = await api.schoolStaffPanel.getAttendanceStudents({
        date: selectedDate,
        periodId: slot.periodId,
        activityId: slot.activityId,
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

  const handleScan = async (decodedText) => {
    let admissionId;
    try {
      const parsed = JSON.parse(decodedText);
      admissionId = parsed.admissionId;
    } catch {
      admissionId = decodedText.trim();
    }
    if (!admissionId) return;

    try {
      setScanPeriodsLoading(true);
      const res = await api.schoolStaffPanel.getStudentPeriods({
        admissionId,
        date: selectedDate,
      });
      const periods = res.data?.periods || [];

      if (periods.length === 0) {
        toast.error('No active periods found for this student today');
        setShowScanner(false);
        return;
      }

      setScannedAdmissionId(admissionId);
      setScanPeriods(periods);

      if (periods.length === 1) {
        await handleScanMark(admissionId, periods[0].periodId, periods[0].activityId);
      }
    } catch (err) {
      console.error('Failed to fetch student periods', err);
      toast.error('Student not found or inactive');
      setShowScanner(false);
    } finally {
      setScanPeriodsLoading(false);
    }
  };

  const handleScanMark = async (admissionId, periodId, activityId) => {
    try {
      setScanMarking(true);
      const res = await api.schoolStaffPanel.scanMark({
        admissionId,
        periodId,
        activityId,
        date: selectedDate,
      });
      const data = res.data;
      if (data.alreadyMarked) {
        toast.info(`${data.student?.fullName || 'Student'} already marked ${data.status || 'today'}`);
      } else {
        toast.success(`${data.student?.fullName || 'Student'} marked Present`);
      }
      setShowScanner(false);
      setScannedAdmissionId(null);
      setScanPeriods([]);
      setStudentCache({});
      fetchAttendance();
    } catch (err) {
      console.error('Failed to mark attendance', err);
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setScanMarking(false);
    }
  };

  const dayNames = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
  };

  return (
    <div className="space-y-6 px-1 sm:px-0">
      <div className="flex items-center justify-between">
        <h2 className="text-[32px] sm:text-2xl font-bold text-[#000033]">
          Attendance
        </h2>
        <button
          onClick={() => setShowScanner(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
        >
          Scan QR
        </button>
      </div>

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
            {d.isToday && (
              <span className="text-[8px] font-bold mt-0.5">TODAY</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            Loading attendance...
          </div>
        ) : attendance.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No activities scheduled for {dayNames[selectedDay] || selectedDay}
          </div>
        ) : (
          attendance.map((s, i) => (
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
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-[20px] sm:text-lg font-semibold text-gray-800">
                    Total: {s.totalStudents}
                  </span>
                  <span className="text-[20px] sm:text-lg font-semibold text-green-600">
                    P: {s.presentCount}
                  </span>
                  <span className="text-[20px] sm:text-lg font-semibold text-red-500">
                    A: {s.absentCount}
                  </span>
                </div>
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
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-sm text-gray-600 mb-4">
                  {selectedSlot.periodName} &mdash; {selectedSlot.startTime?.slice(0, 5)} to {selectedSlot.endTime?.slice(0, 5)}
                </p>
                <p className="text-sm font-semibold text-gray-800 mb-4">
                  Total: {selectedSlot.totalStudents} &middot; Present: {selectedSlot.presentCount} &middot; Absent: {selectedSlot.absentCount}
                </p>

                {slotLoading ? (
                  <p className="text-gray-400 text-sm">Loading students...</p>
                ) : slotStudents.length === 0 ? (
                  <p className="text-gray-400 text-sm">No students enrolled</p>
                ) : (
                  <div className="space-y-3">
                    {slotStudents.map((student) => (
                      <div key={student._id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.fullName}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                              {student.fullName?.split(' ').map(n => n?.[0]).join('').slice(0, 2) || '?'}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-800">{student.fullName}</p>
                            <p className="text-xs text-gray-500">{student.admissionId}</p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${
                            student.status === 'Present'
                              ? 'bg-green-100 text-green-700'
                              : student.status === 'Absent'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {student.status || 'Not Marked'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {showScanner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setShowScanner(false);
            setScannedAdmissionId(null);
            setScanPeriods([]);
          }}
        >
          <Card
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex items-center justify-between border-b">
              <CardTitle className="text-lg">Scan Student QR</CardTitle>
              <button
                onClick={() => {
                  setShowScanner(false);
                  setScannedAdmissionId(null);
                  setScanPeriods([]);
                }}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="pt-5">
              {scannedAdmissionId && scanPeriods.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    Select period to mark Present:
                  </p>
                  <div className="space-y-3">
                    {scanPeriods.map((p, i) => (
                      <button
                        key={`${p.periodId}_${p.activityId}_${i}`}
                        onClick={() => handleScanMark(scannedAdmissionId, p.periodId, p.activityId)}
                        disabled={scanMarking}
                        className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <p className="text-sm font-bold text-gray-800">{p.periodName}</p>
                        <p className="text-xs text-gray-500">{p.activityName} &mdash; {p.startTime?.slice(0, 5)} to {p.endTime?.slice(0, 5)}</p>
                      </button>
                    ))}
                  </div>
                  {scanMarking && (
                    <p className="text-sm text-blue-600 mt-3">Marking attendance...</p>
                  )}
                </div>
              ) : scanPeriodsLoading ? (
                <p className="text-gray-400 text-sm text-center py-8">Fetching student periods...</p>
              ) : (
                <QRScanner onScan={handleScan} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
