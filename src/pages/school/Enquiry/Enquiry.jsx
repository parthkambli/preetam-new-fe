// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { api } from '../../../services/apiClient';

// // Must match SchoolEnquiry model enum exactly
// const VALID_STATUSES = ['New', 'Follow Up', 'Converted', 'Admitted'];

// export default function SchoolEnquiry() {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({ status: '', source: '', search: '' });
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//   const [remark, setRemark] = useState('');
//   const [newStatus, setNewStatus] = useState('Follow Up');
//   const [nextVisit, setNextVisit] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => { fetchEnquiries(); }, [filters]);

//   const fetchEnquiries = async () => {
//     setLoading(true); setError('');
//     try {
//       const params = {};
//       if (filters.status) params.status = filters.status;
//       if (filters.source) params.source = filters.source;
//       if (filters.search) params.search = filters.search;
//       const response = await api.schoolEnquiry.getAll(params);
//       setEnquiries(response.data);
//     } catch (err) {
//       setError('Failed to load enquiries');
//     } finally { setLoading(false); }
//   };

//   const handleAddRemark = (enquiry) => {
//     setSelectedEnquiry(enquiry);
//     setRemark(enquiry.remark || '');
//     setNewStatus(VALID_STATUSES.includes(enquiry.status) ? enquiry.status : 'Follow Up');
//     setNextVisit(enquiry.nextVisit ? enquiry.nextVisit.split('T')[0] : '');
//   };

//   const submitRemark = async () => {
//     if (!remark.trim()) { alert('Please enter a remark'); return; }
//     setSubmitting(true);
//     try {
//       await api.followups.create({
//         enquiryType: 'school',
//         enquiryId: selectedEnquiry._id,
//         personName: selectedEnquiry.name,
//         mobile: selectedEnquiry.contact,
//         activity: selectedEnquiry.activity,
//         newStatus, remark,
//         nextVisit: nextVisit || null
//       });
//       alert('Follow-up added successfully!');
//       setSelectedEnquiry(null);
//       fetchEnquiries();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to add follow-up');
//     } finally { setSubmitting(false); }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const statusBadge = (status) => {
//     const map = {
//       'New':       'bg-blue-100 text-blue-700 border border-blue-200',
//       'Follow Up': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
//       'Converted': 'bg-purple-100 text-purple-700 border border-purple-200',
//       'Admitted':  'bg-green-100 text-green-700 border border-green-200',
//     };
//     return map[status] || 'bg-gray-100 text-gray-600 border border-gray-200';
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Enquiry</h1>
//         <Link
//           to="/school/enquiry/add"
//           className="bg-[#000359] text-white px-6 py-2.5 rounded-lg hover:bg-[#00047a] font-semibold text-sm transition"
//         >
//           Add Enquiry
//         </Link>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//         {/* Filters */}
//         <div className="p-4 flex gap-3 border-b border-gray-100">
//           <select
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value)}
//           >
//             <option value="">All Status</option>
//             {VALID_STATUSES.map(s => (
//               <option key={s} value={s}>{s}</option>
//             ))}
//           </select>

//           <select
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
//             value={filters.source}
//             onChange={(e) => handleFilterChange('source', e.target.value)}
//           >
//             <option value="">All Sources</option>
//             <option>Walk-in</option>
//             <option>App</option>
//             <option>Call</option>
//             <option>Website</option>
//             <option>Reference</option>
//           </select>

//           <input
//             type="text"
//             placeholder="Search name or mobile"
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
//             value={filters.search}
//             onChange={(e) => handleFilterChange('search', e.target.value)}
//           />
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="p-10 text-center text-gray-400 text-sm">Loading...</div>
//         ) : error ? (
//           <div className="p-10 text-center text-red-500 text-sm">{error}</div>
//         ) : enquiries.length === 0 ? (
//           <div className="p-10 text-center text-gray-400 text-sm">No enquiries found</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   {['Name','Age','Gender','Mobile','Activity','Source','Status','Date','Follow-Up Remark','Action'].map(h => (
//                     <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {enquiries.map((enq) => (
//                   <tr key={enq._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
//                     <td className="px-4 py-3 font-medium text-gray-800">{enq.name}</td>
//                     <td className="px-4 py-3 text-gray-600">{enq.age || '-'}</td>
//                     <td className="px-4 py-3 text-gray-600">{enq.gender}</td>
//                     <td className="px-4 py-3 text-gray-600">{enq.contact}</td>
//                     <td className="px-4 py-3 text-gray-600">{enq.activity || '-'}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{enq.source}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center ${statusBadge(enq.status)}`}>
//                         {enq.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-gray-600">{new Date(enq.date).toLocaleDateString()}</td>
//                     <td className="px-4 py-3 text-gray-500 max-w-45 truncate">
//                       {enq.remark || '-'}
//                     </td>
//                     <td className="px-4 py-3">
//                       {enq.status !== 'Admitted' && (
//                         <button
//                           onClick={() => handleAddRemark(enq)}
//                           className="bg-[#000359] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#00047a] transition whitespace-nowrap"
//                         >
//                           Add Remark
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Follow-up Modal */}
//       {selectedEnquiry && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-base font-bold text-gray-800">Add Follow UP \ Remark :</h3>
//               <button
//                 onClick={() => setSelectedEnquiry(null)}
//                 className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl leading-none"
//               >×</button>
//             </div>

