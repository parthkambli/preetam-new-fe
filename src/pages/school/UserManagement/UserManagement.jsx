import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { api } from "../../../services/apiClient";
import Pagination from "../../../components/Pagination";

const STAFF_ROLES = ["FitnessStaff"];

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assigningRole, setAssigningRole] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/user-management", {
        params: { page, limit, search },
        headers: { "X-Organization-ID": "fitness" }
      });

      const allUsers = res.data.data || [];
      setUsers(allUsers.filter((u) => STAFF_ROLES.includes(u.role)));

      setTotalPages(
        res.data.pagination?.totalPages || 1
      );

      setTotalCount(
        res.data.pagination?.totalRecords || 0
      );

    } catch (err) {
      console.error("Fetch users failed:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.accessRoles.getAll();
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

  const handleEdit = (user) => {
    navigate("/school/user-management/Add-user", {
      state: { user },
    });
  };

  const assignRole = async (userId, roleId) => {
    if (!roleId) return;

    setAssigningRole(userId);

    try {
      const selectedRole = roles.find(r => r._id === roleId);

      await api.userManagement.assignRole({
        userId,
        accessRoleId: roleId
      });

      await api.userManagement.updatePermissions({
        userId,
        customPermissions: [],
        removedPermissions: []
      });

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage users and assign roles. Permission overrides available for Staff only.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Search Name
            </label>
            <input
              type="text"
              placeholder="Enter user name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] focus:border-transparent"
            />
          </div>
        </div>
      </div>

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
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {user.fullName}
                  </td>

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

                  <td className="px-5 py-3 text-gray-600">{user.mobile}</td>

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

      <p className="text-xs text-gray-400 mt-3">
        * Permission overrides can only be set for <strong>FitnessStaff</strong> users.
      </p>

      <Pagination
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalCount={totalCount}
        setPage={setPage}
        setLimit={setLimit}
      />
    </div>
  );
}
