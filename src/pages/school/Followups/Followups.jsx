// import { useState, useEffect } from 'react';
// import { api } from '../../../services/apiClient';

// export default function Followups() {
//   const [followups, setFollowups] = useState([]);
//   const [upcomingFollowups, setUpcomingFollowups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     status: '',
//     date: '',
//     search: '',
//     enquiryType: ''
//   });

//   useEffect(() => {
//     fetchFollowups();
//     fetchUpcomingFollowups();
//   }, [filters]);

//   const fetchFollowups = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const params = {};
//       if (filters.status) params.status = filters.status;
//       if (filters.date) params.date = filters.date;
//       if (filters.search) params.search = filters.search;
//       if (filters.enquiryType) params.enquiryType = filters.enquiryType;
      
//       const response = await api.followups.getAll(params);
//       setFollowups(response.data);
//     } catch (err) {
//       setError('Failed to load followups');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUpcomingFollowups = async () => {
//     try {
//       const response = await api.followups.getUpcoming();
//       setUpcomingFollowups(response.data);
//     } catch (err) {
//       console.error('Failed to fetch upcoming followups:', err);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'New': return 'bg-blue-100 text-blue-800';
//       case 'Follow-up': return 'bg-yellow-100 text-yellow-800';
//       case 'Converted': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Follow-ups</h1>
//       </div>

