// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const ROLES = ["Super Admin", "Admin", "Accountant", "Staff", "Viewer"];
// const STATUSES = ["Active", "Inactive"];
// const MODULES = ["Fees", "Reports", "Participants", "Health Records","Attendance"];

// // Reports has no Edit/Delete — only View
// const MODULE_CAPS = {
//   Fees: { view: true, edit: true, delete: true },

//   Reports: { view: true, edit: false, delete: false },
//   Participants: { view: true, edit: true, delete: true },
//   "Health Records": { view: true, edit: true, delete: true },
//   Attendance: { view: true, edit: true, delete: true },
// };

// const emptyPermissions = () =>
//   Object.fromEntries(
//     MODULES.map((m) => [m, { view: false, edit: false, delete: false }])
//   );

// const emptyForm = {
//   name: "",
//   email: "",
//   mobile: "",
//   password: "Auto Generated",
//   role: "",
//   status: "Active",
// };

// export default function AddUser() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editingUser = location.state?.user || null;

//   const [form, setForm] = useState(emptyForm);
//   const [permissions, setPermissions] = useState(emptyPermissions());
//   const [errors, setErrors] = useState({});
//   const [saved, setSaved] = useState(false);

//   useEffect(() => {
//     if (editingUser) {
//       setForm({
//         name: editingUser.name || "",
//         email: editingUser.email || "",
//         mobile: editingUser.mobile || "",
//         password: "Auto Generated",
//         role: editingUser.role || "",
//         status: editingUser.status || "Active",
//       });
//       if (editingUser.permissions) {
//         setPermissions({ ...emptyPermissions(), ...editingUser.permissions });
//       }
//     }
//   }, [editingUser]);

//   // ── Handlers ──────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//     if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   const handlePermission = (module, cap) => {
//     setPermissions((prev) => {
//       const updated = {
//         ...prev,
//         [module]: { ...prev[module], [cap]: !prev[module][cap] },
//       };
//       // If unchecking view, also uncheck edit & delete
//       if (cap === "view" && !updated[module].view) {
//         updated[module].edit = false;
//         updated[module].delete = false;
//       }
//       // If checking edit/delete, auto-check view
//       if ((cap === "edit" || cap === "delete") && updated[module][cap]) {
//         updated[module].view = true;
//       }
//       return updated;
//     });
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Full name is required.";
//     if (!form.email.trim()) e.email = "Email is required.";
//     else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
//     if (!form.role) e.role = "Role is required.";
//     if (form.mobile && !/^\d{10}$/.test(form.mobile))
//       e.mobile = "Enter a valid 10-digit number.";
//     return e;
//   };

//   const handleSave = () => {
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setSaved(true);
//     setTimeout(() => navigate("/user-management"), 1200);
//   };

//   const handleCancel = () => navigate("/user-management");

//   // ── Success screen ─────────────────────────────────────────────
//   if (saved) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
//           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <p className="text-lg font-semibold text-gray-800">
//             User {editingUser ? "updated" : "added"} successfully!
//           </p>
//           <p className="text-sm text-gray-500">Redirecting…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       {/* Page title */}
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">
//         {editingUser ? "Edit User" : "Add User Management"}
//       </h1>

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-5xl">
//         {/* Section title */}
//         <h2 className="text-base font-bold text-[#1a2a5e] mb-5">
//           {editingUser ? "Edit User" : "Add User"}
//         </h2>

//         {/* ── Row 1: Full Name · Email · Mobile ── */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Enter name"
//               className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white ${
//                 errors.name ? "border-red-400" : "border-gray-300"
//               }`}
//             />
//             {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">Email / Username</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="user@email.com"
//               className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white ${
//                 errors.email ? "border-red-400" : "border-gray-300"
//               }`}
//             />
//             {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
//             <input
//               type="tel"
//               name="mobile"
//               value={form.mobile}
//               onChange={handleChange}
//               placeholder="10-digit number"
//               maxLength={10}
//               className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white ${
//                 errors.mobile ? "border-red-400" : "border-gray-300"
//               }`}
//             />
//             {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
//           </div>
//         </div>

