// // pages/school/HealthRecords/HealthRecords.jsx

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const initialRecords = [
//   {
//     id: 1,
//     name: 'Ram',
//     date: '12/01/2026',
//     time: '10:30 AM',
//     doctor: 'Dr. Kulkarni',
//     diagnosis: 'Routine Checkup',
//     status: 'Stable',
//     notes: 'Routine health check-up completed.\nBP and sugar levels are normal.\nNo emergency symptoms observed.',
//     medications: 'BP Tablet, Sugar Tablet',
//     report: 'Medical_Report_Jan_2026.pdf',
//   },
//   {
//     id: 2,
//     name: 'Sham',
//     date: '05/12/2025',
//     time: '06:00 PM',
//     doctor: 'City Hospital',
//     diagnosis: 'BP Fluctuation',
//     status: 'Stable',
//     notes: 'BP fluctuation observed. Advised rest and medication.',
//     medications: 'BP Tablet',
//     report: 'Medical_Report_Dec_2025.pdf',
//   },
//   {
//     id: 3,
//     name: 'Reeena',
//     date: '18/10/2025',
//     time: '11:15 AM',
//     doctor: 'Dr. Mehta',
//     diagnosis: 'Chest Infection',
//     status: 'Critical',
//     notes: 'Chest infection detected. Antibiotics prescribed.',
//     medications: 'Antibiotics, Cough Syrup',
//     report: 'Medical_Report_Oct_2025.pdf',
//   },
// ];

// const STATUS_STYLES = {
//   Stable:   'bg-green-100 text-green-700',
//   Critical: 'bg-red-100  text-red-500',
// };

// export default function HealthRecords() {
//   const navigate = useNavigate();
//   const [search,     setSearch]     = useState('');
//   const [monthFilter, setMonthFilter] = useState('');

//   const filtered = initialRecords.filter((r) => {
//     const matchName = r.name.toLowerCase().includes(search.toLowerCase());
//     return matchName;
//   });

//   return (
//     <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
//         <div>
//           <h1 className="text-xl font-bold text-gray-800 mb-4">Health Records</h1>
//           {/* Filters */}
//           <div className="flex flex-wrap gap-3">
//             <input
//               type="text"
//               placeholder="Search Name"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[160px]"
//             />
//             <input
//               type="month"
//               value={monthFilter}
//               onChange={(e) => setMonthFilter(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//         </div>

//         <button
//           onClick={() => navigate('/school/health-records/add-update')}
//           className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200 whitespace-nowrap self-start"
//         >
//           Add\Update Health Check up
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[700px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               {['Name', 'Date', 'Time', 'Doctor / Clinic', 'Diagnosis', 'Status', 'Reports'].map((h) => (
//                 <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
//                   No health records found.
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((row, idx) => (
//                 <tr
//                   key={row.id}
//                   className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
//                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
//                   }`}
//                 >
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.name}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.date}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.time}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.doctor}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.diagnosis}</td>
//                   <td className="px-4 py-3 text-sm">
//                     <span
//                       className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${
//                         STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-600'
//                       }`}
//                     >
//                       {row.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <button
//                       onClick={() => navigate(`/school/health-records/view/${row.id}`)}
//                       className="text-[#1e3a8a] hover:text-[#1a2f72] font-semibold text-sm underline-offset-2 hover:underline transition-colors"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }









// // pages/school/HealthRecords/HealthRecords.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const STATUS_STYLES = {
//   Stable: 'bg-green-100 text-green-700',
//   Critical: 'bg-red-100 text-red-500',
//   Recovering: 'bg-blue-100 text-blue-700',
//   'Under Observation': 'bg-yellow-100 text-yellow-700',
// };

// export default function HealthRecords() {
//   const navigate = useNavigate();
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [monthFilter, setMonthFilter] = useState('');

//   // Fetch all health records
//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         setLoading(true);
//         const res = await api.healthRecords.getAll();
//         const data = res.data?.data || res.data || [];
//         setRecords(data);
//       } catch (err) {
//         console.error(err);
//         const msg = err.response?.data?.message || "Failed to load health records";
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecords();
//   }, []);

//   const filtered = records.filter((r) => {
//     const nameMatch = r.name.toLowerCase().includes(search.toLowerCase());
//     return nameMatch;
//   });

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this health record?')) return;

//     try {
//       await api.healthRecords.delete(id);
//       setRecords(prev => prev.filter(r => r._id !== id));
//       toast.success("Health record deleted successfully");
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to delete record";
//       toast.error(msg);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-gray-500">Loading health records...</div>;
//   }

//   return (
//     <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
//         <div>
//           <h1 className="text-xl font-bold text-gray-800 mb-4">Health Records</h1>
//           <div className="flex flex-wrap gap-3">
//             <input
//               type="text"
//               placeholder="Search Name"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[160px]"
//             />
//             <input
//               type="month"
//               value={monthFilter}
//               onChange={(e) => setMonthFilter(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//         </div>

//         <button
//           onClick={() => navigate('/school/health-records/add-update')}
//           className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200 whitespace-nowrap self-start"
//         >
//           Add Health Check up
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[700px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               {['Name', 'Date', 'Time', 'Doctor / Clinic', 'Diagnosis', 'Status', 'Reports'].map((h) => (
//                 <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
//                   No health records found.
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((row, idx) => (
//                 <tr
//                   key={row._id}
//                   className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
//                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
//                   }`}
//                 >
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.name}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
//                     {new Date(row.date).toLocaleDateString('en-GB')}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.time}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.doctor}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.diagnosis}</td>
//                   <td className="px-4 py-3 text-sm">
//                     <span
//                       className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${
//                         STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-600'
//                       }`}
//                     >
//                       {row.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <button
//                       onClick={() => navigate(`/school/health-records/view/${row._id}`)}
//                       className="text-[#1e3a8a] hover:text-[#1a2f72] font-semibold text-sm underline-offset-2 hover:underline transition-colors"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }











// pages/school/HealthRecords/HealthRecords.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const STATUS_STYLES = {
  Stable: 'bg-green-100 text-green-700',
  Critical: 'bg-red-100 text-red-500',
  Recovering: 'bg-blue-100 text-blue-700',
  'Under Observation': 'bg-yellow-100 text-yellow-700',
  Normal: 'bg-green-100 text-green-700',
  Recovered: 'bg-blue-100 text-blue-700',
};

export default function HealthRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  // Fetch all health records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const res = await api.healthRecords.getAll();
        const data = res.data?.data || res.data || [];
        setRecords(data);
      } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Failed to load health records";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Fixed filtering with proper field names from backend
  const filtered = records.filter((r) => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return true;

    const studentName = (r.studentName || r.name || '').toLowerCase();
    const recordId = (r.recordId || '').toLowerCase();
    const doctorName = (r.doctorName || r.doctor || '').toLowerCase();
    const diagnosis = (r.diagnosis || '').toLowerCase();

    return (
      studentName.includes(searchTerm) ||
      recordId.includes(searchTerm) ||
      doctorName.includes(searchTerm) ||
      diagnosis.includes(searchTerm)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this health record?')) return;

    try {
      await api.healthRecords.delete(id);
      setRecords(prev => prev.filter(r => r._id !== id));
      toast.success("Health record deleted successfully");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete record";
      toast.error(msg);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading health records...</div>;
  }

  return (
    <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800 mb-4">Health Records</h1>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search Name, Record ID, Doctor or Diagnosis"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[280px]"
            />
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <button
          onClick={() => navigate('/school/health-records/add-update')}
          className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200 whitespace-nowrap self-start"
        >
          Add Health Check up
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {['Name', 'Record ID', 'Date', 'Time', 'Doctor / Clinic', 'Diagnosis', 'Status', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                  No health records found.
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr
                  key={row._id}
                  className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  {/* Name */}
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                    {row.studentName || row.name || 'N/A'}
                  </td>

                  {/* Record ID */}
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                    {row.recordId || '—'}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {row.recordDate 
                      ? new Date(row.recordDate).toLocaleDateString('en-GB')
                      : row.date 
                        ? new Date(row.date).toLocaleDateString('en-GB')
                        : 'N/A'
                    }
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {row.time || '—'}
                  </td>

                  {/* Doctor */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.doctorName || row.doctor || 'N/A'}
                  </td>

                  {/* Diagnosis */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.diagnosis || '—'}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {row.status || 'Normal'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => navigate(`/school/health-records/view/${row._id}`)}
                      className="text-[#1e3a8a] hover:text-[#1a2f72] font-semibold text-sm underline-offset-2 hover:underline transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}