// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { api } from '../../../services/apiClient';

// export default function SchoolEnquiry() {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     status: '',
//     source: '',
//     search: ''
//   });
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//   const [remark, setRemark] = useState('');
//   const [newStatus, setNewStatus] = useState('Follow Up');
//   const [nextVisit, setNextVisit] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchEnquiries();
//   }, [filters]);

//   const fetchEnquiries = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const params = {};
//       if (filters.status) params.status = filters.status;
//       if (filters.source) params.source = filters.source;
//       if (filters.search) params.search = filters.search;
      
//       const response = await api.schoolEnquiry.getAll(params);
//       setEnquiries(response.data);
//     } catch (err) {
//       setError('Failed to load enquiries');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddRemark = (enquiry) => {
//     setSelectedEnquiry(enquiry);
//     setRemark(enquiry.remark || '');
//     // Normalize status: convert 'Follow-up' to 'Follow Up' to match backend enum
//     const normalizedStatus = enquiry.status === 'Follow-up' ? 'Follow Up' : enquiry.status;
//     setNewStatus(normalizedStatus);
//     setNextVisit(enquiry.nextVisit ? enquiry.nextVisit.split('T')[0] : '');
//   };

//   const submitRemark = async () => {
//     if (!remark.trim()) {
//       alert('Please enter a remark');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await api.followups.create({
//         enquiryType: 'school',
//         enquiryId: selectedEnquiry._id,
//         personName: selectedEnquiry.name,
//         mobile: selectedEnquiry.contact,
//         activity: selectedEnquiry.activity,
//         newStatus,
//         remark,
//         nextVisit: nextVisit || null
//       });
//       alert('Follow-up added successfully!');
//       setSelectedEnquiry(null);
//       fetchEnquiries();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to add follow-up');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Enquiry</h1>
//         <Link
//           to="/school/enquiry/add"
//           className="bg-[#000359] text-white px-6 py-2 rounded-lg hover:bg-blue-900"
//         >
//           Add Enquiry
//         </Link>
//       </div>

//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="p-4 border-b flex gap-4 flex-wrap">
//           <select 
//             className="border rounded px-3 py-2"
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value === 'Follow-up' ? 'Follow Up' : e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option>New</option>
//             <option>Follow-up</option>
//             <option>Converted</option>
//           </select>
//           <select 
//             className="border rounded px-3 py-2"
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
//             className="border rounded px-4 py-2 flex-1 min-w-[200px]"
//             value={filters.search}
//             onChange={(e) => handleFilterChange('search', e.target.value)}
//           />
//         </div>

//         {loading ? (
//           <div className="p-8 text-center text-gray-500">Loading...</div>
//         ) : error ? (
//           <div className="p-8 text-center text-red-500">{error}</div>
//         ) : enquiries.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">No enquiries found</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="p-4 text-left">Enquiry ID</th>
//                   <th className="p-4 text-left">Name</th>
//                   <th className="p-4 text-left">Age</th>
//                   <th className="p-4 text-left">Gender</th>
//                   <th className="p-4 text-left">Mobile</th>
//                   <th className="p-4 text-left">Activity</th>
//                   <th className="p-4 text-left">Source</th>
//                   <th className="p-4 text-left">Status</th>
//                   <th className="p-4 text-left">Date</th>
//                   <th className="p-4 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {enquiries.map((enq) => (
//                   <tr key={enq._id} className="border-t hover:bg-gray-50">
//                     <td className="p-4 font-mono text-sm">{enq.enquiryId || '-'}</td>
//                     <td className="p-4">{enq.name}</td>
//                     <td className="p-4">{enq.age || '-'}</td>
//                     <td className="p-4">{enq.gender}</td>
//                     <td className="p-4">{enq.contact}</td>
//                     <td className="p-4">{enq.activity || '-'}</td>
//                     <td className="p-4">{enq.source}</td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-full text-sm ${
//                         enq.status === 'New' ? 'bg-blue-100 text-blue-800' :
//                         enq.status === 'Follow Up' || enq.status === 'Follow-up' ? 'bg-yellow-100 text-yellow-800' :
//                         enq.status === 'Converted' ? 'bg-purple-100 text-purple-800' :
//                         enq.status === 'Admitted' ? 'bg-green-100 text-green-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {enq.status}
//                       </span>
//                     </td>
//                     <td className="p-4">{new Date(enq.date).toLocaleDateString()}</td>
//                     <td className="p-4">
//                       {enq.status !== 'Admitted' && (
//                         <button
//                           className="text-blue-600 hover:underline font-medium"
//                           onClick={() => handleAddRemark(enq)}
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