//         {/* ── Row 2: Password · Role · Status ── */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
//             <input
//               type="text"
//               name="password"
//               value={form.password}
//               readOnly
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-50 cursor-default"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white ${
//                 errors.role ? "border-red-400" : "border-gray-300"
//               }`}
//             >
//               <option value="">Select Role</option>
//               {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
//             </select>
//             {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
//             <select
//               name="status"
//               value={form.status}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white"
//             >
//               {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </div>
//         </div>

//         {/* ── Permissions table ── */}
//         <div className="rounded-xl overflow-hidden border border-gray-200 mb-7">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-[#1a2a5e] text-white">
//                 <th className="px-5 py-3 text-center font-semibold w-1/2">Module</th>
//                 <th className="px-5 py-3 text-center font-semibold">View</th>
//                 <th className="px-5 py-3 text-center font-semibold">Edit</th>
//                 <th className="px-5 py-3 text-center font-semibold">Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {MODULES.map((module, idx) => (
//                 <tr key={module} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                   <td className="px-5 py-3 text-gray-800 font-medium">{module}</td>

//                   {/* View */}
//                   <td className="px-5 py-3 text-center">
//                     <input
//                       type="checkbox"
//                       checked={permissions[module].view}
//                       onChange={() => handlePermission(module, "view")}
//                       className="w-4 h-4 accent-[#1a2a5e] cursor-pointer"
//                     />
//                   </td>

//                   {/* Edit */}
//                   <td className="px-5 py-3 text-center">
//                     {MODULE_CAPS[module].edit ? (
//                       <input
//                         type="checkbox"
//                         checked={permissions[module].edit}
//                         onChange={() => handlePermission(module, "edit")}
//                         className="w-4 h-4 accent-[#1a2a5e] cursor-pointer"
//                       />
//                     ) : (
//                       <span className="text-gray-400 text-base">-</span>
//                     )}
//                   </td>

//                   {/* Delete */}
//                   <td className="px-5 py-3 text-center">
//                     {MODULE_CAPS[module].delete ? (
//                       <input
//                         type="checkbox"
//                         checked={permissions[module].delete}
//                         onChange={() => handlePermission(module, "delete")}
//                         className="w-4 h-4 accent-[#1a2a5e] cursor-pointer"
//                       />
//                     ) : (
//                       <span className="text-gray-400 text-base">-</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* ── Actions ── */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={handleCancel}
//             className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-6 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold transition-colors shadow-md"
//           >
//             {editingUser ? "Update" : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// Upar statick wala he























// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { api } from "../../../services/apiClient";

// const MODULES = ["Fees", "Reports", "Participants", "Health Records", "Attendance"];

// const MODULE_ACTIONS = {
//   Fees: ["view", "edit", "delete"],
//   Reports: ["view"],
//   Participants: ["view", "edit", "delete"],
//   "Health Records": ["view", "edit", "delete"],
//   Attendance: ["view", "mark"], // custom
// };

// const emptyPermissions = () =>
//   Object.fromEntries(
//     MODULES.map((m) => [
//       m,
//       Object.fromEntries(MODULE_ACTIONS[m].map((a) => [a, false])),
//     ])
//   );

// export default function AddUser() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const editingUser = location.state?.user || null;

//   const [roles, setRoles] = useState([]);
//   const [permissions, setPermissions] = useState(emptyPermissions());
//   const [form, setForm] = useState({
//     name: "",
//     mobile: "",
//     role: "",
//   });

//   const [saved, setSaved] = useState(false);

//   const [rolePermissions, setRolePermissions] = useState([]);
//   const [customPermissions, setCustomPermissions] = useState([]);
//   const [removedPermissions, setRemovedPermissions] = useState([]);

//   const [overrideMode, setOverrideMode] = useState(false);

