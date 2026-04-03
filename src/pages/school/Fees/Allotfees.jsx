  // // pages/school/Fees/AllotFees.jsx

  // import { useState } from 'react';

  // const FEE_ITEMS = [
  //   'Senior Citizen Happiness School (Age 55+)',
  //   'Anand Nivas — Regular Room (Residency)',
  //   'Anand Nivas-Regular Room (AC)(Residency)',
  //   'Anand Nivas — Deluxe Room (Residency)',
  //   'Anand Nivas — Premium Room (Residency)',
  // ];

  // const TYPES         = ['Annual', 'Monthly', 'Weekly', 'Daily'];
  // const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];

  // const initialAllotments = [
  //   { id: 1, participant: 'Ram Kumar', description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, dueDate: '15-09-2025' },
  //   { id: 2, participant: 'Ram Kumar', description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, dueDate: '15-09-2025' },
  //   { id: 3, participant: 'Ram Kumar', description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, dueDate: '15-09-2025' },
  //   { id: 4, participant: 'Ram Kumar', description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, dueDate: '15-09-2025' },
  // ];

  // export default function AllotFees() {
  //   const [allotments, setAllotments] = useState(initialAllotments);

  //   const [form, setForm] = useState({
  //     participant:  '',
  //     feeItem:      FEE_ITEMS[0],
  //     amount:       '',
  //     type:         'Annual',
  //     paymentMode:  'Cash',
  //     dueDate:      '',
  //   });

  //   // Filters
  //   const [filterParticipant, setFilterParticipant] = useState('Raj Sharma');
  //   const [filterType,        setFilterType]        = useState('Daily');

  //   const handleChange = (field, value) =>
  //     setForm((prev) => ({ ...prev, [field]: value }));

  //   const handleSave = () => {
  //     if (!form.participant || !form.amount) return;
  //     setAllotments((prev) => [
  //       ...prev,
  //       {
  //         id:          prev.length + 1,
  //         participant: form.participant,
  //         description: form.feeItem,
  //         type:        form.type,
  //         amount:      Number(form.amount),
  //         dueDate:     form.dueDate || '-',
  //       },
  //     ]);
  //     setForm({ participant: '', feeItem: FEE_ITEMS[0], amount: '', type: 'Annual', paymentMode: 'Cash', dueDate: '' });
  //   };

  //   const handleCancel = () =>
  //     setForm({ participant: '', feeItem: FEE_ITEMS[0], amount: '', type: 'Annual', paymentMode: 'Cash', dueDate: '' });

  //   return (
  //     <div className="space-y-5">

  //       {/* Allot Fees Form */}
  //       <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
  //         {/* Row 1: Participant, Fee Item, Amount, Type, Payment Mode, Due Date */}
  //         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
  //           <div>
  //             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Participant</label>
  //             <input
  //               type="text"
  //               placeholder="Select Participant"
  //               value={form.participant}
  //               onChange={(e) => handleChange('participant', e.target.value)}
  //               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Fee Item</label>
  //             <select
  //               value={form.feeItem}
  //               onChange={(e) => handleChange('feeItem', e.target.value)}
  //               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
  //             >
  //               {FEE_ITEMS.map((f) => <option key={f}>{f}</option>)}
  //             </select>
  //           </div>
  //           <div>
  //             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Amount</label>
  //             <input
  //               type="number"
  //               placeholder="₹ Amount"
  //               value={form.amount}
  //               onChange={(e) => handleChange('amount', e.target.value)}
  //               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Type</label>
  //             <select
  //               value={form.type}
  //               onChange={(e) => handleChange('type', e.target.value)}
  //               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
  //             >
  //               {TYPES.map((t) => <option key={t}>{t}</option>)}
  //             </select>
  //           </div>
  //           <div>
  //             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Mode</label>
  //             <select
  //               value={form.paymentMode}
  //               onChange={(e) => handleChange('paymentMode', e.target.value)}
  //               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
  //             >
  //               {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
  //             </select>
  //           </div>
  //           <div>
  //             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Due Date</label>
  //             <input
  //               type="date"
  //               value={form.dueDate}
  //               onChange={(e) => handleChange('dueDate', e.target.value)}
  //               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
  //             />
  //           </div>
  //         </div>

  //         {/* Save / Cancel */}
  //         <div className="flex justify-end gap-3">
  //           <button
  //             onClick={handleSave}
  //             className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-sm font-semibold px-6 py-2 rounded-md transition-colors"
  //           >
  //             Save
  //           </button>
  //           <button
  //             onClick={handleCancel}
  //             className="border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2 rounded-md hover:bg-gray-50 transition-colors"
  //           >
  //             Cancel
  //           </button>
  //         </div>
  //       </div>

  //       {/* Filters */}
  //       <div className="flex flex-wrap gap-3">
  //         <input
  //           type="text"
  //           value={filterParticipant}
  //           onChange={(e) => setFilterParticipant(e.target.value)}
  //           placeholder="Participant"
  //           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[130px]"
  //         />
  //         <select
  //           value={filterType}
  //           onChange={(e) => setFilterType(e.target.value)}
  //           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
  //         >
  //           {TYPES.map((t) => <option key={t}>{t}</option>)}
  //         </select>
  //       </div>

  //       {/* Allotments Table */}
  //       <div className="overflow-x-auto rounded-lg border border-gray-200">
  //         <table className="w-full min-w-[650px] border-collapse">
  //           <thead>
  //             <tr className="bg-[#1e3a8a]">
  //               {['Participants', 'Description', 'Type', 'Amount', 'Due Date'].map((h) => (
  //                 <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
  //                   {h}
  //                 </th>
  //               ))}
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {allotments.length === 0 ? (
  //               <tr>
  //                 <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
  //                   No allotment records found.
  //                 </td>
  //               </tr>
  //             ) : (
  //               allotments.map((row, idx) => (
  //                 <tr
  //                   key={row.id}
  //                   className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
  //                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
  //                   }`}
  //                 >
  //                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.participant}</td>
  //                   <td className="px-4 py-3 text-sm text-gray-700">{row.description}</td>
  //                   <td className="px-4 py-3 text-sm text-gray-700">{row.type}</td>
  //                   <td className="px-4 py-3 text-sm text-gray-700">{row.amount.toLocaleString()}</td>
  //                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.dueDate}</td>
  //                 </tr>
  //               ))
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   );
  // }




// // pages/school/Fees/AllotFees.jsx

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const FEE_ITEMS = [
//   'Senior Citizen Happiness School (Age 55+)',
//   'Anand Nivas — Regular Room (Residency)',
//   'Anand Nivas-Regular Room (AC)(Residency)',
//   'Anand Nivas — Deluxe Room (Residency)',
//   'Anand Nivas — Premium Room (Residency)',
// ];

// const TYPES         = ['Annual', 'Monthly', 'Weekly', 'Daily'];
// const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];

// const emptyForm = {
//   participant: '',
//   feeItem:     FEE_ITEMS[0],
//   amount:      '',
//   type:        'Annual',
//   paymentMode: 'Cash',
//   dueDate:     '',
// };

// export default function AllotFees({ onSuccess }) {
//   const [allotments, setAllotments] = useState([]);
//   const [loading,    setLoading]    = useState(true);
//   const [saving,     setSaving]     = useState(false);

//   const [form, setForm] = useState(emptyForm);

//   const [filterParticipant, setFilterParticipant] = useState('');
//   const [filterType,        setFilterType]        = useState('');

//   // ── Fetch ────────────────────────────────────────────────────
//   const fetchAllotments = async () => {
//     setLoading(true);
//     try {
//       const res = await api.fees.getAllotments();
//       setAllotments(res.data || []);
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to load fee allotments.';
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchAllotments(); }, []);

