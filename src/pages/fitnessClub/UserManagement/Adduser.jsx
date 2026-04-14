import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ROLES = ["Super Admin", "Admin", "Accountant", "Staff", "Viewer"];
const STATUSES = ["Active", "Inactive"];
const MODULES = ["Fees", "Reports", "Participants", "Health Records","Attendence"];

// Reports has no Edit/Delete — only View
const MODULE_CAPS = {
  Fees: { view: true, edit: true, delete: true },

  Reports: { view: true, edit: false, delete: false },
  Participants: { view: true, edit: true, delete: true },
  "Health Records": { view: true, edit: true, delete: true },
  Attendence: { view: true, edit: true, delete: true },
};

const emptyPermissions = () =>
  Object.fromEntries(
    MODULES.map((m) => [m, { view: false, edit: false, delete: false }])
  );

const emptyForm = {
  name: "",
  email: "",
  mobile: "",
  password: "Auto Generated",
  role: "",
  status: "Active",
};

export default function AddUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingUser = location.state?.user || null;

  const [form, setForm] = useState(emptyForm);
  const [permissions, setPermissions] = useState(emptyPermissions());
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name || "",
        email: editingUser.email || "",
        mobile: editingUser.mobile || "",
        password: "Auto Generated",
        role: editingUser.role || "",
        status: editingUser.status || "Active",
      });
      if (editingUser.permissions) {
        setPermissions({ ...emptyPermissions(), ...editingUser.permissions });
      }
    }
  }, [editingUser]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePermission = (module, cap) => {
    setPermissions((prev) => {
      const updated = {
        ...prev,
        [module]: { ...prev[module], [cap]: !prev[module][cap] },
      };
      // If unchecking view, also uncheck edit & delete
      if (cap === "view" && !updated[module].view) {
        updated[module].edit = false;
        updated[module].delete = false;
      }
      // If checking edit/delete, auto-check view
      if ((cap === "edit" || cap === "delete") && updated[module][cap]) {
        updated[module].view = true;
      }
      return updated;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.role) e.role = "Role is required.";
    if (form.mobile && !/^\d{10}$/.test(form.mobile))
      e.mobile = "Enter a valid 10-digit number.";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaved(true);
    setTimeout(() => navigate("/user-management"), 1200);
  };

  const handleCancel = () => navigate("/user-management");

  // ── Success screen ─────────────────────────────────────────────
  if (saved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            User {editingUser ? "updated" : "added"} successfully!
          </p>
          <p className="text-sm text-gray-500">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {editingUser ? "Edit User" : "Add User Management"}
      </h1>

      <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl">
        {/* Section title */}
        <h2 className="text-base font-bold text-[#1a2a5e] mb-5">
          {editingUser ? "Edit User" : "Add User"}
        </h2>

        {/* ── Row 1: Full Name · Email · Mobile ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
              className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email / Username</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@email.com"
              className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit number"
              maxLength={10}
              className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white ${
                errors.mobile ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
          </div>
        </div>

        {/* ── Row 2: Password · Role · Status ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="text"
              name="password"
              value={form.password}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-50 cursor-default"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white ${
                errors.role ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="">Select Role</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* ── Permissions table ── */}
        <div className="rounded-xl overflow-hidden border border-gray-200 mb-7">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#1a2a5e] text-white">
                <th className="px-5 py-3 text-center font-semibold w-1/2">Module</th>
                <th className="px-5 py-3 text-center font-semibold">View</th>
                <th className="px-5 py-3 text-center font-semibold">Edit</th>
                <th className="px-5 py-3 text-center font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody>
              {MODULES.map((module, idx) => (
                <tr key={module} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-5 py-3 text-gray-800 font-medium">{module}</td>

                  {/* View */}
                  <td className="px-5 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={permissions[module].view}
                      onChange={() => handlePermission(module, "view")}
                      className="w-4 h-4 accent-[#1a2a5e] cursor-pointer"
                    />
                  </td>

                  {/* Edit */}
                  <td className="px-5 py-3 text-center">
                    {MODULE_CAPS[module].edit ? (
                      <input
                        type="checkbox"
                        checked={permissions[module].edit}
                        onChange={() => handlePermission(module, "edit")}
                        className="w-4 h-4 accent-[#1a2a5e] cursor-pointer"
                      />
                    ) : (
                      <span className="text-gray-400 text-base">-</span>
                    )}
                  </td>

                  {/* Delete */}
                  <td className="px-5 py-3 text-center">
                    {MODULE_CAPS[module].delete ? (
                      <input
                        type="checkbox"
                        checked={permissions[module].delete}
                        onChange={() => handlePermission(module, "delete")}
                        className="w-4 h-4 accent-[#1a2a5e] cursor-pointer"
                      />
                    ) : (
                      <span className="text-gray-400 text-base">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold transition-colors shadow-md"
          >
            {editingUser ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}