//   // ================= FETCH ROLES =================
//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = async () => {
//     try {
//       const res = await api.accessRoles.getAll();
//       setRoles(res.data.data || []);
//     } catch (err) {
//       console.error("Fetch roles failed:", err);
//     }
//   };

//   // ================= LOAD USER =================
//   useEffect(() => {
//     if (editingUser) {
//       setForm({
//         name: editingUser.fullName || "",
//         mobile: editingUser.mobile || "",
//         role: editingUser.accessRoleId?.name || "",
//       });

//       const rolePerms = editingUser.accessRoleId?.permissions || [];
//       const customPerms = editingUser.customPermissions || [];
//       const removedPerms = editingUser.removedPermissions || [];

//       setRolePermissions(rolePerms);
//       setCustomPermissions(customPerms);
//       setRemovedPermissions(removedPerms);

//       const merged = [
//         ...rolePerms.filter((p) => !removedPerms.includes(p)),
//         ...customPerms,
//       ];

//       setPermissions(mapFromPermissions(merged));
//     }
//   }, [editingUser]);

//   // ================= PERMISSION MAP =================
//   const mapToPermissions = (permissions) => {
//     const result = [];

//     Object.entries(permissions).forEach(([module, caps]) => {
//       const key = module.toUpperCase().replace(/\s+/g, "_");

//       Object.entries(caps).forEach(([action, enabled]) => {
//         if (!enabled) return;

//         if (module === "Attendance" && action === "mark") {
//           result.push("MARK_ATTENDANCE");
//           return;
//         }

//         result.push(`${action.toUpperCase()}_${key}`);
//       });
//     });

//     return result;
//   };

//   const mapFromPermissions = (permArray = []) => {
//     const perms = emptyPermissions();

//     permArray.forEach((p) => {
//       if (p === "MARK_ATTENDANCE") {
//         perms["Attendance"].mark = true;
//         return;
//       }

//       const [action, ...rest] = p.split("_");
//       const module = rest.join("_");

//       const formatted = MODULES.find(
//         (m) => m.toUpperCase().replace(/\s+/g, "_") === module
//       );

//       if (formatted && perms[formatted][action.toLowerCase()] !== undefined) {
//         perms[formatted][action.toLowerCase()] = true;
//       }
//     });

//     return perms;
//   };

//   // ================= PERMISSION HANDLER =================
//   const handlePermission = (module, cap) => {
//     const key = module.toUpperCase().replace(/\s+/g, "_");

//     let perm =
//       module === "Attendance" && cap === "mark"
//         ? "MARK_ATTENDANCE"
//         : `${cap.toUpperCase()}_${key}`;

//     // 🔒 block role permissions unless override ON
//     if (!overrideMode && rolePermissions.includes(perm)) {
//       return;
//     }

//     setPermissions((prev) => {
//       const updated = {
//         ...prev,
//         [module]: { ...prev[module], [cap]: !prev[module][cap] },
//       };

//       const isInRole = rolePermissions.includes(perm);
//       const isChecked = updated[module][cap];

//       if (isInRole) {
//         if (!isChecked) {
//           setRemovedPermissions((p) => [...new Set([...p, perm])]);
//         } else {
//           setRemovedPermissions((p) => p.filter((x) => x !== perm));
//         }
//       } else {
//         if (isChecked) {
//           setCustomPermissions((p) => [...new Set([...p, perm])]);
//         } else {
//           setCustomPermissions((p) => p.filter((x) => x !== perm));
//         }
//       }

//       return updated;
//     });
//   };

//   // ================= SAVE =================
//   // const handleSave = async () => {
//   //   try {
//   //     const userId = editingUser?._id;
//   //     if (!userId) return alert("User ID missing");

//   //     const selectedRole = roles.find((r) => r.name === form.role);

//   //     if (selectedRole) {
//   //       await api.userManagement.assignRole({
//   //         userId,
//   //         accessRoleId: selectedRole._id,
//   //       });
//   //     }