//       {/* Upcoming Followups Summary */}
//       {upcomingFollowups.length > 0 && (
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Follow-ups</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {upcomingFollowups.slice(0, 3).map((fp, idx) => (
//               <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
//                 <p className="font-medium text-gray-800">{fp.personName}</p>
//                 <p className="text-sm text-gray-600">{fp.mobile}</p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Next: {fp.nextVisit ? new Date(fp.nextVisit).toLocaleDateString() : 'Not set'}
//                 </p>
//                 <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(fp.newStatus)}`}>
//                   {fp.newStatus}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4">
//         <input
//           type="text"
//           placeholder="Search Name / Mobile"
//           className="border rounded px-4 py-2.5 flex-1 min-w-[220px]"
//           value={filters.search}
//           onChange={(e) => handleFilterChange('search', e.target.value)}
//         />
//         <select 
//           className="border rounded px-4 py-2.5 min-w-[160px]"
//           value={filters.status}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option>New</option>
//           <option>Follow-up</option>
//           <option>Converted</option>
//         </select>
//         <select 
//           className="border rounded px-4 py-2.5 min-w-[160px]"
//           value={filters.enquiryType}
//           onChange={(e) => handleFilterChange('enquiryType', e.target.value)}
//         >
//           <option value="">All Types</option>
//           <option value="school">School</option>
//           <option value="fitness">Fitness</option>
//         </select>
//         <input 
//           type="date" 
//           className="border rounded px-4 py-2.5"
//           value={filters.date}
//           onChange={(e) => handleFilterChange('date', e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">Loading...</div>
//       ) : error ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-red-500">{error}</div>
//       ) : followups.length === 0 ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No followups found</div>
//       ) : (
//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-max">
//               <thead className="bg-[#000359] text-white">
//                 <tr>
//                   <th className="p-4 text-left">Date</th>
//                   <th className="p-4 text-left">Person Name</th>
//                   <th className="p-4 text-left">Mobile</th>
//                   <th className="p-4 text-left">Type</th>
//                   <th className="p-4 text-left">Activity</th>
//                   <th className="p-4 text-left">Previous Status</th>
//                   <th className="p-4 text-left">New Status</th>
//                   <th className="p-4 text-left">Remark</th>
//                   <th className="p-4 text-left">Next Visit</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {followups.map((fp) => (
//                   <tr key={fp._id} className="border-t hover:bg-gray-50">
//                     <td className="p-4">{new Date(fp.followupDate).toLocaleDateString()}</td>
//                     <td className="p-4 font-medium">{fp.personName}</td>
//                     <td className="p-4">{fp.mobile}</td>
//                     <td className="p-4">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${
//                         fp.enquiryType === 'school' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
//                       }`}>
//                         {fp.enquiryType === 'school' ? 'School' : 'Fitness'}
//                       </span>
//                     </td>
//                     <td className="p-4">{fp.activity || '-'}</td>
//                     <td className="p-4">
//                       {fp.previousStatus ? (
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(fp.previousStatus)}`}>
//                           {fp.previousStatus}
//                         </span>
//                       ) : '-'}
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(fp.newStatus)}`}>
//                         {fp.newStatus}
//                       </span>
//                     </td>
//                     <td className="p-4 max-w-xs truncate" title={fp.remark}>{fp.remark}</td>
//                     <td className="p-4">{fp.nextVisit ? new Date(fp.nextVisit).toLocaleDateString() : '-'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useState, useEffect } from 'react';
// import { api } from '../../../services/apiClient';

// export default function Followups() {
//   const [followups, setFollowups] = useState([]);
//   const [upcomingFollowups, setUpcomingFollowups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     status: '',
//     date: '',
//     search: '',
//     enquiryType: ''
//   });

//   // Modal state for per-row follow-up update
//   const [selectedFollowup, setSelectedFollowup] = useState(null);
//   const [remarkForm, setRemarkForm] = useState({
//     remark: '',
//     nextVisit: '',
//     newStatus: 'Follow-up'
//   });

//   useEffect(() => {
//     fetchFollowups();
//     fetchUpcomingFollowups();
//   }, [filters]);

//   const fetchFollowups = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const params = {};
//       if (filters.status) params.status = filters.status;
//       if (filters.date) params.date = filters.date;
//       if (filters.search) params.search = filters.search;
//       if (filters.enquiryType) params.enquiryType = filters.enquiryType;

//       const response = await api.followups.getAll(params);
//       setFollowups(response.data);
//     } catch (err) {
//       setError('Failed to load followups');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUpcomingFollowups = async () => {
//     try {
//       const response = await api.followups.getUpcoming();
//       setUpcomingFollowups(response.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'new': return 'bg-blue-100 text-blue-800';
//       case 'follow-up': return 'bg-yellow-100 text-yellow-800';
//       case 'converted': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // ── Open modal for a specific row ──
//   const openRemarkModal = (fp) => {
//     setSelectedFollowup(fp);
//     setRemarkForm({
//       remark: fp.remark || '',
//       nextVisit: fp.nextVisit ? new Date(fp.nextVisit).toISOString().split('T')[0] : '',
//       newStatus: fp.newStatus || 'Follow-up'
//     });
//   };

//   const closeModal = () => {
//     setSelectedFollowup(null);
//     setRemarkForm({ remark: '', nextVisit: '', newStatus: 'Follow-up' });
//   };

//   const handleRemarkChange = (e) => {
//     const { name, value } = e.target;
//     setRemarkForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmitRemark = async (e) => {
//     e.preventDefault();
//     if (!selectedFollowup) return;

//     try {
//       // Prepare payload for creating a new followup record
//       const payload = {
//         enquiryType: selectedFollowup.enquiryType,
//         enquiryId: selectedFollowup.enquiryId,
//         personName: selectedFollowup.personName,
//         mobile: selectedFollowup.mobile,
//         activity: selectedFollowup.activity,
//         newStatus: remarkForm.newStatus,
//         remark: remarkForm.remark.trim(),
//         nextVisit: remarkForm.nextVisit || undefined
//       };

//       // Create followup (this also updates the related enquiry)
//       await api.followups.create(payload);

//       alert('Follow-up updated successfully!');
//       closeModal();
//       fetchFollowups();
//       fetchUpcomingFollowups();
//     } catch (err) {
//       console.error('Error saving follow-up:', err);
//       alert(err.response?.data?.message || 'Failed to save follow-up');
//     }
//   };

//   return (
//     <div className="space-y-6 p-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Follow-ups</h1>
//       </div>

//       {/* Upcoming cards - same as before */}
//       {upcomingFollowups.length > 0 && (
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6">
//           <h2 className="text-lg font-semibold mb-4">Upcoming Follow-ups</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {upcomingFollowups.slice(0, 3).map((fp, i) => (
//               <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
//                 <p className="font-medium">{fp.personName}</p>
//                 <p className="text-sm text-gray-600">{fp.mobile}</p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Next: {fp.nextVisit ? new Date(fp.nextVisit).toLocaleDateString() : '—'}
//                 </p>
//                 <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(fp.newStatus)}`}>
//                   {fp.newStatus}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4">
//         <input
//           type="text"
//           placeholder="Search Name / Mobile"
//           className="border rounded px-4 py-2.5 flex-1 min-w-[220px]"
//           value={filters.search}
//           onChange={(e) => handleFilterChange('search', e.target.value)}
//         />
//         <select
//           className="border rounded px-4 py-2.5 min-w-[160px]"
//           value={filters.status}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option>New</option>
//           <option>Follow-up</option>
//           <option>Converted</option>
//         </select>
//         <select
//           className="border rounded px-4 py-2.5 min-w-[160px]"
//           value={filters.enquiryType}
//           onChange={(e) => handleFilterChange('enquiryType', e.target.value)}
//         >
//           <option value="">All Types</option>
//           <option value="school">School</option>
//           <option value="fitness">Fitness</option>
//         </select>
//         <input
//           type="date"
//           className="border rounded px-4 py-2.5"
//           value={filters.date}
//           onChange={(e) => handleFilterChange('date', e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center">Loading...</div>
//       ) : error ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-red-600">{error}</div>
//       ) : followups.length === 0 ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No records found</div>
//       ) : (
//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-max">
//               <thead className="bg-[#000359] text-white">
//                 <tr>
//                   <th className="p-4 text-left">Date</th>
//                   <th className="p-4 text-left">Name</th>
//                   <th className="p-4 text-left">Mobile</th>
//                   {/* <th className="p-4 text-left">Type</th> */}
//                   <th className="p-4 text-left">Activity</th>
//                   <th className="p-4 text-left">Last Remark</th>
//                   <th className="p-4 text-left">Next Visit</th>
//                   <th className="p-4 text-left">Status</th>
//                   <th className="p-4 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {followups.map((fp) => (
//                   <tr key={fp._id} className="border-t hover:bg-gray-50">
//                     <td className="p-4">{new Date(fp.followupDate).toLocaleDateString()}</td>
//                     <td className="p-4 font-medium">{fp.personName}</td>
//                     <td className="p-4">{fp.mobile}</td>
//                     {/* <td className="p-4">
//                       <span className={`px-2 py-1 text-xs rounded ${
//                         fp.enquiryType === 'school' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
//                       }`}>
//                         {fp.enquiryType === 'school' ? 'School' : 'Fitness'}
//                       </span>
//                     </td> */}
//                     <td className="p-4">{fp.activity || '—'}</td>
//                     <td className="p-4 max-w-xs truncate" title={fp.remark || ''}>
//                       {fp.remark || '—'}
//                     </td>
//                     <td className="p-4">
//                       {fp.nextVisit ? new Date(fp.nextVisit).toLocaleDateString() : '—'}
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-2 py-1 text-xs rounded ${getStatusColor(fp.newStatus)}`}>
//                         {fp.newStatus || 'New'}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <button
//                         onClick={() => openRemarkModal(fp)}
//                         className="text-indigo-600 hover:text-indigo-800 font-medium"
//                       >
//                         + Follow-up
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Small Per-Row Modal */}
//       {selectedFollowup && (
//         <div className="fixed inset-0 bg-white/40 backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Add Follow-up for {selectedFollowup.personName}
//               </h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-2xl">
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmitRemark} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Remark / Conversation Note
//                 </label>
//                 <textarea
//                   name="remark"
//                   value={remarkForm.remark}
//                   onChange={handleRemarkChange}
//                   rows={4}
//                   className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Called today... interested in morning batch..."
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Next Visit
//                   </label>
//                   <input
//                     type="date"
//                     name="nextVisit"
//                     value={remarkForm.nextVisit}
//                     onChange={handleRemarkChange}
//                     className="w-full border rounded px-3 py-2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Status
//                   </label>
//                   <select
//                     name="newStatus"
//                     value={remarkForm.newStatus}
//                     onChange={handleRemarkChange}
//                     className="w-full border rounded px-3 py-2"
//                   >
//                     <option value="New">New</option>
//                     <option value="Follow-up">Follow-up</option>
//                     <option value="Converted">Converted</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                 >
//                   Submit Follow-up
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









import { useState, useEffect } from 'react';
import { api } from '../../../services/apiClient';

export default function Followups() {
  const [followups, setFollowups] = useState([]);
  const [upcomingFollowups, setUpcomingFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: '',
    enquiryType: ''
  });

  // Modal state for per-row follow-up update
  const [selectedFollowup, setSelectedFollowup] = useState(null);
  const [remarkForm, setRemarkForm] = useState({
    remark: '',
    nextVisit: '',
    newStatus: 'Follow-up'
  });

  useEffect(() => {
    fetchFollowups();
    fetchUpcomingFollowups();
  }, [filters]);

  const fetchFollowups = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      if (filters.search) params.search = filters.search;
      if (filters.enquiryType) params.enquiryType = filters.enquiryType;

      const response = await api.followups.getAll(params);
      setFollowups(response.data);
    } catch (err) {
      setError('Failed to load followups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingFollowups = async () => {
    try {
      const response = await api.followups.getUpcoming();
      setUpcomingFollowups(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ── Open modal for a specific row ──
  const openRemarkModal = (fp) => {
    setSelectedFollowup(fp);
    setRemarkForm({
      remark: fp.remark || '',
      nextVisit: fp.nextVisit ? new Date(fp.nextVisit).toISOString().split('T')[0] : '',
      newStatus: fp.newStatus || 'Follow-up'
    });
  };

  const closeModal = () => {
    setSelectedFollowup(null);
    setRemarkForm({ remark: '', nextVisit: '', newStatus: 'Follow-up' });
  };

  const handleRemarkChange = (e) => {
    const { name, value } = e.target;
    setRemarkForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRemark = async (e) => {
    e.preventDefault();
    if (!selectedFollowup) return;

    try {
      const payload = {
        enquiryType: selectedFollowup.enquiryType,
        enquiryId: selectedFollowup.enquiryId,
        personName: selectedFollowup.personName,
        mobile: selectedFollowup.mobile,
        activity: selectedFollowup.activity,
        newStatus: remarkForm.newStatus,
        remark: remarkForm.remark.trim(),
        nextVisit: remarkForm.nextVisit || undefined
      };

      await api.followups.create(payload);

      alert('Follow-up updated successfully!');
      closeModal();
      fetchFollowups();
      fetchUpcomingFollowups();
    } catch (err) {
      console.error('Error saving follow-up:', err);
      alert(err.response?.data?.message || 'Failed to save follow-up');
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-800">Follow-Ups</h1>

      {/* Upcoming Follow-ups cards */}
      {upcomingFollowups.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Follow-ups</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingFollowups.slice(0, 3).map((fp, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium">{fp.personName}</p>
                <p className="text-sm text-gray-600">{fp.mobile}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Next: {fp.nextVisit ? new Date(fp.nextVisit).toLocaleDateString() : '—'}
                </p>
                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(fp.newStatus)}`}>
                  {fp.newStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters — matches image: search, date, status */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name"
          className="border border-gray-300 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={filters.date}
          onChange={(e) => handleFilterChange('date', e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          {/* <option value="New">New</option> */}
          <option value="Follow Up">Follow-up</option>
          <option value="Converted">Converted</option>
          {/* <option value="Pending">Pending</option> */}
          {/* <option value="Completed">Completed</option> */}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500 text-sm">Loading...</div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-red-600 text-sm">{error}</div>
      ) : followups.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500 text-sm">No records found</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-300 text-gray-600 font-semibold text-left">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Enquiry Date</th>
                  <th className="px-5 py-3">Next Visit Date</th>
                  <th className="px-5 py-3">Remark</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {followups.map((fp) => (
                  <tr key={fp._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{fp.personName}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {new Date(fp.followupDate).toLocaleDateString('en-CA')}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {fp.nextVisit ? new Date(fp.nextVisit).toLocaleDateString('en-CA') : '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs truncate" title={fp.remark || ''}>
                      {fp.remark || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(fp.newStatus)}`}>
                        {fp.newStatus || 'New'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openRemarkModal(fp)}
                        className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Per-Row Modal */}
      {selectedFollowup && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Add Follow-up for {selectedFollowup.personName}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitRemark} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remark / Conversation Note
                </label>
                <textarea
                  name="remark"
                  value={remarkForm.remark}
                  onChange={handleRemarkChange}
                  rows={4}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Called today... interested in morning batch..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Visit</label>
                  <input
                    type="date"
                    name="nextVisit"
                    value={remarkForm.nextVisit}
                    onChange={handleRemarkChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="newStatus"
                    value={remarkForm.newStatus}
                    onChange={handleRemarkChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    {/* <option value="New">New</option> */}
                    <option value="Follow-up">Follow-up</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Submit Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}