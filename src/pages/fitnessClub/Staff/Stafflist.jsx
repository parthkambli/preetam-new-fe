// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// //import { api } from '../../../services/apiClient';
// //import { api } from '../../../services/api';
// import api from '../../../services/api';

// export default function StaffList() {
//   const navigate = useNavigate();

//   const [staff, setStaff] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [filters, setFilters] = useState({ 
//     search: '', 
//     mobile: '', 
//     role: '', 
//     status: '' 
//   });

//   const updateFilter = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   // Fetch staff with safe data extraction
//   const fetchStaff = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await api.fitnessStaff.getAll();

//       // Debug: Check exact response in browser console
//       console.log("🔍 Full API Response:", response);
//       console.log("🔍 Response.data:", response.data);

//       // Handle common response patterns safely
//       let staffData = [];

//       if (Array.isArray(response.data)) {
//        // staffData = response.data;
//        staffData = response.data?.data?.staff || [];
//       } else if (response.data && Array.isArray(response.data.data)) {
//         staffData = response.data.data;
//       } else if (response.data && Array.isArray(response.data.staff)) {
//         staffData = response.data.staff;
//       } else if (response.data && typeof response.data === 'object') {
//         // Fallback: try to extract any array-like property
//         staffData = Object.values(response.data).find(Array.isArray) || [];
//       }

//       setStaff(staffData);

//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//       setError(
//         err.response?.data?.message || 
//         err.message || 
//         "Failed to load staff data. Please check your connection."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   // Safe filter - always works even if staff is not array
//   const filteredStaff = Array.isArray(staff) 
//     ? staff.filter(s => {
//         const searchMatch = !filters.search || 
//           s.fullName?.toLowerCase().includes(filters.search.toLowerCase());

//         const mobileMatch = !filters.mobile || 
//           s.mobileNumber?.includes(filters.mobile);

//         const roleMatch = !filters.role || String(s.role) === filters.role;
//         const statusMatch = !filters.status || s.status === filters.status;

//         return searchMatch && mobileMatch && roleMatch && statusMatch;
//       })
//     : [];

//   const formatDate = (dateStr) => {
//     if (!dateStr) return '-';
//     return new Date(dateStr).toLocaleDateString('en-GB');
//   };

//   const uniqueRoles = Array.isArray(staff) 
//     ? [...new Set(staff.map(s => s.role).filter(Boolean))]
//     : [];

//   const handleView = (id) => navigate(`/fitness/staff/view/${id}`);
//   const handleEdit = (id) => navigate(`/fitness/staff/view/${id}`, { state: { editMode: true } });

//   return (
//     <div className="space-y-4">
//       {/* Filters */}
//       <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
//         <input
//           type="text"
//           placeholder="Search by Name"
//           value={filters.search}
//           onChange={e => updateFilter('search', e.target.value)}
//           className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         />
//         <input
//           type="text"
//           placeholder="Mobile Number"
//           value={filters.mobile}
//           onChange={e => updateFilter('mobile', e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         />
//         <select
//           value={filters.role}
//           onChange={e => updateFilter('role', e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         >
//           <option value="">All Roles</option>
//           {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
//         </select>
//         <select
//           value={filters.status}
//           onChange={e => updateFilter('status', e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
//         >
//           <option value="">All Status</option>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//           <option value="Terminated">Terminated</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm min-w-[700px]">
//             <thead>
//               <tr className="bg-[#000359] text-white text-left">
//                 {['Employee ID', 'Name', 'Role', 'Mobile', 'Employment Type', 'Joining Date', 'Status', 'Actions'].map(h => (
//                   <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-500">Loading staff data...</td></tr>
//               ) : error ? (
//                 <tr><td colSpan={8} className="px-5 py-10 text-center text-red-500">{error}</td></tr>
//               ) : filteredStaff.length === 0 ? (
//                 <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">No records found</td></tr>
//               ) : (
//                 filteredStaff.map(s => (
//                   <tr key={s._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
//                     <td className="px-4 py-3 text-gray-500 text-xs font-mono whitespace-nowrap">{s.employeeId || '-'}</td>
//                     <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{s.fullName || '-'}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.role || '-'}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.mobileNumber || '-'}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.employmentType || '-'}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(s.joiningDate)}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
//                         s.status === 'Active' 
//                           ? 'bg-green-50 text-green-700 border-green-200'
//                           : s.status === 'Inactive'
//                           ? 'bg-red-50 text-red-600 border-red-200'
//                           : 'bg-gray-100 text-gray-600 border-gray-300'
//                       }`}>
//                         {s.status || 'Unknown'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleView(s._id)}
//                           className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => handleEdit(s._id)}
//                           className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
//                         >
//                           Edit
//                         </button>
//                       </div>
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




import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';           // ← Already imported
import api from '../../../services/api';

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

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.fitnessStaff.getAll();
      const staffData = response.data?.data?.staff || [];
      setStaff(staffData);

    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Failed to load staff data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(s => {
    const searchMatch = !filters.search || 
      s.fullName?.toLowerCase().includes(filters.search.toLowerCase());
    const mobileMatch = !filters.mobile || 
      s.mobileNumber?.includes(filters.mobile);
    const roleMatch = !filters.role || s.role === filters.role;
    const statusMatch = !filters.status || s.status === filters.status;
    return searchMatch && mobileMatch && roleMatch && statusMatch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  const uniqueRoles = [...new Set(staff.map(s => s.role).filter(Boolean))];

  // ==================== DELETE FUNCTION (Updated with Toast Confirmation) ====================
  const handleDelete = async (staffMember) => {
    // Show toast confirmation
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-5 w-80">
            <p className="text-gray-800 font-medium mb-4">
              Are you sure you want to delete <span className="font-semibold">{staffMember.fullName}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  toast.dismiss(t);
                  resolve(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t);
                  resolve(true);
                }}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,   // Keep until user clicks
          position: 'top-center',
        }
      );
    });

    if (!confirmed) return;

    // Proceed with deletion
    try {
      await api.fitnessStaff.delete(staffMember._id);
      toast.success('Staff deleted successfully');
      fetchStaff(); // Refresh list
    } catch (err) {
      toast.error('Failed to delete staff');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters - Unchanged */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search by Name"
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={filters.mobile}
          onChange={e => updateFilter('mobile', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        />
        <select
          value={filters.role}
          onChange={e => updateFilter('role', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        >
          <option value="">All Roles</option>
          {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={filters.status}
          onChange={e => updateFilter('status', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table - Unchanged */}
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                    Loading staff data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredStaff.map(s => (
                  <tr key={s._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono whitespace-nowrap">
                      {s.employeeId || '-'}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {s.fullName || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {s.role || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {s.mobileNumber || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {s.employmentType || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatDate(s.joiningDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        s.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : s.status === 'Inactive'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}>
                        {s.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/fitness/staff/view/${s._id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/fitness/staff/view/${s._id}`, { state: { editMode: true } })}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(s)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
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