//   //     await api.userManagement.updatePermissions({
//   //       userId,
//   //       customPermissions,
//   //       removedPermissions,
//   //     });

//   //     setSaved(true);
//   //     setTimeout(() => navigate("/fitness/user-management"), 1000);
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("Failed to save user");
//   //   }
//   // };
//   const handleSave = async () => {
//   try {
//     if (!isEdit) {
//       // 🔥 CREATE USER
//       await api.userManagement.create({
//         fullName: form.name,
//         mobile: form.mobile,
//         password: "123456", // or input later
//         role: form.role || "Gatekeeper"
//       });

//       alert("User created");
//       navigate("/fitness/user-management");
//       return;
//     }

//     // 🔥 EDIT FLOW (existing)
//     const userId = editingUser._id;

//     const selectedRole = roles.find((r) => r.name === form.role);

//     if (selectedRole) {
//       await api.userManagement.assignRole({
//         userId,
//         accessRoleId: selectedRole._id,
//       });
//     }

//     await api.userManagement.updatePermissions({
//       userId,
//       customPermissions,
//       removedPermissions,
//     });

//     alert("User updated");
//     navigate("/fitness/user-management");

//   } catch (err) {
//     console.error(err);
//     alert("Failed");
//   }
// };

//   // ================= UI =================
//   if (saved) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <h2>User updated successfully</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Edit User</h2>

//       <input value={form.name} readOnly className="border p-2 mb-2 w-full" />
//       <input value={form.mobile} readOnly className="border p-2 mb-2 w-full" />

//       <select
//         value={form.role}
//         onChange={(e) => setForm({ ...form, role: e.target.value })}
//         className="border p-2 mb-4 w-full"
//       >
//         <option value="">Select Role</option>
//         {roles.map((r) => (
//           <option key={r._id} value={r.name}>
//             {r.name}
//           </option>
//         ))}
//       </select>

//       {/* 🔥 Override toggle */}
//       <div className="mb-4 flex items-center gap-2">
//         <input
//           type="checkbox"
//           checked={overrideMode}
//           onChange={() => setOverrideMode(!overrideMode)}
//         />
//         Enable Permission Override
//       </div>

//       {/* Permissions */}
//       {MODULES.map((module) => (
//         <div key={module} className="mb-2">
//           <strong>{module}</strong>

//           {MODULE_ACTIONS[module].map((cap) => {
//             const perm =
//               module === "Attendance" && cap === "mark"
//                 ? "MARK_ATTENDANCE"
//                 : `${cap.toUpperCase()}_${module.toUpperCase().replace(/\s+/g, "_")}`;

//             return (
//               <label key={cap} className="ml-2">
//                 <input
//                   type="checkbox"
//                   checked={permissions[module][cap] || false}
//                   onChange={() => handlePermission(module, cap)}
//                   disabled={!overrideMode && rolePermissions.includes(perm)}
//                   className={`${
//                     customPermissions.includes(perm)
//                       ? "accent-green-600"
//                       : rolePermissions.includes(perm)
//                       ? "accent-blue-600"
//                       : ""
//                   } ${!overrideMode ? "opacity-60 cursor-not-allowed" : ""}`}
//                 />
//                 {cap}
//               </label>
//             );
//           })}
//         </div>
//       ))}

//       <button
//         onClick={handleSave}
//         className="bg-blue-600 text-white px-4 py-2 mt-4"
//       >
//         Save
//       </button>
//     </div>
//   );
// }











// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { api } from "../../../services/apiClient";

// // ✅ FIXED SPELLING
// const MODULES = [
//   "Fees",
//   "Reports",
//   "Participants",
//   "Health Records",
//   "Attendance"
// ];

// const MODULE_ACTIONS = {
//   Fees: ["view", "edit", "delete"],
//   Reports: ["view"],
//   Participants: ["view", "edit", "delete"],
//   "Health Records": ["view", "edit", "delete"],
//   Attendance: ["view", "mark"], // ✅ FIXED
// };

