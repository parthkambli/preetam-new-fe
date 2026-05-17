

















import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../../services/apiClient";

// ─── Constants ─────────────────────────────────────────────────────────────

const MODULES = [
  // "Schedule",
  // "Activities",
  // "Events",
  "Members",
  "Fees",
  "Reports",
  // "Participants",
  // "Health Records",
  "Attendance",
];

/**
 * All actions available per module.
 * These MUST match the permission strings used in the backend:
 * e.g. VIEW_FEES, EDIT_FEES, DELETE_FEES, MARK_ATTENDANCE, etc.
 */
const MODULE_ACTIONS = {
  // Schedule: ["view"],
  // Activities: ["view"],
  // Events: ["view"],
  Members: ["view", "add", "edit", "delete", "renew"],
  Fees: ["view"],
  Reports: ["view"],
  // Participants: ["view", "edit", "delete"],
  // "Health Records": ["view", "edit", "delete"],
  Attendance: ["view", "mark"],
};

const ACTION_LABELS = {
  view: "View",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
  renew: "Renew",
  mark: "Mark",
};

const emptyPermissions = () =>
  Object.fromEntries(
    MODULES.map((m) => [
      m,
      Object.fromEntries(MODULE_ACTIONS[m].map((a) => [a, false])),
    ])
  );

// ─── Mappers ────────────────────────────────────────────────────────────────

// const mapToPermissions = (permissions) => {
//   const result = [];

//   // ✅ Correct mapping
//   // if (permissions.Schedule?.view) result.push("VIEW_OWN_SCHEDULE");
//   // if (permissions.Activities?.view) result.push("VIEW_ACTIVITIES");
//   // if (permissions.Events?.view) result.push("VIEW_EVENTS");

//   // 🔥 FIXED
//   if (permissions.Attendance?.view) result.push("VIEW_ATTENDANCE");
//   if (permissions.Attendance?.mark) result.push("MARK_ATTENDANCE");
//   if (permissions.Members?.view) result.push("VIEW_MEMBER");
//   if (permissions.Members?.add) result.push("ADD_MEMBER");
//   if (permissions.Members?.edit) result.push("EDIT_MEMBER");
//   if (permissions.Members?.delete) result.push("DELETE_MEMBER");
//   if (permissions.Members?.renew) result.push("RENEW_MEMBER");

//   // Generic fallback
//   Object.entries(permissions).forEach(([module, caps]) => {
//     const key = module.toUpperCase().replace(/\s+/g, "_");

//     Object.entries(caps).forEach(([action, enabled]) => {
//       if (!enabled) return;

//       const perm = `${action.toUpperCase()}_${key}`;

//       if (
//         perm === "VIEW_OWN_SCHEDULE" ||
//         perm === "VIEW_ACTIVITIES" ||
//         perm === "VIEW_EVENTS" ||
//         perm === "VIEW_ATTENDANCE" ||
//         perm === "MARK_ATTENDANCE" ||
//         perm === "VIEW_MEMBER" ||
//         perm === "ADD_MEMBER" ||
//         perm === "EDIT_MEMBER" ||
//         perm === "DELETE_MEMBER" ||
//         perm === "RENEW_MEMBER"
//       ) return;

//       result.push(perm);
//     });
//   });

//   return [...new Set(result)];
// };

const mapToPermissions = (permissions) => {
  const result = [];

  if (permissions.Attendance?.view) {
    result.push("VIEW_ATTENDANCE");
  }

  if (permissions.Attendance?.mark) {
    result.push("MARK_ATTENDANCE");
  }

  Object.entries(permissions).forEach(([module, caps]) => {

    const key =
      module === "Members"
        ? "MEMBER"
        : module.toUpperCase().replace(/\s+/g, "_");

    Object.entries(caps).forEach(([action, enabled]) => {

      if (!enabled) return;

      const perm = `${action.toUpperCase()}_${key}`;

      if (
        perm === "VIEW_ATTENDANCE" ||
        perm === "MARK_ATTENDANCE"
      ) {
        return;
      }

      result.push(perm);
    });
  });

  return [...new Set(result)];
};

/**
 * Flat permission string array → UI state
 * e.g. ["VIEW_FEES", "MARK_ATTENDANCE"] → { Fees: { view: true, ... }, Attendance: { mark: true, ... } }
 */

// const mapFromPermissions = (permArray = []) => {
//   const perms = emptyPermissions();

