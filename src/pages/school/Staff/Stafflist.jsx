// pages/school/Staff/StaffList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

export default function StaffList() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    mobile: '',
    role: '',
    status: ''
  });

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.search) params.name = filters.search;
      if (filters.mobile) params.mobile = filters.mobile;
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;

      const response = await api.staff.getAll(params);
      
      // Handle different possible response shapes from backend
      let staffData = [];
      if (Array.isArray(response.data)) {
        staffData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        staffData = response.data.data;
      } else if (response.data?.staff && Array.isArray(response.data.staff)) {
        staffData = response.data.staff;
      }

      setStaff(staffData);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
      const errorMsg = err.response?.data?.message || "Failed to load staff list. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when component mounts or filters change
  useEffect(() => {
    fetchStaff();
  }, [filters]);

  const handleView = (id) => navigate(`/school/staff/view/${id}`);
  const handleEdit = (id) => navigate(`/school/staff/view/${id}`, { state: { editMode: true } });

  // Safe value extractor - prevents object rendering error
  const getValue = (value) => {
    if (!value) return '—';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value.name || value.title || JSON.stringify(value).slice(0, 30);
    }
    return String(value);
  };

  const fmtDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB');
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading staff list...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Staff List</h2>

      {/* Filters - UI unchanged */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search Name"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={filters.mobile}
          onChange={(e) => setFilter('mobile', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <select
          value={filters.role}
          onChange={(e) => setFilter('role', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        >
          <option value="">All Roles</option>
          {/* You can later populate this dynamically */}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table - UI unchanged */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-[#000359] text-white text-left">
                {['Employee ID', 'Name', 'Role', 'Mobile', 'Employment Type', 'Joining Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400">
                    No staff records found
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono whitespace-nowrap">
                      {getValue(s.employeeId)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {getValue(s.fullName)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {getValue(s.role)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {getValue(s.mobile)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {getValue(s.employmentType)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {fmtDate(s.joiningDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        s.status === 'Active' || s.status?.name === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {getValue(s.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(s._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(s._id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                        >
                          Edit
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