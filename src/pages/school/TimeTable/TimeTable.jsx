import { useState, useEffect } from "react";
import { Pencil, Trash2, X, Printer } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DayCell = ({ booked, capacity }) => {
  const pct = capacity > 0 ? (booked / capacity) * 100 : 0;
  let color;
  if (pct >= 100) color = 'bg-red-100 text-red-700';
  else if (pct >= 80) color = 'bg-yellow-100 text-yellow-700';
  else color = 'bg-green-100 text-green-700';
  return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{booked}/{capacity}</span>;
};

const toTimeInputValue = (timeStr) => {
  if (!timeStr) return "";
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return timeStr;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3]?.toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

export default function TimeTable() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    capacity: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [studentListLoading, setStudentListLoading] = useState(false);
  const [activities, setActivities] = useState([]);

  const [occPeriodId, setOccPeriodId] = useState("");
  const [activeView, setActiveView] = useState("periods");

  useEffect(() => {
    fetchPeriods();
  }, []);

  useEffect(() => {
    api.activities.getAll().then((res) => {
      const list = res.data?.data || res.data || [];
      setActivities(list);
    }).catch(() => {});
  }, []);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const res = await api.periods.getAll();
      const data = res.data?.data || res.data || [];
      setPeriods(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load periods");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.capacity
    ) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        capacity: Number(formData.capacity),
      };

      if (editingId) {
        await api.periods.update(editingId, payload);
        toast.success("Period updated successfully");
      } else {
        await api.periods.create(payload);
        toast.success("Period created successfully");
      }

      setFormData({ name: "", startTime: "", endTime: "", capacity: "" });
      setEditingId(null);
      await fetchPeriods();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save period");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (period) => {
    setEditingId(period._id);

    setFormData({
      name: period.name,
      startTime: toTimeInputValue(period.startTime),
      endTime: toTimeInputValue(period.endTime),
      capacity: period.capacity,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this period?")) return;
    try {
      await api.periods.delete(id);
      setPeriods((prev) => prev.filter((p) => p._id !== id));
      toast.success("Period deleted successfully");
      if (editingId === id) {
        setEditingId(null);
        setFormData({ name: "", startTime: "", endTime: "", capacity: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete period");
    }
  };

  const handleShowStudents = async () => {
    if (!selectedPeriod || !selectedActivity) {
      toast.error("Please select both Period and Activity");
      return;
    }
    setStudentListLoading(true);
    try {
      const params = { periodId: selectedPeriod, activityId: selectedActivity };
      if (selectedDay) params.day = selectedDay;
      const res = await api.periodStudents.getStudents(params);
      setStudentList(res.data?.students || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load students");
      setStudentList([]);
    } finally {
      setStudentListLoading(false);
    }
  };

  const handlePrintStudentList = () => {
    window.print();
  };

  const handleOpenStudentModal = () => {
    setSelectedPeriod("");
    setSelectedActivity("");
    setSelectedDay("");
    setStudentList([]);
    setShowStudentModal(true);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">
            Timetable Management
          </h1>
          <button
            onClick={handleOpenStudentModal}
            className="bg-[#000359] hover:opacity-90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            View Students
          </button>
        </div>

        <div className="border-b mt-4 mb-10" />

        {/* Create Periods */}

        <h2 className="text-2xl font-medium mb-6">
          Create Periods
        </h2>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <label className="block text-lg mb-2">
              Period Name
            </label>

            <input
              type="text"
              placeholder="e.g. Period 1"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-4"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">
              Start Time
            </label>

            <input
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startTime: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-4"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">
              End Time
            </label>

            <input
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endTime: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-4"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">
              Capacity
            </label>

            <input
              type="number"
              placeholder="e.g. 30"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-4"
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-[#000359] text-white px-12 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Period" : "Add Period"}
          </button>
        </div>

        {/* View toggle tabs */}
        <div className="flex mt-12 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveView("periods")}
            className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${activeView === "periods" ? "text-[#000359] border-b-2 border-[#000359]" : "text-gray-500 hover:text-gray-700"}`}
          >
            Existing Periods
          </button>
          <button
            onClick={() => setActiveView("breakdown")}
            className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${activeView === "breakdown" ? "text-[#000359] border-b-2 border-[#000359]" : "text-gray-500 hover:text-gray-700"}`}
          >
            Capacity Breakdown
          </button>
        </div>

        {activeView === "periods" && (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="bg-[#000359] text-white">
                <th className="px-6 py-4 text-left">
                  Period Name
                </th>
                <th className="px-6 py-4 text-left">
                  Start Time
                </th>
                <th className="px-6 py-4 text-left">
                  End Time
                </th>
                <th className="px-6 py-4 text-center">
                  Capacity
                </th>
                {/* {DAY_LABELS.map(d => (
                  <th key={d} className="px-3 py-4 text-center text-xs">{d}</th>
                ))} */}
                <th className="px-6 py-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5 + DAY_LABELS.length} className="text-center py-12 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : periods.length === 0 ? (
                <tr>
                  <td colSpan={5 + DAY_LABELS.length} className="text-center py-8 text-gray-500">
                    No periods found
                  </td>
                </tr>
              ) : (
                periods.map((period) => (
                  <tr
                    key={period._id}
                    className="border-b"
                  >
                    <td className="px-6 py-5">
                      {period.name}
                    </td>

                    <td className="px-6 py-5">
                      {period.startTime}
                    </td>

                    <td className="px-6 py-5">
                      {period.endTime}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {period.capacity}
                    </td>

                    {/* {DAYS.map(day => (
                      <td key={day} className="px-3 py-5 text-center">
                        <DayCell
                          booked={period.dayCounts?.[day] || 0}
                          capacity={period.capacity}
                        />
                      </td>
                    ))} */}

                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            handleEdit(period)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(period._id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}

        {activeView === "breakdown" && (
          <>
            <div className="max-w-xs mb-6">
              <select
                value={occPeriodId}
                onChange={(e) => setOccPeriodId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
              >
                <option value="">Select a period to view occupancy</option>
                {periods.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} ({p.startTime} - {p.endTime})</option>
                ))}
              </select>
            </div>
            {occPeriodId && (() => {
              const period = periods.find(p => p._id === occPeriodId);
              if (!period || !period.activityDayCounts) {
                return <p className="text-gray-500 text-sm">No occupancy data available.</p>;
              }
              const entries = Object.entries(period.activityDayCounts);
              const activityIds = [...new Set(entries.map(([k]) => k.split('_')[0]))];
              const activityNames = {};
              activities.forEach(a => { activityNames[a._id] = a.name; });
              const dayTotals = {};
              DAYS.forEach(d => { dayTotals[d] = 0; });
              const actRows = activityIds.map(aid => {
                const row = {};
                DAYS.forEach(day => {
                  const key = `${aid}_${day}`;
                  row[day] = period.activityDayCounts[key] || 0;
                  dayTotals[day] += row[day];
                });
                return { activityId: aid, activityName: activityNames[aid] || aid.slice(0, 8), days: row };
              });
              actRows.sort((a, b) => a.activityName.localeCompare(b.activityName));
              return (
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#000359] text-white">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Activity</th>
                        {DAY_LABELS.map(d => (
                          <th key={d} className="px-3 py-3 text-center text-xs font-semibold">{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {actRows.map((act, idx) => (
                        <tr key={act.activityId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{act.activityName}</td>
                          {DAYS.map(day => {
                            const booked = act.days[day];
                            const cap = period.capacity;
                            const full = cap > 0 && booked >= cap;
                            return (
                              <td key={day} className="px-3 py-3 text-center">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${full ? 'bg-red-100 text-red-700' : booked > 0 ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}>
                                  {booked > 0 ? `${booked}/${cap}` : '—'}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      {actRows.length > 0 && (
                        <tr className="border-t-2 border-gray-300 bg-gray-100 font-semibold">
                          <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                          {DAYS.map(day => {
                            const booked = dayTotals[day];
                            const cap = period.capacity;
                            const full = cap > 0 && booked >= cap;
                            return (
                              <td key={day} className="px-3 py-3 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${full ? 'bg-red-200 text-red-800' : booked > 0 ? 'bg-green-200 text-green-800' : 'text-gray-500'}`}>
                                  {booked > 0 ? `${booked}/${cap}` : '—'}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* ── View Students Modal ── */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowStudentModal(false)}>
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (hidden on print) */}
            <div className="no-print flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Students by Period & Activity</h2>
              <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Dropdowns (hidden on print) */}
            <div className="no-print px-6 py-4 border-b shrink-0">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                  >
                    <option value="">Select Period</option>
                    {periods.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                  >
                    <option value="">Select Activity</option>
                    {activities.map((a) => (
                      <option key={a._id} value={a._id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                  >
                    <option value="">All Days</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
                <button
                  onClick={handleShowStudents}
                  disabled={studentListLoading}
                  className="bg-[#000359] hover:opacity-90 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer"
                >
                  {studentListLoading ? "Loading..." : "Show Students"}
                </button>
              </div>
            </div>

            {/* Print heading */}
            <div className="print-only hidden p-6 pb-0">
              <h2 className="text-xl font-bold">
                Students — {periods.find(p => p._id === selectedPeriod)?.name || ''} / {activities.find(a => a._id === selectedActivity)?.name || ''}{selectedDay ? ` (${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)})` : ''}
              </h2>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {studentListLoading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : studentList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No students found for this period and activity.</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#000359] text-white">
                      <th className="px-4 py-3 text-left text-xs font-semibold">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">Admission ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">Student Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentList.map((s, idx) => (
                      <tr key={s._id} className="border-b border-gray-100 hover:bg-blue-50/30">
                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.admissionId}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.fullName}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {s.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer (hidden on print) */}
            <div className="no-print flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0">
              <button
                onClick={handlePrintStudentList}
                disabled={studentList.length === 0}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
              >
                <Printer size={16} /> Print
              </button>
              <button
                onClick={() => setShowStudentModal(false)}
                className="bg-[#000359] hover:opacity-90 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body * { visibility: hidden; }
          .fixed.inset-0.z-50, .fixed.inset-0.z-50 * { visibility: visible; }
          .fixed.inset-0.z-50 { position: absolute !important; left: 0; top: 0; background: white !important; }
          .fixed.inset-0.z-50 > div { box-shadow: none !important; max-width: 100% !important; max-height: none !important; margin: 0 !important; border-radius: 0 !important; }
          .fixed.inset-0.z-50 > div > div:nth-child(4) { overflow: visible !important; }
          @page { size: landscape; margin: 15mm; }
        }
      `}</style>
    </div>
  );
}