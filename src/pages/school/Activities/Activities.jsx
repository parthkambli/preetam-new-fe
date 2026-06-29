import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";

export default function Activities() {
  const [activityName, setActivityName] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffOptions, setStaffOptions] = useState([]);

  useEffect(() => {
    fetchActivities();
    fetchAllStaff();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.activities.getAll();
      const data = res.data?.data || res.data || [];
      setActivities(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStaff = async () => {
    try {
      const res = await api.fitnessStaff.getAll({});
      const staff = res.data?.data?.staff || res.data?.data || res.data || [];
      setStaffOptions(
        staff.map((s) => ({
          value: s._id,
          label: `${s.fullName} (${s.role || "Staff"})`,
          fullName: s.fullName,
        }))
      );
    } catch {
      // silent
    }
  };

  // Populate form when editing
  const handleEditClick = (a) => {
    setEditData(a);
    setActivityName(a.name || "");
    const staff = a.staffId;
    const staffName = a.staffName;
    setSelectedStaff(
      staff
        ? {
            value: typeof staff === "object" ? staff._id : staff,
            label:
              typeof staff === "object"
                ? `${staff.fullName} (${staff.role || "Staff"})`
                : "",
            fullName: typeof staff === "object" ? staff.fullName : "",
          }
        : staffName
          ? { value: "", label: staffName, fullName: staffName }
          : null
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Form submit ──────────────────────────────────────────────
  const handleSave = async () => {
    setError("");
    if (!activityName.trim()) return setError("Activity name is required");
    if (!selectedStaff) return setError("Instructor is required");

    setSaving(true);
    try {
      const payload = {
        name: activityName.trim(),
        staffName: selectedStaff.fullName,
      };

      if (editData) {
        await api.activities.update(editData._id, payload);
        toast.success("Activity updated successfully");
      } else {
        await api.activities.create(payload);
        toast.success("Activity created successfully");
      }

      resetForm();
      await fetchActivities();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save activity");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditData(null);
    setActivityName("");
    setSelectedStaff(null);
    setError("");
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await api.activities.delete(id);
      setActivities((prev) => prev.filter((a) => a._id !== id));
      toast.success("Activity deleted successfully");
      if (editData?._id === id) resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete activity");
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-8">

      {/* ── FORM SECTION ── */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          {editData ? "Edit Activity" : "Add Activity"}
        </h1>

        <div className="border-b mt-4 mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Activity Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Activity Name
            </label>
            <input
              type="text"
              placeholder="e.g. Yoga, Zumba"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#000359] focus:ring-1 focus:ring-[#000359]/20"
            />
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Instructor
            </label>
            <Select
              options={staffOptions}
              placeholder="Search Instructor"
              value={selectedStaff}
              onChange={setSelectedStaff}
              isClearable
              classNamePrefix="react-select"
              className="text-sm"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-3 mt-8">
          {editData && (
            <button
              onClick={resetForm}
              className="px-8 py-3 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-12 py-3 rounded-lg bg-[#000359] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : editData ? "Update Activity" : "Add Activity"}
          </button>
        </div>
      </div>

      {/* ── TABLE SECTION ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Existing Activities</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#000359] text-white">
                <th className="px-6 py-4 text-left font-medium">Activity</th>
                <th className="px-6 py-4 text-left font-medium">Instructor</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">
                    No activities found. Add one above.
                  </td>
                </tr>
              ) : (
                activities.map((a) => (
                  <tr
                    key={a._id}
                    className={`hover:bg-gray-50 transition ${editData?._id === a._id ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{a.name}</td>

                    <td className="px-6 py-4 text-gray-600">
                      {a.staffName
                        ? a.staffName
                        : typeof a.staffId === "object" && a.staffId
                          ? `${a.staffId.fullName} (${a.staffId.role || "Staff"})`
                          : <span className="text-gray-300">—</span>}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(a)}
                          className="px-3 py-1.5 text-xs rounded-md bg-[#000359] text-white hover:opacity-90 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                          Delete
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