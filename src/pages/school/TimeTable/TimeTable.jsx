import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";

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

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const res = await api.timetable.getAll();
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
        await api.timetable.update(editingId, payload);
        toast.success("Period updated successfully");
      } else {
        await api.timetable.create(payload);
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
      await api.timetable.delete(id);
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

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">
          Timetable Management
        </h1>

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

        {/* Existing Periods */}

        <h2 className="text-2xl font-medium mt-12 mb-6">
          Existing Periods
        </h2>

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
                <th className="px-6 py-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : periods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
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
      </div>
    </div>
  );
}