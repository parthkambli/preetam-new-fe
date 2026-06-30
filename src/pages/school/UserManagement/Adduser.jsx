import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient, { api } from "../../../services/apiClient";

const MODULES = [
  "Admissions & Participants",
  "Fees",
  "Reports",
  "Attendance",
];

const MODULE_ACTIONS = {
  "Admissions & Participants": ["view", "add", "edit", "delete"],
  Fees: ["view"],
  Reports: ["view"],
  Attendance: ["view", "mark"],
};

const ACTION_LABELS = {
  view: "View",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
  mark: "Mark",
};

const emptyPermissions = () =>
  Object.fromEntries(
    MODULES.map((m) => [
      m,
      Object.fromEntries(MODULE_ACTIONS[m].map((a) => [a, false])),
    ])
  );

const mapToPermissions = (permissions) => {
  const result = [];

  if (permissions.Attendance?.view) {
    result.push("SCHOOL_VIEW_ATTENDANCE");
  }

  if (permissions.Attendance?.mark) {
    result.push("SCHOOL_MARK_ATTENDANCE");
  }

  Object.entries(permissions).forEach(([module, caps]) => {
    const moduleKey =
      module === "Admissions & Participants"
        ? "ADMISSION"
        : module.toUpperCase().replace(/\s+/g, "_");

    Object.entries(caps).forEach(([action, enabled]) => {
      if (!enabled) return;

      const perm = `SCHOOL_${action.toUpperCase()}_${moduleKey}`;

      if (
        perm === "SCHOOL_VIEW_ATTENDANCE" ||
        perm === "SCHOOL_MARK_ATTENDANCE"
      ) {
        return;
      }

      result.push(perm);
    });
  });

  return [...new Set(result)];
};

const mapFromPermissions = (permArray = []) => {
  const perms = emptyPermissions();

  permArray.forEach((p) => {
    if (p === "SCHOOL_VIEW_ADMISSION") {
      perms["Admissions & Participants"].view = true;
      return;
    }

    if (p === "SCHOOL_ADD_ADMISSION") {
      perms["Admissions & Participants"].add = true;
      return;
    }

    if (p === "SCHOOL_EDIT_ADMISSION") {
      perms["Admissions & Participants"].edit = true;
      return;
    }

    if (p === "SCHOOL_DELETE_ADMISSION") {
      perms["Admissions & Participants"].delete = true;
      return;
    }

    if (p === "SCHOOL_VIEW_ATTENDANCE") {
      perms.Attendance.view = true;
      return;
    }

    if (p === "SCHOOL_MARK_ATTENDANCE") {
      perms.Attendance.mark = true;
      return;
    }

    const permWithoutSchool = p.replace(/^SCHOOL_/, "");
    const [action, ...rest] = permWithoutSchool.split("_");
    const moduleKey = rest.join("_");

    const formatted = MODULES.find(
      (m) => m.toUpperCase().replace(/\s+/g, "_") === moduleKey
    );

    if (
      formatted &&
      perms[formatted] &&
      perms[formatted][action.toLowerCase()] !== undefined
    ) {
      perms[formatted][action.toLowerCase()] = true;
    }
  });

  return perms;
};

