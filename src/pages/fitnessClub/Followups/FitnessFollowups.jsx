// import { useState, useEffect } from 'react';
// import { api } from '../../../services/apiClient';

// export default function FitnessFollowups() {
//   const [followups, setFollowups] = useState([]);
//   const [upcomingFollowups, setUpcomingFollowups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     status: '',
//     date: '',
//     search: '',
//   });

//   const [selectedFollowup, setSelectedFollowup] = useState(null);
//   const [remarkForm, setRemarkForm] = useState({
//     remark: '',
//     nextVisit: '',
//     newStatus: 'Follow Up'
//   });

//   useEffect(() => {
//     fetchFollowups();
//     fetchUpcomingFollowups();
//   }, [filters]);

//   const fetchFollowups = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const params = { enquiryType: 'fitness' };  // ← key filter
//       if (filters.status) params.status = filters.status;
//       if (filters.date) params.date = filters.date;
//       if (filters.search) params.search = filters.search;

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
//       const response = await api.followups.getUpcoming({ enquiryType: 'fitness' });
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
//       case 'new':       return 'bg-blue-100 text-blue-700 border border-blue-200';
//       case 'follow Up': return 'bg-yellow-100 text-yellow-800';
//       case 'converted': return 'bg-purple-100 text-purple-700 border border-purple-200';
//       case 'completed': return 'bg-green-100 text-green-700';
//       default:          return 'bg-gray-100 text-gray-800';
//     }
//   };

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
//     setRemarkForm({ remark: '', nextVisit: '', newStatus: 'Follow Up' });
//   };

//   const handleRemarkChange = (e) => {
//     const { name, value } = e.target;
//     setRemarkForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmitRemark = async (e) => {
//     e.preventDefault();
//     if (!selectedFollowup) return;

//     try {
//       await api.followups.create({
//         enquiryType: 'fitness',
//         enquiryId: selectedFollowup.enquiryId,
//         personName: selectedFollowup.personName,
//         mobile: selectedFollowup.mobile,
//         activity: selectedFollowup.activity,
//         newStatus: remarkForm.newStatus,
//         remark: remarkForm.remark.trim(),
//         nextVisit: remarkForm.nextVisit || undefined
//       });

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
//     <div className="p-6 space-y-5">
//       <h1 className="text-xl font-semibold text-gray-800">Follow-Ups</h1>

//       {/* Upcoming Follow-ups */}
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
//       <div className="flex flex-wrap gap-3">
//         <input
//           type="text"
//           placeholder="Search name"
//           className="border border-gray-300 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
//           value={filters.search}
//           onChange={(e) => handleFilterChange('search', e.target.value)}
//         />
//         <input
//           type="date"
//           className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//           value={filters.date}
//           onChange={(e) => handleFilterChange('date', e.target.value)}
//         />
//         <select
//           className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//           value={filters.status}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="New">New</option>
//           <option value="Follow Up">Follow-up</option>
//           <option value="Converted">Converted</option>
//         </select>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500 text-sm">Loading...</div>
//       ) : error ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-red-600 text-sm">{error}</div>
//       ) : followups.length === 0 ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500 text-sm">No records found</div>
//       ) : (
//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-200 bg-gray-300 text-gray-600 font-semibold text-left">
//                   <th className="px-5 py-3">Name</th>
//                   <th className="px-5 py-3">Enquiry Date</th>
//                   <th className="px-5 py-3">Next Visit Date</th>
//                   <th className="px-5 py-3">Remark</th>
//                   <th className="px-5 py-3">Status</th>
//                   <th className="px-5 py-3">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {followups.map((fp) => (
//                   <tr key={fp._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                     <td className="px-5 py-3 font-medium text-gray-800">{fp.personName}</td>
//                     <td className="px-5 py-3 text-gray-600">
//                       {new Date(fp.followupDate).toLocaleDateString('en-CA')}
//                     </td>
//                     <td className="px-5 py-3 text-gray-600">
//                       {fp.nextVisit ? new Date(fp.nextVisit).toLocaleDateString('en-CA') : '—'}
//                     </td>
//                     <td className="px-5 py-3 text-gray-600 max-w-xs truncate" title={fp.remark || ''}>
//                       {fp.remark || '—'}
//                     </td>
//                     <td className="px-5 py-3">
//                       <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(fp.newStatus)}`}>
//                         {fp.newStatus || 'New'}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3">
//                       <button
//                         onClick={() => openRemarkModal(fp)}
//                         className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors"
//                       >
//                         Update
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Update Modal */}
//       {selectedFollowup && (
//         <div className="fixed inset-0 bg-white/40 backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Add Follow Up for {selectedFollowup.personName}
//               </h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">
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
//                   className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Called today... interested in morning batch..."
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Next Visit</label>
//                   <input
//                     type="date"
//                     name="nextVisit"
//                     value={remarkForm.nextVisit}
//                     onChange={handleRemarkChange}
//                     className="w-full border rounded px-3 py-2 text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     name="newStatus"
//                     value={remarkForm.newStatus}
//                     onChange={handleRemarkChange}
//                     className="w-full border rounded px-3 py-2 text-sm"
//                   >
//                     <option value="New">New</option>
//                     <option value="Follow Up">Follow-up</option>
//                     <option value="Converted">Converted</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 text-sm bg-[#000359] text-white rounded-lg hover:bg-[#000280]"
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