// const emptyPermissions = () =>
//   Object.fromEntries(
//     MODULES.map((m) => [
//       m,
//       Object.fromEntries(MODULE_ACTIONS[m].map((a) => [a, false])),
//     ])
//   );

// export default function AddUser() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const editingUser = location.state?.user || null;
//   const isEdit = !!editingUser;

//   const [roles, setRoles] = useState([]);
//   const [permissions, setPermissions] = useState(emptyPermissions());

//   const [form, setForm] = useState({
//     name: "",
//     mobile: "",
//     role: "",
//   });

//   const [rolePermissions, setRolePermissions] = useState([]);
//   const [customPermissions, setCustomPermissions] = useState([]);
//   const [removedPermissions, setRemovedPermissions] = useState([]);

//   const [overrideMode, setOverrideMode] = useState(false);

//   // ================= FETCH ROLES =================
//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchRoles = async () => {
//     try {
//       const res = await api.accessRoles.getAll();
//       setRoles(res.data.data || []);
//     } catch (err) {
//       console.error("Fetch roles failed:", err);
//     }
//   };

//   // ================= LOAD USER =================
//   useEffect(() => {
//     if (editingUser) {
//       setForm({
//         name: editingUser.fullName || "",
//         mobile: editingUser.mobile || "",
//         role: editingUser.accessRoleId?.name || "",
//       });

//       const rolePerms = editingUser.accessRoleId?.permissions || [];
//       const customPerms = editingUser.customPermissions || [];
//       const removedPerms = editingUser.removedPermissions || [];

//       setRolePermissions(rolePerms);
//       setCustomPermissions(customPerms);
//       setRemovedPermissions(removedPerms);

//       const merged = [
//         ...rolePerms.filter((p) => !removedPerms.includes(p)),
//         ...customPerms,
//       ];

//       setPermissions(mapFromPermissions(merged));
//     }
//   }, [editingUser]);

//   // ================= ROLE CHANGE =================
//   const handleRoleChange = (value) => {
//     const selectedRole = roles.find((r) => r._id === value);

//     setForm({ ...form, role: value });

//     if (selectedRole) {
//       const perms = selectedRole.permissions || [];

//       setRolePermissions(perms);
//       setCustomPermissions([]);
//       setRemovedPermissions([]);

//       setPermissions(mapFromPermissions(perms)); // ✅ default tick
//       console.log("Selected Role Permissions:", perms);
//     }
//   };

//   // ================= PERMISSION MAP =================
//   const mapToPermissions = (permissions) => {
//     const result = [];

//     Object.entries(permissions).forEach(([module, caps]) => {
//       const key = module.toUpperCase().replace(/\s+/g, "_");

//       Object.entries(caps).forEach(([action, enabled]) => {
//         if (!enabled) return;

//         result.push(`${action.toUpperCase()}_${key}`);
//       });
//     });

//     return result;
//   };

//   const mapFromPermissions = (permArray = []) => {
//     const perms = emptyPermissions();

//     permArray.forEach((p) => {
//       const [action, ...rest] = p.split("_");
//       const module = rest.join("_");

//       const formatted = MODULES.find(
//         (m) => m.toUpperCase().replace(/\s+/g, "_") === module
//       );

//       if (formatted && perms[formatted][action.toLowerCase()] !== undefined) {
//         perms[formatted][action.toLowerCase()] = true;
//       }
//     });

//     return perms;
//   };

//   // ================= PERMISSION HANDLER =================
//   const handlePermission = (module, cap) => {
//     const key = module.toUpperCase().replace(/\s+/g, "_");

//     const perm = `${cap.toUpperCase()}_${key}`;

//     // if (!overrideMode && rolePermissions.includes(perm)) return;

//     setPermissions((prev) => ({
//       ...prev,
//       [module]: { ...prev[module], [cap]: !prev[module][cap] },
//     }));
//   };