//   // ── Handlers ─────────────────────────────────────────────────
//   const handleChange = (field, value) =>
//     setForm((prev) => ({ ...prev, [field]: value }));

//   const handleSave = async () => {
//     // ── Client-side guards ──────────────────────────────────────
//     if (!form.participant.trim()) {
//       toast.error('Participant name is required.');
//       return;
//     }
//     if (!form.amount || Number(form.amount) <= 0) {
//       toast.error('Please enter a valid amount.');
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         participant: form.participant.trim(),
//         description: form.feeItem,
//         feePlan:     form.type,
//         amount:      Number(form.amount),
//         paymentMode: form.paymentMode,
//         dueDate:     form.dueDate || null,
//       };

//       await api.fees.allotFee(payload);
//       toast.success('Fee allotted successfully!');
//       setForm(emptyForm);
//       fetchAllotments();
//       onSuccess?.();
//     } catch (err) {
//       // Surface the exact backend message (duplicate allotment, not found, etc.)
//       const msg = err.response?.data?.message || 'Failed to allot fee. Please try again.';
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => setForm(emptyForm);

//   // ── Filtering ─────────────────────────────────────────────────
//   const filteredAllotments = allotments.filter((row) => {
//     const name = row.studentId?.fullName || row.studentName || row.participant || '';
//     const matchParticipant = !filterParticipant ||
//       name.toLowerCase().includes(filterParticipant.toLowerCase());
//     const matchType = !filterType || row.feePlan === filterType || row.type === filterType;
//     return matchParticipant && matchType;
//   });