export default function AddUser() {
  const navigate = useNavigate();
  const location = useLocation();

  const editingUser = location.state?.user || null;
  const isEdit = !!editingUser;

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState(emptyPermissions());

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    roleId: "",
  });

  const [rolePermissions, setRolePermissions] = useState([]);
  const [overrideMode, setOverrideMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [makeDefault, setMakeDefault] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await apiClient.get("/access-roles", {
        headers: { "X-Organization-ID": "fitness" }
      });
      const allRoles = res.data.data || [];

      const staffRoles = allRoles.filter(
        r =>
          !["ADMIN", "PARTICIPANT", "STUDENT"].includes(r.roleKey)
      );

      setRoles(staffRoles);
    } catch (err) {
      console.error("Fetch roles failed:", err);
    }
  };

  useEffect(() => {
    if (!editingUser || roles.length === 0) return;

    const roleId =
      typeof editingUser.accessRoleId === "object"
        ? editingUser.accessRoleId._id
        : editingUser.accessRoleId;

    const role = roles.find(r => r._id === roleId);
    const rolePerms = role?.permissions || [];
    const customPerms = editingUser.customPermissions || [];
    const removedPerms = editingUser.removedPermissions || [];

    setRolePermissions(rolePerms);

    const merged = [
      ...new Set([
        ...rolePerms.filter((p) => !removedPerms.includes(p)),
        ...customPerms,
      ]),
    ];

    setForm({
      name: editingUser.fullName || "",
      mobile: editingUser.mobile || "",
      roleId: editingUser.accessRoleId?._id || "",
    });

    setPermissions(mapFromPermissions(merged));
  }, [editingUser, roles]);

  useEffect(() => {
    if (editingUser || roles.length === 0) return;

    const defaultRole = roles.find(r => r.isDefault);

    if (!defaultRole) return;

    setForm(prev => ({
      ...prev,
      roleId: defaultRole._id
    }));

    setRolePermissions(defaultRole.permissions || []);
    setPermissions(mapFromPermissions(defaultRole.permissions || []));
  }, [roles]);

  const getPermissionKey = (module, action) => {
    if (module === "Attendance" && action === "view") return "SCHOOL_VIEW_ATTENDANCE";
    if (module === "Attendance" && action === "mark") return "SCHOOL_MARK_ATTENDANCE";
    if (module === "Admissions & Participants" && action === "view") return "SCHOOL_VIEW_ADMISSION";
    if (module === "Admissions & Participants" && action === "add") return "SCHOOL_ADD_ADMISSION";
    if (module === "Admissions & Participants" && action === "edit") return "SCHOOL_EDIT_ADMISSION";
    if (module === "Admissions & Participants" && action === "delete") return "SCHOOL_DELETE_ADMISSION";

    return `SCHOOL_${action.toUpperCase()}_${module.toUpperCase().replace(/\s+/g, "_")}`;
  };

  const handleRoleChange = (roleId) => {
    setForm((prev) => ({ ...prev, roleId }));

    const selectedRole = roles.find((r) => r._id === roleId);
    if (selectedRole) {
      const perms = selectedRole.permissions || [];
      setRolePermissions(perms);
      setPermissions(mapFromPermissions(perms));
      setOverrideMode(false);
    } else {
      setRolePermissions([]);
      setPermissions(emptyPermissions());
    }
  };

  const handlePermission = (module, action) => {
    const permKey = getPermissionKey(module, action);
    const isRolePerm = rolePermissions.includes(permKey);

    if (!overrideMode && isRolePerm) return;

    setPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [action]: !prev[module][action] },
    }));
  };

  const isLocked = (module, action) => {
    const permKey = getPermissionKey(module, action);
    return !overrideMode && rolePermissions.includes(permKey);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let userId = editingUser?._id;

      const selectedRole = roles.find((r) => r._id === form.roleId);

      if (!isEdit) {
        const res = await apiClient.post("/user-management", {
          fullName: form.name,
          mobile: form.mobile,
          password: "123456",
          role: "FitnessStaff",
        }, {
          headers: { "X-Organization-ID": "fitness" }
        });
        userId = res?.data?.data?._id;
      }

      if (selectedRole && userId) {
        await apiClient.put("/user-management/assign-role", {
          userId,
          accessRoleId: selectedRole._id,
        }, {
          headers: { "X-Organization-ID": "fitness" }
        });
      }

      const uiPermissions = mapToPermissions(permissions);

      let finalPermissions = [...rolePermissions];

      uiPermissions.forEach((perm) => {
        if (!finalPermissions.includes(perm)) {
          finalPermissions.push(perm);
        }
      });

      if (overrideMode) {
        finalPermissions = finalPermissions.filter((perm) =>
          uiPermissions.includes(perm)
        );
      }

      const custom = finalPermissions.filter(
        (p) => !rolePermissions.includes(p)
      );

      const removed = rolePermissions.filter(
        (p) => !finalPermissions.includes(p)
      );

      await apiClient.put("/user-management/permissions", {
        userId,
        customPermissions: custom,
        removedPermissions: removed,
      }, {
        headers: { "X-Organization-ID": "fitness" }
      });

      if (makeDefault && selectedRole) {
        try {
          const updatedPermissions = mapToPermissions(permissions);

          await apiClient.put(`/access-roles/${selectedRole._id}`, {
            permissions: updatedPermissions
          }, {
            headers: { "X-Organization-ID": "fitness" }
          });
        } catch (err) {
          console.error("Failed to update AccessRole:", err);
        }
      }

      alert(isEdit ? "User updated successfully." : "User created successfully.");
      navigate("/school/user-management");
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/school/user-management")}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? `Edit: ${editingUser.fullName}` : "Add User"}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Basic Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
                  placeholder="Enter full name"
                  disabled={isEdit}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
                  placeholder="10-digit mobile"
                  disabled={isEdit}
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Access Role
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Role
              </label>
              <select
                value={form.roleId}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]"
              >
                <option value="">— Select a role —</option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
              {rolePermissions.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  This role grants {rolePermissions.length} default permission
                  {rolePermissions.length !== 1 ? "s" : ""}.
                </p>
              )}
            </div>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={makeDefault}
                onChange={() => setMakeDefault(!makeDefault)}
              />
              <span className="text-sm text-gray-600">
                Set as default role
              </span>
            </label>
          </section>

          <hr className="border-gray-100" />

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Permissions
              </h3>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setOverrideMode(!overrideMode)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    overrideMode ? "bg-[#1a2a5e]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      overrideMode ? "translate-x-4" : ""
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  Override role defaults
                </span>
              </label>
            </div>

            {!overrideMode && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 mb-4">
                Greyed-out permissions are granted by the assigned role and cannot
                be removed without enabling Override.
              </p>
            )}

            <div className="space-y-3">
              {MODULES.map((module) => (
                <div
                  key={module}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
                >
                  <span className="text-sm font-medium text-gray-700 w-36">
                    {module}
                  </span>

                  <div className="flex items-center gap-4 flex-wrap">
                    {MODULE_ACTIONS[module].map((action) => {
                      const locked = isLocked(module, action);
                      const checked = permissions[module]?.[action] || false;

                      return (
                        <label
                          key={action}
                          className={`flex items-center gap-1.5 text-sm select-none ${
                            locked
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handlePermission(module, action)}
                            disabled={locked}
                            className="accent-[#1a2a5e] w-3.5 h-3.5"
                          />
                          <span className={locked ? "text-gray-400" : "text-gray-700"}>
                            {ACTION_LABELS[action] || action}
                          </span>
                          {locked && (
                            <span className="text-xs text-gray-400">🔒</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => navigate("/school/user-management")}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#1a2a5e] hover:bg-[#152147] disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              {saving ? "Saving…" : isEdit ? "Update User" : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