//   // ================= SAVE =================
//   const handleSave = async () => {
//     try {
//       let userId = editingUser?._id;

//       const selectedRole = roles.find((r) => r.name === form.role);

//       // CREATE USER
//       if (!isEdit) {
//         const res = await api.userManagement.create({
//           fullName: form.name,
//           mobile: form.mobile,
//           password: "123456",
//           role: form.role || "Gatekeeper",
//         });

//         userId = res?.data?.data?._id;
//       }

//       // ASSIGN ROLE
//       if (selectedRole) {
//         await api.userManagement.assignRole({
//           userId,
//           accessRoleId: selectedRole._id,
//         });
//       }

//       // FINAL PERMISSION CALCULATION
//       const finalPermissions = mapToPermissions(permissions);

//       const custom = finalPermissions.filter(
//         (p) => !rolePermissions.includes(p)
//       );

//       const removed = rolePermissions.filter(
//         (p) => !finalPermissions.includes(p)
//       );

//       await api.userManagement.updatePermissions({
//         userId,
//         customPermissions: custom,
//         removedPermissions: removed,
//       });

//       alert(isEdit ? "User updated" : "User created");
//       navigate("/fitness/user-management");

//     } catch (err) {
//       console.error(err);
//       alert("Failed");
//     }
//   };

//   // ================= UI =================
//   return (
//     <div className="p-6 bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4">
//         {isEdit ? "Edit User" : "Add User"}
//       </h2>

//       <input
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//         className="border p-2 mb-2 w-full"
//         placeholder="Name"
//       />

//       <input
//         value={form.mobile}
//         onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//         className="border p-2 mb-2 w-full"
//         placeholder="Mobile"
//       />

//       <select
//         value={form.role}
//         onChange={(e) => handleRoleChange(e.target.value)}
//         className="border p-2 mb-4 w-full"
//       >
//         <option value="">Select Role</option>
//         {roles.map((r) => (
//           <option key={r._id} value={r._id}>
//             {r.name}
//           </option>
//         ))}
//       </select>

//       <div className="mb-4 flex items-center gap-2">
//         <input
//           type="checkbox"
//           checked={overrideMode}
//           onChange={() => setOverrideMode(!overrideMode)}
//         />
//         Enable Permission Override
//       </div>

//       {MODULES.map((module) => (
//         <div key={module} className="mb-2">
//           <strong>{module}</strong>

//           {MODULE_ACTIONS[module].map((cap) => {
//             const perm = `${cap.toUpperCase()}_${module
//               .toUpperCase()
//               .replace(/\s+/g, "_")}`;

//             return (
//               <label key={cap} className="ml-2">
//                 <input
//                   type="checkbox"
//                   checked={permissions[module][cap] || false}
//                   onChange={() => handlePermission(module, cap)}
//                 />
//                 {cap}
//               </label>
//             );
//           })}
//         </div>
//       ))}

//       <button
//         onClick={handleSave}
//         className="bg-blue-600 text-white px-4 py-2 mt-4"
//       >
//         Save
//       </button>
//     </div>
//   );

// }


















import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../../services/apiClient";

// ─── Constants ─────────────────────────────────────────────────────────────

const MODULES = [
  "Schedule",
  "Activities",
  "Events",
  "Fees",
  "Reports",
  "Participants",
  "Health Records",
  "Attendance",
];

/**
 * All actions available per module.
 * These MUST match the permission strings used in the backend:
 * e.g. VIEW_FEES, EDIT_FEES, DELETE_FEES, MARK_ATTENDANCE, etc.
 */
const MODULE_ACTIONS = {
  Schedule: ["view"],
  Activities: ["view"],
  Events: ["view"],
  Fees: ["view", "edit", "delete"],
  Reports: ["view"],
  Participants: ["view", "edit", "delete"],
  "Health Records": ["view", "edit", "delete"],
  Attendance: ["view", "mark"],
};