//             <div className="space-y-4">
//               <select
//                 value={newStatus}
//                 onChange={(e) => setNewStatus(e.target.value)}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//               >
//                 {/* Exclude Admitted — set automatically via the admission flow */}
//                 {VALID_STATUSES.filter(s => s !== 'Admitted').map(s => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </select>

//               <textarea
//                 value={remark}
//                 onChange={(e) => setRemark(e.target.value)}
//                 rows={3}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
//                 placeholder=""
//               />

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Next Visit Date (Optional) :
//                 </label>
//                 <input
//                   type="date"
//                   value={nextVisit}
//                   onChange={(e) => setNextVisit(e.target.value)}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-center mt-5">
//               <button
//                 onClick={submitRemark}
//                 className="px-10 py-2.5 bg-[#000359] text-white rounded-lg text-sm font-semibold hover:bg-[#00047a] transition disabled:opacity-50"
//                 disabled={submitting}
//               >
//                 {submitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { api } from '../../../services/apiClient';

// export default function SchoolEnquiry() {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({ status: '', source: '', search: '' });
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//   const [remark, setRemark] = useState('');
//   const [newStatus, setNewStatus] = useState('Follow Up');
//   const [nextVisit, setNextVisit] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => { fetchEnquiries(); }, [filters]);

//   const fetchEnquiries = async () => {
//     setLoading(true); setError('');
//     try {
//       const params = {};
//       if (filters.status) params.status = filters.status;
//       if (filters.source) params.source = filters.source;
//       if (filters.search) params.search = filters.search;
//       const response = await api.schoolEnquiry.getAll(params);
//       setEnquiries(response.data);
//     } catch (err) {
//       setError('Failed to load enquiries');
//     } finally { setLoading(false); }
//   };

//   const handleAddRemark = (enquiry) => {
//     setSelectedEnquiry(enquiry);
//     setRemark(enquiry.remark || '');
//     setNewStatus(enquiry.status === 'Follow-up' ? 'Follow Up' : enquiry.status);
//     setNextVisit(enquiry.nextVisit ? enquiry.nextVisit.split('T')[0] : '');
//   };

//   const submitRemark = async () => {
//     if (!remark.trim()) { alert('Please enter a remark'); return; }
//     setSubmitting(true);
//     try {
//       await api.followups.create({
//         enquiryType: 'school',
//         enquiryId: selectedEnquiry._id,
//         personName: selectedEnquiry.name,
//         mobile: selectedEnquiry.contact,
//         activity: selectedEnquiry.activity,
//         newStatus, remark,
//         nextVisit: nextVisit || null
//       });
//       alert('Follow-up added successfully!');
//       setSelectedEnquiry(null);
//       fetchEnquiries();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to add follow-up');
//     } finally { setSubmitting(false); }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const statusBadge = (status) => {
//     const map = {
//       'New':        'bg-blue-100 text-blue-700 border border-blue-200',
//       'Follow Up':  'bg-yellow-100 text-yellow-700 border border-yellow-200',
//       'Follow-up':  'bg-yellow-100 text-yellow-700 border border-yellow-200',
//       'Converted':  'bg-purple-100 text-purple-700 border border-purple-200',
//       'Admitted':   'bg-green-100 text-green-700 border border-green-200',
//     };
//     return map[status] || 'bg-gray-100 text-gray-600 border border-gray-200';
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Enquiry</h1>
//         <Link
//           to="/school/enquiry/add"
//           className="bg-[#000359] text-white px-6 py-2.5 rounded-lg hover:bg-[#00047a] font-semibold text-sm transition"
//         >
//           Add Enquiry
//         </Link>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//         {/* Filters */}
//         <div className="p-4 flex gap-3 border-b border-gray-100">
//           <select
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value === 'Follow-up' ? 'Follow Up' : e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option>New</option>
//             <option>Follow-up</option>
//             <option>Converted</option>
//           </select>