// import { useState, useEffect } from 'react';
// import { api } from '../../../services/apiClient';

// export default function FitnessFollowups() {
//   const [followups, setFollowups] = useState([]);
//   const [upcomingFollowups, setUpcomingFollowups] = useState([]);
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [filters, setFilters] = useState({
//     status: '',
//     date: '',
//     search: '',
//   });

//   const [selectedFollowup, setSelectedFollowup] = useState(null);
//   const [remarkForm, setRemarkForm] = useState({
//     remark: '',
//     nextVisit: '',
//     newStatus: 'Follow Up',
//     activity: ''
//   });

//   // Fetch data
//   useEffect(() => {
//     fetchFollowups();
//     fetchUpcomingFollowups();
//     fetchActivities();
//   }, [filters]);

//   const fetchActivities = async () => {
//     try {
//       let res;
//       try {
//         res = await api.fitnessActivities.getAll();
//       } catch (e) {
//         res = await api.activities.getAll();
//       }
//       const activityData = res?.data?.data || res?.data || [];
//       setActivities(Array.isArray(activityData) ? activityData : []);
//     } catch (err) {
//       console.error("Failed to load activities:", err);
//       setActivities([]);
//     }
//   };

//   // const fetchFollowups = async () => {
//   //   setLoading(true);
//   //   setError('');
//   //   try {
//   //     const params = { enquiryType: 'fitness' };
//   //     if (filters.status) params.status = filters.status;
//   //     if (filters.date) params.date = filters.date;
//   //     if (filters.search) params.search = filters.search;

//   //     const response = await api.followups.getAll(params);
//   //     setFollowups(response.data?.data || response.data || []);
//   //   } catch (err) {
//   //     setError('Failed to load followups');
//   //     console.error(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchFollowups = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const params = { enquiryType: 'fitness' };

//       if (filters.status) params.status = filters.status;
//       if (filters.search) params.search = filters.search;

//       // ❌ date backend ko mat bhejo
//       // if (filters.date) params.date = filters.date;

//       const response = await api.followups.getAll(params);

//       let data = response.data?.data || response.data || [];

//       // ✅ FRONTEND FILTER (Next Visit Date)
//       if (filters.date) {
//         data = data.filter(fp => {
//           if (!fp.nextVisit) return false;

//           const nextDate = new Date(fp.nextVisit)
//             .toISOString()
//             .split('T')[0];

//           return nextDate === filters.date;
//         });
//       }

//       setFollowups(data);

//     } catch (err) {
//       setError('Failed to load followups');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const fetchUpcomingFollowups = async () => {
//     try {
//       const response = await api.followups.getUpcoming({ enquiryType: 'fitness' });
//       setUpcomingFollowups(response.data?.data || response.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'new': return 'bg-blue-100 text-blue-700 border border-blue-200';
//       case 'follow up': return 'bg-yellow-100 text-yellow-800';
//       case 'converted': return 'bg-purple-100 text-purple-700 border border-purple-200';
//       case 'completed': return 'bg-green-100 text-green-700';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const openRemarkModal = (fp) => {
//   const today = new Date().toISOString().split('T')[0];
//   const existingNextVisit = fp.nextVisit
//     ? new Date(fp.nextVisit).toISOString().split('T')[0]
//     : '';

//   setSelectedFollowup(fp);
//   setRemarkForm({
//     remark: fp.remark || '',
//     nextVisit: existingNextVisit && existingNextVisit >= today ? existingNextVisit : '',
//     newStatus: fp.newStatus || 'Follow Up',
//     activity: fp.activity || ''
//   });
// };

//   const closeModal = () => {
//     setSelectedFollowup(null);
//     setRemarkForm({ remark: '', nextVisit: '', newStatus: 'Follow Up', activity: '' });
//   };

//   const handleRemarkChange = (e) => {
//     const { name, value } = e.target;
//     setRemarkForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmitRemark = async (e) => {
//     e.preventDefault();
//     if (!selectedFollowup) return;

//     try {
//       await api.followups.create({
//         enquiryType: 'fitness',
//         enquiryId: selectedFollowup.enquiryId,
//         personName: selectedFollowup.personName,
//         mobile: selectedFollowup.mobile,
//         activity: remarkForm.activity,
//         newStatus: remarkForm.newStatus,
//         remark: remarkForm.remark.trim(),
//         nextVisit: remarkForm.nextVisit || undefined
//       });

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
//     <div className="p-6 space-y-5">
//       <h1 className="text-xl font-semibold text-gray-800">Fitness Follow-Ups</h1>

//       {/* Upcoming Follow-ups */}
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
//       <div className="flex flex-wrap gap-3">
//         <input
//           type="text"
//           placeholder="Search name"
//           className="border border-gray-300 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
//           value={filters.search}
//           onChange={(e) => handleFilterChange('search', e.target.value)}
//         />
//         {/* <input
//           type="date"
//           className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//           onChange={handleRemarkChange}
//           min={new Date().toISOString().split('T')[0]}
//         /> */}
//         <input
//           type="date"
//           className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//           value={filters.date}
//           onChange={(e) => handleFilterChange('date', e.target.value)}
//         />
//         <select
//           className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//           value={filters.status}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="New">New</option>
//           <option value="Follow Up">Follow-up</option>
//           <option value="Converted">Converted</option>
//         </select>
//       </div>

//       {/* Main Table */}
//       {loading ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500 text-sm">Loading...</div>
//       ) : error ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-red-600 text-sm">{error}</div>
//       ) : followups.length === 0 ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500 text-sm">No records found</div>
//       ) : (
//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-200 bg-gray-300 text-gray-600 font-semibold text-left">
//                   <th className="px-5 py-3">Name</th>
//                   <th className="px-5 py-3">Enquiry Date</th>
//                   <th className="px-5 py-3">Next Visit Date</th>
//                   <th className="px-5 py-3">Activity</th>
//                   <th className="px-5 py-3">Remark</th>
//                   <th className="px-5 py-3">Status</th>
//                   <th className="px-5 py-3">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {followups.map((fp) => (
//                   <tr key={fp._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                     <td className="px-5 py-3 font-medium text-gray-800">{fp.personName}</td>
//                     <td className="px-5 py-3 text-gray-600">
//                       {new Date(fp.followupDate || fp.createdAt).toLocaleDateString('en-CA')}
//                     </td>
//                     <td className="px-5 py-3 text-gray-600">
//                       {fp.nextVisit ? new Date(fp.nextVisit).toLocaleDateString('en-CA') : '—'}
//                     </td>

//                     {/* Activity Column - Plain & Clean */}
//                     <td className="px-5 py-3 text-gray-600">
//                       {fp.activity || '—'}
//                     </td>

//                     <td className="px-5 py-3 text-gray-600 max-w-xs truncate" title={fp.remark || ''}>
//                       {fp.remark || '—'}
//                     </td>
//                     <td className="px-5 py-3">
//                       <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(fp.newStatus)}`}>
//                         {fp.newStatus || 'New'}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3">
//                       <button
//                         onClick={() => openRemarkModal(fp)}
//                         className="bg-[#000359] hover:bg-[#000280] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors"
//                       >
//                         Update
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Update Modal */}
//       {selectedFollowup && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Add Follow Up for {selectedFollowup.personName}
//               </h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">
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
//                   className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Called today... interested in morning batch..."
//                   required
//                 />
//               </div>

//               {/* Activity Dropdown - Plain */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
//                 <select
//                   name="activity"
//                   value={remarkForm.activity}
//                   onChange={handleRemarkChange}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//                 >
//                   <option value="">Select Activity</option>
//                   {activities.map((act) => (
//                     <option key={act._id} value={act.name}>
//                       {act.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Next Visit</label>
//                   <input
//                     type="date"
//                     name="nextVisit"
//                     value={remarkForm.nextVisit}
//                     onChange={handleRemarkChange}
//                      min={new Date().toISOString().split('T')[0]}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     name="newStatus"
//                     value={remarkForm.newStatus}
//                     onChange={handleRemarkChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                   >
//                     {/* <option value="New">New</option> */}
//                     <option value="Follow Up">Follow-up</option>
//                     <option value="Converted">Converted</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 text-sm bg-[#000359] text-white rounded-lg hover:bg-[#000280]"
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

export default function FitnessFollowups() {
  const [followups, setFollowups] = useState([]);
  const [upcomingFollowups, setUpcomingFollowups] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    fromDate: '',
    toDate: '',
    search: '',
  });

  const [selectedFollowup, setSelectedFollowup] = useState(null);
  const [remarkForm, setRemarkForm] = useState({
    remark: '',
    nextVisit: '',
    newStatus: 'Follow Up',
    activity: ''
  });

  // Fetch data
  useEffect(() => {
    fetchFollowups();
    fetchUpcomingFollowups();
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      let res;
      try {
        res = await api.fitnessActivities.getAll();
      } catch (e) {
        res = await api.activities.getAll();
      }
      const activityData = res?.data?.data || res?.data || [];
      setActivities(Array.isArray(activityData) ? activityData : []);
    } catch (err) {
      console.error("Failed to load activities:", err);
      setActivities([]);
    }
  };

  const fetchFollowups = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { enquiryType: 'fitness' };

      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      // ❌ date backend ko mat bhejo
      // if (filters.date) params.date = filters.date;

      const response = await api.followups.getAll(params);

      let data = response.data?.data || response.data || [];

      // ✅ FRONTEND FILTER — Date Range (Next Visit Date)
      if (filters.fromDate || filters.toDate) {
        data = data.filter(fp => {
          if (!fp.nextVisit) return false;

          const nextDate = new Date(fp.nextVisit).toISOString().split('T')[0];

          if (filters.fromDate && filters.toDate) {
            return nextDate >= filters.fromDate && nextDate <= filters.toDate;
          } else if (filters.fromDate) {
            return nextDate >= filters.fromDate;
          } else if (filters.toDate) {
            return nextDate <= filters.toDate;
          }
          return true;
        });
      }

      setFollowups(data);

    } catch (err) {
      setError('Failed to load followups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingFollowups = async () => {
    try {
      const response = await api.followups.getUpcoming({ enquiryType: 'fitness' });
      setUpcomingFollowups(response.data?.data || response.data || []);
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
      case 'follow up': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openRemarkModal = (fp) => {
    const today = new Date().toISOString().split('T')[0];
    const existingNextVisit = fp.nextVisit
      ? new Date(fp.nextVisit).toISOString().split('T')[0]
      : '';

    setSelectedFollowup(fp);
    setRemarkForm({
      remark: fp.remark || '',
      nextVisit: existingNextVisit && existingNextVisit >= today ? existingNextVisit : '',
      newStatus: fp.newStatus || 'Follow Up',
      activity: fp.activity || ''
    });
  };

  const closeModal = () => {
    setSelectedFollowup(null);
    setRemarkForm({ remark: '', nextVisit: '', newStatus: 'Follow Up', activity: '' });
  };

  const handleRemarkChange = (e) => {
    const { name, value } = e.target;
    setRemarkForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRemark = async (e) => {
    e.preventDefault();
    if (!selectedFollowup) return;

    try {
      await api.followups.create({
        enquiryType: 'fitness',
        enquiryId: selectedFollowup.enquiryId,
        personName: selectedFollowup.personName,
        mobile: selectedFollowup.mobile,
        activity: remarkForm.activity,
        newStatus: remarkForm.newStatus,
        remark: remarkForm.remark.trim(),
        nextVisit: remarkForm.nextVisit || undefined
      });

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
      <h1 className="text-xl font-semibold text-gray-800">Fitness Follow-Ups</h1>

      {/* Upcoming Follow-ups */}
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name"
          className="border border-gray-300 rounded px-3 py-2 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />

        {/* ✅ Date Range Filter — From */}
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={filters.fromDate}
          max={filters.toDate || undefined}
          onChange={(e) => handleFilterChange('fromDate', e.target.value)}
          title="From Date"
        />

        {/* ✅ Date Range Filter — To */}
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={filters.toDate}
          min={filters.fromDate || undefined}
          onChange={(e) => handleFilterChange('toDate', e.target.value)}
          title="To Date"
        />

        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Follow Up">Follow-up</option>
          <option value="Converted">Converted</option>
        </select>
      </div>

      {/* Main Table */}
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
                  <th className="px-5 py-3">Activity</th>
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
                      {new Date(fp.followupDate || fp.createdAt).toLocaleDateString('en-CA')}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {fp.nextVisit ? new Date(fp.nextVisit).toLocaleDateString('en-CA') : '—'}
                    </td>

                    {/* Activity Column - Plain & Clean */}
                    <td className="px-5 py-3 text-gray-600">
                      {fp.activity || '—'}
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

      {/* Update Modal */}
      {selectedFollowup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Add Follow Up for {selectedFollowup.personName}
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

              {/* Activity Dropdown - Plain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                <select
                  name="activity"
                  value={remarkForm.activity}
                  onChange={handleRemarkChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="">Select Activity</option>
                  {activities.map((act) => (
                    <option key={act._id} value={act.name}>
                      {act.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Visit</label>
                  <input
                    type="date"
                    name="nextVisit"
                    value={remarkForm.nextVisit}
                    onChange={handleRemarkChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="newStatus"
                    value={remarkForm.newStatus}
                    onChange={handleRemarkChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    {/* <option value="New">New</option> */}
                    <option value="Follow Up">Follow-up</option>
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
                  className="px-5 py-2 text-sm bg-[#000359] text-white rounded-lg hover:bg-[#000280]"
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