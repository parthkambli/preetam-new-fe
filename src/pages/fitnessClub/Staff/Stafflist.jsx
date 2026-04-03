
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyStaff = [
  { _id: '1', employeeId: 'EMP-00123', name: 'Suresh Patil',  role: 'Caregiver', mobile: '9876543210', employmentType: 'Full Time', joiningDate: '2024-03-15', status: 'Active'   },
  { _id: '2', employeeId: 'EMP-00124', name: 'Anita Desai',   role: 'Nurse',     mobile: '9123456789', employmentType: 'Full Time', joiningDate: '2023-06-01', status: 'Active'   },
  { _id: '3', employeeId: 'EMP-00125', name: 'Rohit Sharma',  role: 'Trainer',   mobile: '9988776655', employmentType: 'Part Time', joiningDate: '2025-01-10', status: 'Inactive' },
  { _id: '4', employeeId: 'EMP-00126', name: 'Meena Joshi',   role: 'Teacher',   mobile: '9012345678', employmentType: 'Contract',  joiningDate: '2024-08-20', status: 'Active'   },
];

export default function StaffList() {
  const navigate = useNavigate();
  const [staff]   = useState(dummyStaff);
  const [filters, setFilters] = useState({ search: '', mobile: '', role: '', status: '' });

  const set = (key, val) => setFilters(p => ({ ...p, [key]: val }));

  const filtered = staff.filter(s =>
    (!filters.search || s.name.toLowerCase().includes(filters.search.toLowerCase())) &&
    (!filters.mobile || s.mobile.includes(filters.mobile)) &&
    (!filters.role   || s.role === filters.role) &&
    (!filters.status || s.status === filters.status)
  );

  const fmt = (d) => new Date(d).toLocaleDateString('en-GB');
  const uniqueRoles = [...new Set(staff.map(s => s.role))];

  const handleView = (id) => {
    navigate(`/fitness/staff/view/${id}`);
  };

  const handleEdit = (id) => {
    // Navigate to the same detail route but pass editMode: true via location state
    navigate(`/fitness/staff/view/${id}`, { state: { editMode: true } });
  };

  return (
    <div className="space-y-4">

      {/* Filters */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        <input
          type="text" placeholder="Search Name"
          value={filters.search} onChange={e => set('search', e.target.value)}
          className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <input
          type="text" placeholder="Mobile Number"
          value={filters.mobile} onChange={e => set('mobile', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <select
          value={filters.role} onChange={e => set('role', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        >
          <option value="">All Roles</option>
          {uniqueRoles.map(r => <option key={r}>{r}</option>)}
        </select>
        <select
          value={filters.status} onChange={e => set('status', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400">No records found</td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono whitespace-nowrap">{s.employeeId}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.role}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.mobile}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.employmentType}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmt(s.joiningDate)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      s.status === 'Active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {s.status}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}