//           <select
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
//             value={filters.source}
//             onChange={(e) => handleFilterChange('source', e.target.value)}
//           >
//             <option value="">All Sources</option>
//             <option>Walk-in</option>
//             <option>App</option>
//             <option>Call</option>
//             <option>Website</option>
//             <option>Reference</option>
//           </select>

//           <input
//             type="text"
//             placeholder="Search name or mobile"
//             className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
//             value={filters.search}
//             onChange={(e) => handleFilterChange('search', e.target.value)}
//           />
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="p-10 text-center text-gray-400 text-sm">Loading...</div>
//         ) : error ? (
//           <div className="p-10 text-center text-red-500 text-sm">{error}</div>
//         ) : enquiries.length === 0 ? (
//           <div className="p-10 text-center text-gray-400 text-sm">No enquiries found</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   {['Name','Age','Gender','Mobile','Activity','Source','Status','Date','Follow-Up Remark','Action'].map(h => (
//                     <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {enquiries.map((enq) => (
//                   <tr key={enq._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
//                     <td className="px-4 py-3 font-medium text-gray-800">{enq.name}</td>
//                     <td className="px-4 py-3 text-gray-600">{enq.age || '-'}</td>
//                     <td className="px-4 py-3 text-gray-600">{enq.gender}</td>
//                     <td className="px-4 py-3 text-gray-600">{enq.contact}</td>
//                     <td className="px-4 py-3 text-gray-600">{enq.activity || '-'}</td>
//                     <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
//                       {enq.source}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center ${statusBadge(enq.status)}`}>
//                         {enq.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-gray-600">{new Date(enq.date).toLocaleDateString()}</td>
//                     <td className="px-4 py-3 text-gray-500 max-w-45 truncate">
//                       {enq.remark || '-'}
//                     </td>
//                     <td className="px-4 py-3">
//                       {enq.status !== 'Admitted' && (
//                         <button
//                           onClick={() => handleAddRemark(enq)}
//                           className="bg-[#000359] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#00047a] transition whitespace-nowrap"
//                         >
//                           Add Remark
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Follow-up Modal */}
//       {selectedEnquiry && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-base font-bold text-gray-800">Add Follow UP \ Remark :</h3>
//               <button
//                 onClick={() => setSelectedEnquiry(null)}
//                 className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl leading-none"
//               >×</button>
//             </div>

//             <div className="space-y-4">
//               {/* Hidden status — still functional for converting */}
//               <select
//                 value={newStatus}
//                 onChange={(e) => setNewStatus(e.target.value)}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//               >
//                 {/* <option>New</option> */}
//                 <option>Follow Up</option>
//                 <option>Converted</option>
//               </select>

//               <textarea
//                 value={remark}
//                 onChange={(e) => setRemark(e.target.value)}
//                 rows={3}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
//                 placeholder=""
//               />

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Next Visit Date (Optional) :
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={nextVisit}
//                     onChange={(e) => setNextVisit(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-center mt-5">
//               <button
//                 onClick={submitRemark}
//                 className="px-10 py-2.5 bg-[#000359] text-white rounded-lg text-sm font-semibold hover:bg-[#00047a] transition disabled:opacity-50"
//                 disabled={submitting}
//               >
//                 {submitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/apiClient';

// Must match SchoolEnquiry model enum exactly
const VALID_STATUSES = ['New', 'Follow Up', 'Converted', 'Admitted'];