//   // ─────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-5">
//       {/* Allot Fees Form */}
//       <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
//         {/* Row 1: Participant, Fee Item, Amount, Type, Payment Mode, Due Date */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Participant</label>
//             <input
//               type="text"
//               placeholder="Select Participant"
//               value={form.participant}
//               onChange={(e) => handleChange('participant', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Fee Item</label>
//             <select
//               value={form.feeItem}
//               onChange={(e) => handleChange('feeItem', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               {FEE_ITEMS.map((f) => (
//                 <option key={f} value={f}>{f}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Amount</label>
//             <input
//               type="number"
//               placeholder="₹ Amount"
//               value={form.amount}
//               onChange={(e) => handleChange('amount', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Type</label>
//             <select
//               value={form.type}
//               onChange={(e) => handleChange('type', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               {TYPES.map((t) => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Mode</label>
//             <select
//               value={form.paymentMode}
//               onChange={(e) => handleChange('paymentMode', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               {PAYMENT_MODES.map((m) => (
//                 <option key={m} value={m}>{m}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Due Date</label>
//             <input
//               type="date"
//               value={form.dueDate}
//               onChange={(e) => handleChange('dueDate', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//         </div>

//         {/* Save / Cancel */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="bg-[#1e3a8a] hover:bg-[#1a2f72] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2 rounded-md transition-colors"
//           >
//             {saving ? 'Saving...' : 'Save'}
//           </button>
//           <button
//             onClick={handleCancel}
//             disabled={saving}
//             className="border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2 rounded-md hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3">
//         <input
//           type="text"
//           value={filterParticipant}
//           onChange={(e) => setFilterParticipant(e.target.value)}
//           placeholder="Participant"
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[130px]"
//         />
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//         >
//           <option value="">All Types</option>
//           {TYPES.map((t) => (
//             <option key={t} value={t}>{t}</option>
//           ))}
//         </select>
//       </div>

//       {/* Allotments Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[650px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               {['Participants', 'Description', 'Type', 'Amount', 'Due Date'].map((h) => (
//                 <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
//                   Loading allotments...
//                 </td>
//               </tr>
//             ) : filteredAllotments.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
//                   No allotment records found.
//                 </td>
//               </tr>
//             ) : (
//               filteredAllotments.map((row, idx) => (
//                 <tr
//                   key={row._id || idx}
//                   className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
//                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
//                   }`}
//                 >
//                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
//                     {row.studentId?.fullName || row.studentName || row.participant}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.description}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.feePlan || row.type}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     ₹{Number(row.amount).toLocaleString('en-IN')}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
//                     {row.dueDate ? new Date(row.dueDate).toLocaleDateString('en-IN') : '-'}
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





// pages/school/Fees/AllotFees.jsx

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const TYPES = ['Annual', 'Monthly', 'Weekly', 'Daily'];
const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];

const emptyForm = {
  studentId: '',
  feeTypeId: '',
  amount: '',
  type: 'Annual',
  paymentMode: 'Cash',
  dueDate: '',
};

