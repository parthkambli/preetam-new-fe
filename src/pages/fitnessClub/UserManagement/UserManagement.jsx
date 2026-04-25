// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const initialUsers = [
//   {
//     id: 1,
//     name: "Raj Sharma",
//     role: "Super Admin",
//     email: "raj@preetam.com",
//     status: "Active",
//     lastLogin: "17 Jan 2026",
//     permissions: {
//       Fees: { view: true, edit: true, delete: true },
//       Reports: { view: true, edit: false, delete: false },
//       Participants: { view: true, edit: true, delete: false },
//       "Health Records": { view: true, edit: true, delete: true },
//     },
//   },
//   {
//     id: 2,
//     name: "Neha Desai",
//     role: "Accountant",
//     email: "accounts@preetam.com",
//     status: "Active",
//     lastLogin: "16 Jan 2026",
//     permissions: {
//       Fees: { view: true, edit: true, delete: false },
//       Reports: { view: true, edit: false, delete: false },
//       Participants: { view: true, edit: false, delete: false },
//       "Health Records": { view: false, edit: false, delete: false },
//     },
//   },
//   {
//     id: 3,
//     name: "Amit Patil",
//     role: "Staff",
//     email: "staff@preetam.com",
//     status: "Inactive",
//     lastLogin: "-",
//     permissions: {
//       Fees: { view: false, edit: false, delete: false },
//       Reports: { view: false, edit: false, delete: false },
//       Participants: { view: true, edit: false, delete: false },
//       "Health Records": { view: true, edit: false, delete: false },
//     },
//   },
// ];

// export default function UserManagement() {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState(initialUsers);

//   // expose setter via sessionStorage trick — simpler: just use navigate state
//   const handleEdit = (user) => {
//     navigate("/fitness/user-management/Add-user", { state: { user } });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
//         <button
//           onClick={() => navigate("/fitness/user-management/Add-user")}
//           className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm shadow-md whitespace-nowrap"
//         >
//           Add User
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-[#1a2a5e] text-white">
//                 <th className="px-5 py-3 text-center font-semibold">Name</th>
//                 <th className="px-5 py-3 text-center font-semibold">Role</th>
//                 <th className="px-5 py-3 text-center font-semibold">Email</th>
//                 <th className="px-5 py-3 text-center font-semibold">Status</th>
//                 <th className="px-5 py-3 text-center font-semibold">Last Login</th>
//                 <th className="px-5 py-3 text-center font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
//                     No users found.
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user, idx) => (
//                   <tr key={user.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                     <td className="px-5 py-3 text-gray-800 font-medium whitespace-nowrap">{user.name}</td>
//                     <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{user.role}</td>
//                     <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{user.email}</td>
//                     <td className="px-5 py-3 whitespace-nowrap">
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
//                           user.status === "Active"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-500"
//                         }`}
//                       >
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{user.lastLogin}</td>
//                     <td className="px-5 py-3 whitespace-nowrap">
//                       <button
//                         onClick={() => handleEdit(user)}
//                         className="bg-[#1a2a5e] hover:bg-[#152147] text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 shadow-sm"
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }












// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../../services/apiClient";

// const MODULES = ["Fees", "Reports", "Participants", "Health Records", "Attendence"];

// // 🔥 Map UI → Backend
// const mapToPermissions = (permissions) => {
//   const result = [];

//   Object.entries(permissions).forEach(([module, caps]) => {
//     const key = module.toUpperCase().replace(/\s+/g, "_");

//     if (caps.view) result.push(`VIEW_${key}`);
//     if (caps.edit) result.push(`EDIT_${key}`);
//     if (caps.delete) result.push(`DELETE_${key}`);
//   });

//   return result;
// };

// // 🔥 Map Backend → UI
// const mapFromPermissions = (permArray = []) => {
//   const perms = {};

//   MODULES.forEach((m) => {
//     perms[m] = { view: false, edit: false, delete: false };
//   });

//   permArray.forEach((p) => {
//     const [action, ...rest] = p.split("_");
//     const module = rest.join("_");

//     const formatted = MODULES.find(
//       (m) => m.toUpperCase().replace(/\s+/g, "_") === module
//     );

//     if (formatted) {
//       if (action === "VIEW") perms[formatted].view = true;
//       if (action === "EDIT") perms[formatted].edit = true;
//       if (action === "DELETE") perms[formatted].delete = true;
//     }
//   });

//   return perms;
// };

// export default function UserManagement() {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//     fetchUsers();
//     fetchRoles();
//   }, []);

//   const fetchUsers = async () => {
//    try {
//       const res = await api.userManagement.getAll();
//       setUsers(res.data.data || []);
//     } catch (err) {
//       console.error("Fetch users failed:", err);
//     }
//   };

//   const fetchRoles = async () => {
//   try {
//     const res = await api.accessRoles.getAll();
//     setRoles(res.data.data || []);
//   } catch (err) {
//     console.error("Fetch roles failed:", err);
//   }
// };