export default function SchoolEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', source: '', search: '' });
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [remark, setRemark] = useState('');
  const [newStatus, setNewStatus] = useState('Follow Up');
  const [nextVisit, setNextVisit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ==================== NEW: Activity Options ====================
  const [activityOptions, setActivityOptions] = useState([]);

  // Fetch Activities for Dropdown
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.activities.getAll();
        const acts = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const options = acts.map(act => act.name || act.title);
        setActivityOptions(options);
      } catch (err) {
        console.error("Failed to load activities");
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => { fetchEnquiries(); }, [filters]);

  const fetchEnquiries = async () => {
    setLoading(true); setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (filters.search) params.search = filters.search;

      // ==================== NEW: Added Activity & Date Filter ====================
      if (filters.activity) params.activity = filters.activity;
      if (filters.date) params.date = filters.date;

      const response = await api.schoolEnquiry.getAll(params);
      setEnquiries(response.data);
    } catch (err) {
      setError('Failed to load enquiries');
    } finally { setLoading(false); }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddRemark = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setRemark(enquiry.remark || '');
    setNewStatus(VALID_STATUSES.includes(enquiry.status) ? enquiry.status : 'Follow Up');
    setNextVisit(enquiry.nextVisit ? enquiry.nextVisit.split('T')[0] : '');
  };

  const submitRemark = async () => {
    if (!remark.trim()) { alert('Please enter a remark'); return; }
    setSubmitting(true);
    try {
      await api.followups.create({
        enquiryType: 'school',
        enquiryId: selectedEnquiry._id,
        personName: selectedEnquiry.name,
        mobile: selectedEnquiry.contact,
        activity: selectedEnquiry.activity,
        newStatus, remark,
        nextVisit: nextVisit || null
      });
      alert('Follow-up added successfully!');
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add follow-up');
    } finally { setSubmitting(false); }
  };

  const statusBadge = (status) => {
    const map = {
      'New':       'bg-blue-100 text-blue-700 border border-blue-200',
      'Follow Up': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      'Converted': 'bg-purple-100 text-purple-700 border border-purple-200',
      'Admitted':  'bg-green-100 text-green-700 border border-green-200',
    };
    return map[status] || 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header - Unchanged */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enquiry</h1>
        <Link
          to="/school/enquiry/add"
          className="bg-[#000359] text-white px-6 py-2.5 rounded-lg hover:bg-[#00047a] font-semibold text-sm transition"
        >
          Add Enquiry
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Filters - Only added two new dropdowns */}
        <div className="p-4 flex gap-3 border-b border-gray-100">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            {VALID_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
          >
            <option value="">All Sources</option>
            <option>Walk-in</option>
            <option>App</option>
            <option>Call</option>
            <option>Website</option>
            <option>Reference</option>
          </select>

          {/* ==================== NEW: Activity Filter ==================== */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
            value={filters.activity || ''}
            onChange={(e) => handleFilterChange('activity', e.target.value)}
          >
            <option value="">All Activities</option>
            {activityOptions.map((act, index) => (
              <option key={index} value={act}>{act}</option>
            ))}
          </select>

          {/* ==================== NEW: Date Filter ==================== */}
          {/* ==================== Date Filter (Fixed - Only 4 digit year) ==================== */}
<input
  type="date"
  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
  value={filters.date || ''}
  onChange={(e) => handleFilterChange('date', e.target.value)}
  min="2020-01-01"     // ← Change if needed
  max="2030-12-31"     // ← Change if needed
/>

          <input
            type="text"
            placeholder="Search name or mobile"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Rest of your code (Table + Modal) - Completely Unchanged */}
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading...</div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 text-sm">{error}</div>
        ) : enquiries.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No enquiries found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Name','Age','Gender','Mobile','Activity','Source','Status','Date','Follow-Up Remark','Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{enq.name}</td>
                    <td className="px-4 py-3 text-gray-600">{enq.age || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{enq.gender}</td>
                    <td className="px-4 py-3 text-gray-600">{enq.contact}</td>
                    <td className="px-4 py-3 text-gray-600">{enq.activity || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{enq.source}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center ${statusBadge(enq.status)}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{new Date(enq.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-45 truncate">
                      {enq.remark || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {enq.status !== 'Admitted' && (
                        <button
                          onClick={() => handleAddRemark(enq)}
                          className="bg-[#000359] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#00047a] transition whitespace-nowrap"
                        >
                          Add Remark
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Follow-up Modal - Unchanged */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-800">Add Follow UP \ Remark :</h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl leading-none"
              >×</button>
            </div>

            <div className="space-y-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {VALID_STATUSES.filter(s => s !== 'Admitted').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                placeholder=""
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Next Visit Date (Optional) :
                </label>
                <input
                  type="date"
                  value={nextVisit}
                  onChange={(e) => setNextVisit(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <button
                onClick={submitRemark}
                className="px-10 py-2.5 bg-[#000359] text-white rounded-lg text-sm font-semibold hover:bg-[#00047a] transition disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}