export default function AllotFees({ onSuccess }) {
  const [allotments, setAllotments] = useState([]);
  const [students, setStudents] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [filterParticipant, setFilterParticipant] = useState('');
  const [filterType, setFilterType] = useState('');

  // ── Load Data ─────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [studentsRes, feeTypesRes, allotmentsRes] = await Promise.all([
          api.students.getAll(),           // ← Best API
          api.fees.getTypes(),
          api.fees.getAllotments(),
        ]);

        setStudents(studentsRes.data || []);
        setFeeTypes(
          (feeTypesRes.data || []).map((ft) => ({
            value: ft._id,
            label: ft.description,
          }))
        );
        setAllotments(allotmentsRes.data || []);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshAllotments = async () => {
    try {
      const res = await api.fees.getAllotments();
      setAllotments(res.data || []);
    } catch (err) {
      toast.error('Failed to refresh allotments');
    }
  };

  // ── Handlers ─────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStudentSelect = (option) => {
    if (!option) {
      setForm(emptyForm);
      return;
    }
    setForm((prev) => ({ ...prev, studentId: option.value }));
  };

  const handleSave = async () => {
    if (!form.studentId) return toast.error('Please select a student');
    if (!form.feeTypeId) return toast.error('Please select a fee item');
    if (!form.amount || Number(form.amount) <= 0) return toast.error('Valid amount required');

    setSaving(true);
    try {
      const payload = {
        studentId: form.studentId,
        feeTypeId: form.feeTypeId,
        amount: Number(form.amount),
        feePlan: form.type,
        paymentMode: form.paymentMode,
        dueDate: form.dueDate || null,
      };

      await api.fees.allotFee(payload);
      toast.success('Fee allotted successfully!');

      setForm(emptyForm);
      refreshAllotments();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to allot fee');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setForm(emptyForm);

  // Student Options
  const studentOptions = students.map((student) => ({
    value: student._id,
    label: `${student.fullName} ${student.studentId ? `(${student.studentId})` : ''}`,
  }));

  // Filtering
  const filteredAllotments = allotments.filter((row) => {
    const name = row.studentId?.fullName || 'Unknown';
    return (
      (!filterParticipant || name.toLowerCase().includes(filterParticipant.toLowerCase())) &&
      (!filterType || row.feePlan === filterType)
    );
  });

  return (
    <div className="space-y-5">
      <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          
          {/* Student Select */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Participant</label>
            <Select
              options={studentOptions}
              onChange={handleStudentSelect}
              placeholder="Search student..."
              isClearable
              isSearchable
            />
          </div>

          {/* Fee Item */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Fee Item</label>
            <Select
              options={feeTypes}
              value={feeTypes.find((f) => f.value === form.feeTypeId)}
              onChange={(opt) => handleChange('feeTypeId', opt?.value)}
              placeholder="Select fee item..."
              isClearable
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Amount</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="₹ Amount"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Type</label>
            <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Mode</label>
            <select value={form.paymentMode} onChange={(e) => handleChange('paymentMode', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
              {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Due Date</label>
            <input type="date" value={form.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={handleCancel} disabled={saving} className="border border-gray-300 px-5 py-2 rounded-md">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="bg-[#1e3a8a] text-white px-6 py-2 rounded-md hover:bg-[#1a2f72]">
            {saving ? 'Saving...' : 'Allot Fee'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Filter Participant"
          value={filterParticipant}
          onChange={(e) => setFilterParticipant(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[200px]"
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {['Participant', 'Fee Description', 'Type', 'Amount', 'Due Date', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10">Loading...</td></tr>
            ) : filteredAllotments.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No allotments found</td></tr>
            ) : (
              filteredAllotments.map((row, idx) => (
                <tr key={row._id} className={`border-b hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium">{row.studentId?.fullName || 'N/A'}</td>
                  <td className="px-4 py-3">{row.feeTypeId?.description || row.description || '-'}</td>
                  <td className="px-4 py-3">{row.feePlan}</td>
                  <td className="px-4 py-3 font-medium">₹{Number(row.amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">{row.dueDate ? new Date(row.dueDate).toLocaleDateString('en-IN') : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {row.status || 'Pending'}
                    </span>
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