//   permArray.forEach((p) => {
//     // 🔥 SPECIAL CASES FIRST
//     if (p === "MARK_ATTENDANCE") {
//       perms.Attendance.mark = true;
//       return;
//     }

//     if (p === "VIEW_OWN_SCHEDULE") {
//       perms.Schedule.view = true;
//       return;
//     }

//     if (p === "VIEW_ACTIVITIES") {
//       perms.Activities.view = true;
//       return;
//     }

//     if (p === "VIEW_EVENTS") {
//       perms.Events.view = true;
//       return;
//     }

//     // 🔥 GENERIC FALLBACK
//     const [action, ...rest] = p.split("_");
//     const moduleKey = rest.join("_");

//     const formatted = MODULES.find(
//       (m) => m.toUpperCase().replace(/\s+/g, "_") === moduleKey
//     );

//     if (
//       formatted &&
//       perms[formatted] &&
//       perms[formatted][action.toLowerCase()] !== undefined
//     ) {
//       perms[formatted][action.toLowerCase()] = true;
//     }
//   });

//   return perms;
// };

const mapFromPermissions = (permArray = []) => {
  const perms = emptyPermissions();

  permArray.forEach((p) => {
    // ✅ SPECIAL CASES

    // if (p === "VIEW_OWN_SCHEDULE") {
    //   perms.Schedule.view = true;
    //   return;
    // }

    // if (p === "VIEW_ACTIVITIES") {
    //   perms.Activities.view = true;
    //   return;
    // }

    // if (p === "VIEW_EVENTS") {
    //   perms.Events.view = true;
    //   return;
    // }

    // 🔥 THIS WAS MISSING
    if (p === "VIEW_ATTENDANCE") {
      perms.Attendance.view = true;
      return;
    }

    if (p === "MARK_ATTENDANCE") {
      perms.Attendance.mark = true;
      return;
    }

    if (p === "VIEW_MEMBER") {
      perms.Members.view = true;
      return;
    }

    if (p === "ADD_MEMBER") {
      perms.Members.add = true;
      return;
    }

    if (p === "EDIT_MEMBER") {
      perms.Members.edit = true;
      return;
    }

    if (p === "DELETE_MEMBER") {
      perms.Members.delete = true;
      return;
    }

    if (p === "RENEW_MEMBER") {
      perms.Members.renew = true;
      return;
    }

    // 🔁 GENERIC
    const [action, ...rest] = p.split("_");
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

// ─── Component ──────────────────────────────────────────────────────────────

export default function AddUser() {
  const navigate = useNavigate();
  const location = useLocation();

  const editingUser = location.state?.user || null;
  const isEdit = !!editingUser;

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState(emptyPermissions());

  // role stores the _id of the selected AccessRole
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    roleId: "", // AccessRole _id
  });

  const [rolePermissions, setRolePermissions] = useState([]); // from AccessRole
  const [overrideMode, setOverrideMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [makeDefault, setMakeDefault] = useState(false);

  // ── Fetch roles ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.accessRoles.getAll();
      const allRoles = res.data.data || [];

      // 🔥 ONLY STAFF ROLES
      const staffRoles = allRoles.filter(
        r =>
          !["ADMIN", "PARTICIPANT", "STUDENT"].includes(r.roleKey)
      );

      setRoles(staffRoles);
    } catch (err) {
      console.error("Fetch roles failed:", err);
    }
  };

  // ── Populate form when editing ────────────────────────────────────────────
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

    // Merge: role defaults minus removed, plus custom additions
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
  // only for ADD mode (not edit)
  if (editingUser || roles.length === 0) return;

  // find default role
  const defaultRole = roles.find(r => r.isDefault);

  if (!defaultRole) return;

  setForm(prev => ({
    ...prev,
    roleId: defaultRole._id
  }));

  setRolePermissions(defaultRole.permissions || []);
  setPermissions(mapFromPermissions(defaultRole.permissions || []));

}, [roles]);
console.log("roles", roles);

    const getPermissionKey = (module, action) => {
    if (module === "Schedule" && action === "view") return "VIEW_OWN_SCHEDULE";
    if (module === "Activities" && action === "view") return "VIEW_ACTIVITIES";
    if (module === "Events" && action === "view") return "VIEW_EVENTS";
    if (module === "Attendance" && action === "view") return "VIEW_ATTENDANCE";
    if (module === "Attendance" && action === "mark") return "MARK_ATTENDANCE";
    if (module === "Members" && action === "view") return "VIEW_MEMBER";
    if (module === "Members" && action === "add") return "ADD_MEMBER";
    if (module === "Members" && action === "edit") return "EDIT_MEMBER";
    if (module === "Members" && action === "delete") return "DELETE_MEMBER";
    if (module === "Members" && action === "renew") return "RENEW_MEMBER";

    return `${action.toUpperCase()}_${module.toUpperCase().replace(/\s+/g, "_")}`;
  };

  const handleCreateRole = async () => {
    try {
      if (!form.name) {
        alert("Role name required");
        return;
      }

      const permissionsArray = mapToPermissions(permissions);

      const payload = {
        name: form.name,
        permissions: permissionsArray,
        isDefault: makeDefault
      };

      await api.accessRoles.create(payload);

      alert("Role created");

      await fetchRoles(); // refresh dropdown
    } catch (err) {
      console.error(err);
      alert("Failed to create role");
    }
  };

  // ── Role change handler ───────────────────────────────────────────────────
  const handleRoleChange = (roleId) => {
    setForm((prev) => ({ ...prev, roleId }));

    const selectedRole = roles.find((r) => r._id === roleId);
    if (selectedRole) {
      const perms = selectedRole.permissions || [];
      setRolePermissions(perms);
      setPermissions(mapFromPermissions(perms));
      setOverrideMode(false); // reset override when role changes
    } else {
      setRolePermissions([]);
      setPermissions(emptyPermissions());
    }
  };

  // ── Toggle a single permission checkbox ──────────────────────────────────
  const handlePermission = (module, action) => {
    const permKey = getPermissionKey(module, action);
    const isRolePerm = rolePermissions.includes(permKey);

    // In normal mode, role-granted permissions cannot be unchecked
    if (!overrideMode && isRolePerm) return;

    setPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [action]: !prev[module][action] },
    }));
  };

  // ── Derive if a checkbox is locked (role default, override off) ───────────
  const isLocked = (module, action) => {
    const permKey = getPermissionKey(module, action);
    return !overrideMode && rolePermissions.includes(permKey);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      let userId = editingUser?._id;

      const selectedRole = roles.find((r) => r._id === form.roleId);

      // CREATE user (only in add mode)
      if (!isEdit) {
        const res = await api.userManagement.create({
          fullName: form.name,
          mobile: form.mobile,
          password: "123456",
          role: "FitnessStaff",
        });
        userId = res?.data?.data?._id;
      }

      // ASSIGN role if selected
      if (selectedRole && userId) {
        await api.userManagement.assignRole({
          userId,
          accessRoleId: selectedRole._id,
        });
      }

      // CALCULATE permission diff
      const uiPermissions = mapToPermissions(permissions);

      // 🔥 ALWAYS include role permissions unless explicitly removed via override
      let finalPermissions = [...rolePermissions];

      // Add checked permissions
      uiPermissions.forEach((perm) => {
        if (!finalPermissions.includes(perm)) {
          finalPermissions.push(perm);
        }
      });

      // If override is ON → allow removal
      if (overrideMode) {
        finalPermissions = finalPermissions.filter((perm) =>
          uiPermissions.includes(perm)
        );
      }

      // Calculate diff
      const custom = finalPermissions.filter(
        (p) => !rolePermissions.includes(p)
      );

      const removed = rolePermissions.filter(
        (p) => !finalPermissions.includes(p)
      );

      await api.userManagement.updatePermissions({
        userId,
        customPermissions: custom,
        removedPermissions: removed,
      });

      // 🚀 UPDATE ACCESS ROLE IF "Set as default role" is checked
      if (makeDefault && selectedRole) {
        try {
          const updatedPermissions = mapToPermissions(permissions);

          await api.accessRoles.update(selectedRole._id, {
            permissions: updatedPermissions
          });

          console.log("AccessRole updated with new permissions");
        } catch (err) {
          console.error("Failed to update AccessRole:", err);
        }
      }

      alert(isEdit ? "User updated successfully." : "User created successfully.");
      navigate("/fitness/user-management");
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/fitness/user-management")}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? `Edit: ${editingUser.fullName}` : "Add User"}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">

          {/* Basic Details */}
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

          {/* Role Assignment */}
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

          {/* Permissions */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Permissions
              </h3>

              {/* Override toggle */}
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
                🔒 Greyed-out permissions are granted by the assigned role and cannot
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => navigate("/fitness/user-management")}
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














