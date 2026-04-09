// // pages/school/Fees/AllotFees.jsx

// import { useState } from 'react';

// const FEE_ITEMS = [
//   'Senior Citizen Happiness School (Age 55+)',
//   'Anand Nivas — Regular Room (Residency)',
//   'Anand Nivas-Regular Room (AC)(Residency)',
//   'Anand Nivas — Deluxe Room (Residency)',
//   'Anand Nivas — Premium Room (Residency)',
// ];

// const TYPES         = ['Annual', 'Monthly', 'Weekly', 'Daily', 'Hourly'];
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











// // pages/fitness/Fees/AllotFees.jsx

// import { useState, useEffect } from 'react';
// import Select from 'react-select';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const TYPES = ['Annual', 'Monthly', 'Weekly', 'Daily', 'Hourly'];
// const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];

// const emptyForm = {
//   memberId: '',
//   feeTypeId: '',
//   amount: '',
//   type: 'Monthly',
//   paymentMode: 'Cash',
//   dueDate: '',
// };

// export default function FitnessAllotFees({ onSuccess }) {
//   const [allotments, setAllotments] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [feeTypes, setFeeTypes] = useState([]);        // Full fee types data
//   const [feeTypeOptions, setFeeTypeOptions] = useState([]); // For React Select

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [form, setForm] = useState(emptyForm);
//   const [filterParticipant, setFilterParticipant] = useState('');
//   const [filterType, setFilterType] = useState('');