//   const handleEdit = (user) => {
//     navigate("/fitness/user-management/Add-user", {
//       state: {
//         user: {
//           ...user,
//           permissions: mapFromPermissions([
//             ...(user.accessRoleId?.permissions || []),
//             ...(user.customPermissions || []),
//           ]),
//         },
//       },
//     });
//   };

// const assignRole = async (userId, roleId) => {
//   try {
//     await api.userManagement.assignRole({
//       userId,
//       accessRoleId: roleId,
//     });

//     fetchUsers();
//   } catch (err) {
//     console.error("Assign role failed:", err);
//   }
// };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

//         <button
//           onClick={() => navigate("/fitness/user-management/Add-user")}
//           className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-md"
//         >
//           Add User
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-[#1a2a5e] text-white">
//                 <th className="px-5 py-3 text-center">Name</th>
//                 <th className="px-5 py-3 text-center">Role</th>
//                 <th className="px-5 py-3 text-center">Mobile</th>
//                 <th className="px-5 py-3 text-center">Status</th>
//                 <th className="px-5 py-3 text-center">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {users.map((user, idx) => (
//                 <tr key={user._id} className={idx % 2 ? "bg-gray-50" : ""}>
//                   <td className="px-5 py-3">{user.fullName}</td>

//                   {/* ROLE DROPDOWN */}
//                   <td className="px-5 py-3">
//                     <select
//                       value={user.accessRoleId?._id || ""}
//                       onChange={(e) =>
//                         assignRole(user._id, e.target.value)
//                       }
//                       className="border px-2 py-1 rounded"
//                     >
//                       <option value="">Select</option>
//                       {roles.map((r) => (
//                         <option key={r._id} value={r._id}>
//                           {r.name}
//                         </option>
//                       ))}
//                     </select>
//                   </td>

//                   <td className="px-5 py-3">{user.mobile}</td>

//                   <td className="px-5 py-3">
//                     {user.isActive === "Yes" ? "Active" : "Inactive"}
//                   </td>

//                   <td className="px-5 py-3">
//                     <button
//                       onClick={() => handleEdit(user)}
//                       className="bg-[#1a2a5e] text-white px-3 py-1 rounded"
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
















import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/apiClient";

const STAFF_ROLES = ["FitnessStaff", "SchoolStaff"];

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assigningRole, setAssigningRole] = useState(null); // userId being updated

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.userManagement.getAll();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Fetch users failed:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.accessRoles.getAll();
      setRoles(res.data.data || []);
    } catch (err) {
      console.error("Fetch roles failed:", err);
    }
  };

  const handleEdit = (user) => {
    navigate("/fitness/user-management/Add-user", {
      state: { user },
    });
  };

  const assignRole = async (userId, roleId) => {
    if (!roleId) return;
    setAssigningRole(userId);
    try {
      await api.userManagement.assignRole({ userId, accessRoleId: roleId });
      await fetchUsers();
    } catch (err) {
      console.error("Assign role failed:", err);
    } finally {
      setAssigningRole(null);
    }
  };

  const isStaff = (user) => STAFF_ROLES.includes(user.role);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage users and assign roles. Permission overrides available for Staff only.
          </p>
        </div>
        <button
          onClick={() => navigate("/fitness/user-management/Add-user")}
          className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-md transition-colors"
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#1a2a5e] text-white">
                <th className="px-5 py-3 text-left font-semibold">Name</th>
                <th className="px-5 py-3 text-left font-semibold">System Role</th>
                <th className="px-5 py-3 text-left font-semibold">Access Role</th>
                <th className="px-5 py-3 text-left font-semibold">Mobile</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}

              {users.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`border-b border-gray-100 transition-colors hover:bg-blue-50/30 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Name */}
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {user.fullName}
                  </td>

                  {/* System Role badge */}
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isStaff(user)
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Access Role — dropdown only for staff */}
                  <td className="px-5 py-3">
                    {isStaff(user) ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={user.accessRoleId?._id || ""}
                          onChange={(e) => assignRole(user._id, e.target.value)}
                          disabled={assigningRole === user._id}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] disabled:opacity-50"
                        >
                          <option value="">— Select —</option>
                          {roles.map((r) => (
                            <option key={r._id} value={r._id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                        {assigningRole === user._id && (
                          <span className="text-xs text-gray-400">Saving…</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        {user.accessRoleId?.name || "—"}
                      </span>
                    )}
                  </td>

                  {/* Mobile */}
                  <td className="px-5 py-3 text-gray-600">{user.mobile}</td>

                  {/* Status */}
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive === "Yes"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.isActive === "Yes" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3 text-center">
                    {isStaff(user) ? (
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-[#1a2a5e] hover:bg-[#152147] text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                      >
                        Edit Permissions
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No override
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <p className="text-xs text-gray-400 mt-3">
        * Permission overrides can only be set for <strong>FitnessStaff</strong> and{" "}
        <strong>SchoolStaff</strong> users.
      </p>
    </div>
  );
}