//       {/* Follow-up Remark Modal */}
//       {selectedEnquiry && (
//         <div className="fixed inset-0 bg-white/40 backdrop:backdrop-blur-md   flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-bold text-gray-800">Add Follow-up Remark</h3>
//               <button onClick={() => setSelectedEnquiry(null)} className="text-gray-500 hover:text-gray-900 text-2xl">×</button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Person: <span className="font-medium text-gray-800">{selectedEnquiry.name}</span></p>
//                 <p className="text-sm text-gray-600">Mobile: <span className="font-medium text-gray-800">{selectedEnquiry.contact}</span></p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
//                 <select
//                   value={newStatus}
//                   onChange={(e) => setNewStatus(e.target.value)}
//                   className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 >
//                   <option>New</option>
//                   <option>Follow Up</option>
//                   <option>Converted</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter Follow UP / Remark:</label>
//                 <textarea
//                   value={remark}
//                   onChange={(e) => setRemark(e.target.value)}
//                   rows={3}
//                   className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                   placeholder="Write remark here..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Next Visit Date (Optional):</label>
//                 <input
//                   type="date"
//                   value={nextVisit}
//                   onChange={(e) => setNextVisit(e.target.value)}
//                   className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-4 mt-8">
//               <button
//                 onClick={() => setSelectedEnquiry(null)}
//                 className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 disabled={submitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitRemark}
//                 className="px-8 py-2.5 bg-[#000359] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
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

  useEffect(() => { fetchEnquiries(); }, [filters]);

  const fetchEnquiries = async () => {
    setLoading(true); setError('');
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (filters.search) params.search = filters.search;
      const response = await api.schoolEnquiry.getAll(params);
      setEnquiries(response.data);
    } catch (err) {
      setError('Failed to load enquiries');
    } finally { setLoading(false); }
  };

  const handleAddRemark = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setRemark(enquiry.remark || '');
    setNewStatus(enquiry.status === 'Follow-up' ? 'Follow Up' : enquiry.status);
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const statusBadge = (status) => {
    const map = {
      'New':        'bg-blue-100 text-blue-700 border border-blue-200',
      'Follow Up':  'bg-yellow-100 text-yellow-700 border border-yellow-200',
      'Follow-up':  'bg-yellow-100 text-yellow-700 border border-yellow-200',
      'Converted':  'bg-purple-100 text-purple-700 border border-purple-200',
      'Admitted':   'bg-green-100 text-green-700 border border-green-200',
    };
    return map[status] || 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
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
        {/* Filters */}
        <div className="p-4 flex gap-3 border-b border-gray-100">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value === 'Follow-up' ? 'Follow Up' : e.target.value)}
          >
            <option value="">All Status</option>
            <option>New</option>
            <option>Follow-up</option>
            <option>Converted</option>
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

          <input
            type="text"
            placeholder="Search name or mobile"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 flex-1"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Table */}
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
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {enq.source}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center ${statusBadge(enq.status)}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{new Date(enq.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">
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

      {/* Follow-up Modal */}
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
              {/* Hidden status — still functional for converting */}
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {/* <option>New</option> */}
                <option>Follow Up</option>
                <option>Converted</option>
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
                <div className="relative">
                  <input
                    type="date"
                    value={nextVisit}
                    onChange={(e) => setNextVisit(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
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