//   // ── Load Data ─────────────────────────────────────────────────
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const [membersRes, feeTypesRes, allotmentsRes] = await Promise.all([
//           api.fitnessMember.getAll(),
//           api.fitnessFees.getTypes(),
//           api.fitnessFees.getAllotments(),
//         ]);

//         setMembers(membersRes.data || []);

//         const fullFeeTypes = feeTypesRes.data || [];
//         setFeeTypes(fullFeeTypes);

//         setFeeTypeOptions(
//           fullFeeTypes.map((ft) => ({
//             value: ft._id,
//             label: ft.description,
//           }))
//         );

//         setAllotments(allotmentsRes.data || []);
//       } catch (err) {
//         toast.error('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const refreshAllotments = async () => {
//     try {
//       const res = await api.fitnessFees.getAllotments();
//       setAllotments(res.data || []);
//     } catch (err) {
//       toast.error('Failed to refresh allotments');
//     }
//   };

//   // ── Auto-fill Amount when Fee Item or Type changes ─────────────
//   useEffect(() => {
//     if (!form.feeTypeId || !form.type) {
//       return;
//     }

//     const selectedFee = feeTypes.find((ft) => ft._id === form.feeTypeId);
//     if (!selectedFee) return;

//     const fieldMap = {
//       Annual: 'annual',
//       Monthly: 'monthly',
//       Weekly: 'weekly',
//       Daily: 'daily',
//       Hourly: 'hourly',
//     };

//     const amountField = fieldMap[form.type];
//     const autoAmount = selectedFee[amountField] || 0;

//     setForm((prev) => ({ ...prev, amount: autoAmount.toString() }));
//   }, [form.feeTypeId, form.type, feeTypes]);

//   // ── Handlers ─────────────────────────────────────────────────
//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleParticipantSelect = (option) => {
//     if (!option) {
//       setForm(emptyForm);
//       return;
//     }
//     setForm((prev) => ({ ...prev, memberId: option.value }));
//   };

//   const handleFeeTypeSelect = (opt) => {
//     handleChange('feeTypeId', opt?.value || '');
//   };

//   const handleSave = async () => {
//     if (!form.memberId) return toast.error('Please select a participant');
//     if (!form.feeTypeId) return toast.error('Please select a fee item');
//     if (!form.amount || Number(form.amount) <= 0) return toast.error('Valid amount required');

//     setSaving(true);
//     try {
//       const payload = {
//         memberId: form.memberId,
//         feeTypeId: form.feeTypeId,
//         amount: Number(form.amount),
//         feePlan: form.type,
//         paymentMode: form.paymentMode,
//         dueDate: form.dueDate || null,
//       };

//       await api.fitnessFees.allotFee(payload);
//       toast.success('Fitness fee allotted successfully!');

//       setForm(emptyForm);
//       refreshAllotments();
//       onSuccess?.();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to allot fee');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => setForm(emptyForm);

//   // Participant Options
//   const participantOptions = members.map((member) => ({
//     value: member._id,
//     label: `${member.name} `,
//   }));

//   // Filtering
//   const filteredAllotments = allotments.filter((row) => {
//     const name = row.memberId?.fullName || 'Unknown';
//     return (
//       (!filterParticipant || name.toLowerCase().includes(filterParticipant.toLowerCase())) &&
//       (!filterType || row.feePlan === filterType)
//     );
//   });

//   return (
//     <div className="space-y-5">
//       <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">

//           {/* Participant Select */}
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Participant</label>
//             <Select
//               options={participantOptions}
//               onChange={handleParticipantSelect}
//               placeholder="Search participant..."
//               isClearable
//               isSearchable
//             />
//           </div>

//           {/* Fee Item */}
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Fee Item</label>
//             <Select
//               options={feeTypeOptions}
//               value={feeTypeOptions.find((f) => f.value === form.feeTypeId)}
//               onChange={handleFeeTypeSelect}
//               placeholder="Select fee item..."
//               isClearable
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Amount</label>
//             <input
//               type="number"
//               value={form.amount}
//               onChange={(e) => handleChange('amount', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               placeholder="₹ Amount"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Type</label>
//             <select 
//               value={form.type} 
//               onChange={(e) => handleChange('type', e.target.value)} 
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
//             >
//               {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Mode</label>
//             <select value={form.paymentMode} onChange={(e) => handleChange('paymentMode', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
//               {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Due Date</label>
//             <input type="date" value={form.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button onClick={handleCancel} disabled={saving} className="border border-gray-300 px-5 py-2 rounded-md">Cancel</button>
//           <button onClick={handleSave} disabled={saving} className="bg-[#1e3a8a] text-white px-6 py-2 rounded-md hover:bg-[#1a2f72]">
//             {saving ? 'Saving...' : 'Allot Fee'}
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3">
//         <input
//           type="text"
//           placeholder="Filter Participant"
//           value={filterParticipant}
//           onChange={(e) => setFilterParticipant(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[200px]"
//         />
//         <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
//           <option value="">All Types</option>
//           {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[700px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               {['Participant', 'Fee Description', 'Type', 'Amount', 'Due Date', 'Status'].map((h) => (
//                 <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={6} className="text-center py-10">Loading...</td></tr>
//             ) : filteredAllotments.length === 0 ? (
//               <tr><td colSpan={6} className="text-center py-10 text-gray-400">No allotments found</td></tr>
//             ) : (
//               filteredAllotments.map((row, idx) => (
//                 <tr key={row._id} className={`border-b hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                   <td className="px-4 py-3 font-medium">{row.memberId?.name || 'N/A'}</td>
//                   <td className="px-4 py-3">{row.feeTypeId?.description || row.description || '-'}</td>
//                   <td className="px-4 py-3">{row.feePlan}</td>
//                   <td className="px-4 py-3 font-medium">₹{Number(row.amount).toLocaleString('en-IN')}</td>
//                   <td className="px-4 py-3">{row.dueDate ? new Date(row.dueDate).toLocaleDateString('en-IN') : '-'}</td>
//                   <td className="px-4 py-3">
//                     <span className={`px-3 py-1 rounded-full text-xs ${row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
//                       {row.status || 'Pending'}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }\




// New Onee
















// pages/fitness/Fees/AllotFees.jsx

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const TYPES = ['Annual', 'Monthly', 'Weekly', 'Daily', 'Hourly'];
const PAYMENT_MODES = ['Cash', 'Cheque', 'Online', 'UPI'];

const emptyForm = {
  memberId: '',
  feeTypeId: '',
  amount: '',
  type: 'Monthly',
  paymentMode: 'Cash',
  dueDate: '',
  responsibleStaff: '',
};

export default function FitnessAllotFees({ onSuccess }) {
  const [allotments, setAllotments] = useState([]);
  const [members, setMembers] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [feeTypeOptions, setFeeTypeOptions] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [filterParticipant, setFilterParticipant] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [membersRes, feeTypesRes, allotmentsRes, staffRes] = await Promise.all([
          api.fitnessMember.getAll(),
          api.fitnessFees.getTypes(),
          api.fitnessFees.getAllotments(),
          api.fitnessStaff.getAll(),
        ]);

        setMembers(membersRes.data || []);

        const fullFeeTypes = feeTypesRes.data || [];
        setFeeTypes(fullFeeTypes);

        setFeeTypeOptions(
          fullFeeTypes.map((ft) => ({
            value: ft._id,
            label: ft.description,
          }))
        );

        const staffData =
          staffRes?.data?.data?.staff ||
          staffRes?.data?.staff ||
          staffRes?.data?.data ||
          staffRes?.data ||
          [];

        setStaffList(Array.isArray(staffData) ? staffData : []);
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
      const res = await api.fitnessFees.getAllotments();
      setAllotments(res.data || []);
    } catch (err) {
      toast.error('Failed to refresh allotments');
    }
  };

  useEffect(() => {
    if (!form.feeTypeId || !form.type) {
      return;
    }

    const selectedFee = feeTypes.find((ft) => ft._id === form.feeTypeId);
    if (!selectedFee) return;

    const fieldMap = {
      Annual: 'annual',
      Monthly: 'monthly',
      Weekly: 'weekly',
      Daily: 'daily',
      Hourly: 'hourly',
    };

    const amountField = fieldMap[form.type];
    const autoAmount = selectedFee[amountField] || 0;

    setForm((prev) => ({ ...prev, amount: autoAmount.toString() }));
  }, [form.feeTypeId, form.type, feeTypes]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleParticipantSelect = (option) => {
    if (!option) {
      setForm(emptyForm);
      return;
    }
    setForm((prev) => ({ ...prev, memberId: option.value }));
  };

  const handleFeeTypeSelect = (opt) => {
    handleChange('feeTypeId', opt?.value || '');
  };

  const handleSave = async () => {
    if (!form.memberId) return toast.error('Please select a participant');
    if (!form.feeTypeId) return toast.error('Please select a fee item');
    if (!form.amount || Number(form.amount) <= 0) return toast.error('Valid amount required');

    setSaving(true);
    try {
      const payload = {
        memberId: form.memberId,
        feeTypeId: form.feeTypeId,
        amount: Number(form.amount),
        feePlan: form.type,
        paymentMode: form.paymentMode,
        dueDate: form.dueDate || null,
        responsibleStaff: form.responsibleStaff || null,
      };

      await api.fitnessFees.allotFee(payload);
      toast.success('Fitness fee allotted successfully!');

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

  const participantOptions = members.map((member) => ({
    value: member._id,
    label: `${member.name} `,
  }));

  const staffOptions = staffList.map((s) => ({
    value: s._id,
    label: s.fullName || s.name || 'Unnamed',
  }));

  const filteredAllotments = allotments.filter((row) => {
    const name = row.memberId?.fullName || row.memberId?.name || 'Unknown';
    return (
      (!filterParticipant || name.toLowerCase().includes(filterParticipant.toLowerCase())) &&
      (!filterType || row.feePlan === filterType)
    );
  });

  return (
    <div className="space-y-5">
      <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Participant</label>
            <Select
              options={participantOptions}
              onChange={handleParticipantSelect}
              value={participantOptions.find((p) => p.value === form.memberId) || null}
              placeholder="Search participant..."
              isClearable
              isSearchable
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Fee Item</label>
            <Select
              options={feeTypeOptions}
              value={feeTypeOptions.find((f) => f.value === form.feeTypeId) || null}
              onChange={handleFeeTypeSelect}
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
            <select
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Mode</label>
            <select
              value={form.paymentMode}
              onChange={(e) => handleChange('paymentMode', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              {PAYMENT_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Responsible Staff</label>
            <Select
              options={staffOptions}
              value={staffOptions.find((s) => s.value === form.responsibleStaff) || null}
              onChange={(opt) => handleChange('responsibleStaff', opt?.value || '')}
              placeholder="Select staff..."
              isClearable
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="border border-gray-300 px-5 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1e3a8a] text-white px-6 py-2 rounded-md hover:bg-[#1a2f72]"
          >
            {saving ? 'Saving...' : 'Allot Fee'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Filter Participant"
          value={filterParticipant}
          onChange={(e) => setFilterParticipant(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[200px]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {['Participant', 'Fee Description', 'Responsible Staff', 'Type', 'Amount', 'Due Date', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10">Loading...</td>
              </tr>
            ) : filteredAllotments.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">No allotments found</td>
              </tr>
            ) : (
              filteredAllotments.map((row, idx) => (
                <tr
                  key={row._id}
                  className={`border-b hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 font-medium">{row.memberId?.name || row.memberId?.fullName || 'N/A'}</td>
                  <td className="px-4 py-3">{row.feeTypeId?.description || row.description || '-'}</td>
                  <td className="px-4 py-3">
                    {typeof row.responsibleStaff === 'object'
                      ? row.responsibleStaff?.fullName || row.responsibleStaff?.name || '-'
                      : row.responsibleStaff || '-'}
                  </td>
                  <td className="px-4 py-3">{row.feePlan}</td>
                  <td className="px-4 py-3 font-medium">₹{Number(row.amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    {row.dueDate ? new Date(row.dueDate).toLocaleDateString('en-IN') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${row.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
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