const ACTION_LABELS = {
  view: "View",
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

// ─── Mappers ────────────────────────────────────────────────────────────────

/**
 * UI state → flat permission string array
 * e.g. { Fees: { view: true, edit: false } } → ["VIEW_FEES"]
 */

// const mapToPermissions = (permissions) => {
//   const result = [];

//   // ✅ EXPLICIT MAPPING (CRITICAL FIX)
//   if (permissions.Schedule?.view) result.push("VIEW_OWN_SCHEDULE");
//   if (permissions.Activities?.view) result.push("VIEW_ACTIVITIES");
//   if (permissions.Events?.view) result.push("VIEW_EVENTS");

//   // 🔥 Attendance special case
//   if (permissions.Attendance?.mark) result.push("MARK_ATTENDANCE");

//   // 🔁 Generic fallback (for Fees, Reports, etc.)
//   Object.entries(permissions).forEach(([module, caps]) => {
//     const key = module.toUpperCase().replace(/\s+/g, "_");

//     Object.entries(caps).forEach(([action, enabled]) => {
//       if (!enabled) return;

//       const perm = `${action.toUpperCase()}_${key}`;

//       // ❌ avoid duplicates (already handled above)
//       if (
//         perm === "MARK_ATTENDANCE" ||
//         perm === "VIEW_OWN_SCHEDULE" ||
//         perm === "VIEW_ACTIVITIES" ||
//         perm === "VIEW_EVENTS"
//       ) return;

//       result.push(perm);
//     });
//   });

//   return [...new Set(result)];
// };

const mapToPermissions = (permissions) => {
  const result = [];

  // ✅ Correct mapping
  if (permissions.Schedule?.view) result.push("VIEW_OWN_SCHEDULE");
  if (permissions.Activities?.view) result.push("VIEW_ACTIVITIES");
  if (permissions.Events?.view) result.push("VIEW_EVENTS");

  // 🔥 FIXED
  if (permissions.Attendance?.view) result.push("VIEW_ATTENDANCE");
  if (permissions.Attendance?.mark) result.push("MARK_ATTENDANCE");

  // Generic fallback
  Object.entries(permissions).forEach(([module, caps]) => {
    const key = module.toUpperCase().replace(/\s+/g, "_");

    Object.entries(caps).forEach(([action, enabled]) => {
      if (!enabled) return;

      const perm = `${action.toUpperCase()}_${key}`;

      if (
        perm === "VIEW_OWN_SCHEDULE" ||
        perm === "VIEW_ACTIVITIES" ||
        perm === "VIEW_EVENTS" ||
        perm === "VIEW_ATTENDANCE" ||
        perm === "MARK_ATTENDANCE"
      ) return;

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

    if (p === "VIEW_OWN_SCHEDULE") {
      perms.Schedule.view = true;
      return;
    }

    if (p === "VIEW_ACTIVITIES") {
      perms.Activities.view = true;
      return;
    }

    if (p === "VIEW_EVENTS") {
      perms.Events.view = true;
      return;
    }

    // 🔥 THIS WAS MISSING
    if (p === "VIEW_ATTENDANCE") {
      perms.Attendance.view = true;
      return;
    }

    if (p === "MARK_ATTENDANCE") {
      perms.Attendance.mark = true;
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

  // ── Fetch roles ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.accessRoles.getAll();
      setRoles(res.data.data || []);
    } catch (err) {
      console.error("Fetch roles failed:", err);
    }
  };

  // ── Populate form when editing ────────────────────────────────────────────
  useEffect(() => {
    if (!editingUser || roles.length === 0) return;

    const role = roles.find(r => r._id === editingUser.accessRoleId?._id);
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
    const permKey = `${action.toUpperCase()}_${module.toUpperCase().replace(/\s+/g, "_")}`;
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
    const permKey = `${action.toUpperCase()}_${module.toUpperCase().replace(/\s+/g, "_")}`;
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