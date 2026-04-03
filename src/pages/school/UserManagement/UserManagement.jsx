import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialUsers = [
  {
    id: 1,
    name: "Raj Sharma",
    role: "Super Admin",
    email: "raj@preetam.com",
    status: "Active",
    lastLogin: "17 Jan 2026",
    permissions: {
      Fees: { view: true, edit: true, delete: true },
      Reports: { view: true, edit: false, delete: false },
      Participants: { view: true, edit: true, delete: false },
      "Health Records": { view: true, edit: true, delete: true },
    },
  },
  {
    id: 2,
    name: "Neha Desai",
    role: "Accountant",
    email: "accounts@preetam.com",
    status: "Active",
    lastLogin: "16 Jan 2026",
    permissions: {
      Fees: { view: true, edit: true, delete: false },
      Reports: { view: true, edit: false, delete: false },
      Participants: { view: true, edit: false, delete: false },
      "Health Records": { view: false, edit: false, delete: false },
    },
  },
  {
    id: 3,
    name: "Amit Patil",
    role: "Staff",
    email: "staff@preetam.com",
    status: "Inactive",
    lastLogin: "-",
    permissions: {
      Fees: { view: false, edit: false, delete: false },
      Reports: { view: false, edit: false, delete: false },
      Participants: { view: true, edit: false, delete: false },
      "Health Records": { view: true, edit: false, delete: false },
    },
  },
];

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);

  // expose setter via sessionStorage trick — simpler: just use navigate state
  const handleEdit = (user) => {
    navigate("/school/user-management/Add-user", { state: { user } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => navigate("/school/user-management/Add-user")}
          className="bg-[#1a2a5e] hover:bg-[#152147] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm shadow-md whitespace-nowrap"
        >
          Add User Management
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#1a2a5e] text-white">
                <th className="px-5 py-3 text-center font-semibold">Name</th>
                <th className="px-5 py-3 text-center font-semibold">Role</th>
                <th className="px-5 py-3 text-center font-semibold">Email</th>
                <th className="px-5 py-3 text-center font-semibold">Status</th>
                <th className="px-5 py-3 text-center font-semibold">Last Login</th>
                <th className="px-5 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-5 py-3 text-gray-800 font-medium whitespace-nowrap">{user.name}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{user.role}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{user.email}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{user.lastLogin}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-[#1a2a5e] hover:bg-[#152147] text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 shadow-sm"
                      >
                        Edit
                      </button>
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