// // pages/school/Fees/AddPayments.jsx

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
// const STATUS_OPTS   = ['All', 'Paid', 'Unpaid'];

// const initialPayments = [
//   { id: 1, participant: 'Ram Kumar',    description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, status: 'Paid',   paidDate: '15-09-2025', paymentMode: 'Cash'  },
//   { id: 2, participant: 'Ram Kumar',    description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, status: 'Paid',   paidDate: '15-09-2025', paymentMode: 'Cash'  },
//   { id: 3, participant: 'Ram Kumar',    description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, status: 'Paid',   paidDate: '15-09-2025', paymentMode: 'Cash'  },
//   { id: 4, participant: 'Ram Kumar',    description: 'Senior Citizen Happiness School (Age 55+)', type: 'Annual', amount: 36000, status: 'Paid',   paidDate: '15-09-2025', paymentMode: 'Cash'  },
// ];

// export default function AddPayments() {
//   const [payments, setPayments] = useState(initialPayments);

//   // Form state
//   const [form, setForm] = useState({
//     participant:   '',
//     feeItem:       FEE_ITEMS[0],
//     amount:        '',
//     type:          'Annual',
//     paymentMode:   'Cash',
//     paymentDate:   '',
//   });

//   // Filter state
//   const [filterParticipant, setFilterParticipant] = useState('Raj Sharma');
//   const [filterType,        setFilterType]        = useState('Daily');
//   const [filterStatus,      setFilterStatus]      = useState('Paid');
//   const [filterMode,        setFilterMode]        = useState('Cash');
//   const [filterMonth,       setFilterMonth]       = useState('');

//   const handleFormChange = (field, value) =>
//     setForm((prev) => ({ ...prev, [field]: value }));

//   const handleSave = () => {
//     if (!form.participant || !form.amount) return;
//     setPayments((prev) => [
//       ...prev,
//       {
//         id:          prev.length + 1,
//         participant: form.participant,
//         description: form.feeItem,
//         type:        form.type,
//         amount:      Number(form.amount),
//         status:      'Paid',
//         paidDate:    form.paymentDate || '-',
//         paymentMode: form.paymentMode,
//       },
//     ]);
//     setForm({ participant: '', feeItem: FEE_ITEMS[0], amount: '', type: 'Annual', paymentMode: 'Cash', paymentDate: '' });
//   };

//   const handleCancel = () =>
//     setForm({ participant: '', feeItem: FEE_ITEMS[0], amount: '', type: 'Annual', paymentMode: 'Cash', paymentDate: '' });

//   return (
//     <div className="space-y-5">

//       {/* Add Payment Form */}
//       <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
//         {/* Row 1: Participant + Fee Item */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Participant</label>
//             <input
//               type="text"
//               placeholder="Select Participant"
//               value={form.participant}
//               onChange={(e) => handleFormChange('participant', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Fee Item</label>
//             <select
//               value={form.feeItem}
//               onChange={(e) => handleFormChange('feeItem', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               {FEE_ITEMS.map((f) => <option key={f}>{f}</option>)}
//             </select>
//           </div>
//         </div>

//         {/* Row 2: Amount, Type, Payment Mode, Payment Date */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Amount</label>
//             <input
//               type="number"
//               placeholder="₹ Amount"
//               value={form.amount}
//               onChange={(e) => handleFormChange('amount', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Type</label>
//             <select
//               value={form.type}
//               onChange={(e) => handleFormChange('type', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               {TYPES.map((t) => <option key={t}>{t}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Mode</label>
//             <select
//               value={form.paymentMode}
//               onChange={(e) => handleFormChange('paymentMode', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Date</label>
//             <input
//               type="date"
//               value={form.paymentDate}
//               onChange={(e) => handleFormChange('paymentDate', e.target.value)}
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
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//         >
//           {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
//         </select>
//         <select
//           value={filterMode}
//           onChange={(e) => setFilterMode(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//         >
//           {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
//         </select>
//         <input
//           type="month"
//           value={filterMonth}
//           onChange={(e) => setFilterMonth(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//         />
//       </div>

//       {/* Payments Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[750px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               {['Participants', 'Description', 'Type', 'Amount', 'Status', 'Paid Date', 'Payment Mode'].map((h) => (
//                 <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {payments.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
//                   No payment records found.
//                 </td>
//               </tr>
//             ) : (
//               payments.map((row, idx) => (
//                 <tr
//                   key={row.id}
//                   className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
//                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
//                   }`}
//                 >
//                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.participant}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px]">{row.description}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.type}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.amount.toLocaleString()}</td>
//                   <td className="px-4 py-3 text-sm">
//                     <span
//                       className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${
//                         row.status === 'Paid'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-500'
//                       }`}
//                     >
//                       {row.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.paidDate}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.paymentMode}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
















// // pages/fitness/Fees/AddPayments.jsx
// import { useState, useEffect } from 'react';
// import Select from 'react-select';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const PAYMENT_MODES = ['Cash','Bank Transaction'];
// const STATUS_OPTS = ['All', 'Paid', 'Partially Paid', 'Pending'];

// const emptyForm = {
//   memberId: '',
//   allotmentId: '',
//   amount: '',
//   paymentMode: 'Cash',
//   paymentDate: new Date().toISOString().split('T')[0],
// };

// export default function FitnessAddPayments({ onSuccess }) {
//   const [payments, setPayments] = useState([]);
//   const [allotments, setAllotments] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState(emptyForm);

//   // Filters
//   const [filterMember, setFilterMember] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [filterMode, setFilterMode] = useState('');

//   // ── Load Initial Data ─────────────────────────────────────
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const [paymentsRes, allotmentsRes, membersRes] = await Promise.all([
//           api.fitnessFees.getPayments(),
//           api.fitnessFees.getAllotments(),
//           api.fitnessMember.getAll(),
//         ]);

//         setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
//         setAllotments(Array.isArray(allotmentsRes.data) ? allotmentsRes.data : []);
//         setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   // ── Load Allotments when Member is selected ───────────────
//   const [allotmentsForMember, setAllotmentsForMember] = useState([]);

//   useEffect(() => {
//     if (!form.memberId) {
//       setAllotmentsForMember([]);
//       return;
//     }

//     const filtered = allotments.filter(
//   (a) =>
//     (a.memberId?._id === form.memberId || a.memberId === form.memberId) &&
//     a.status !== 'Paid' // 🔥 KEY LINE
// );
//     setAllotmentsForMember(filtered);
//   }, [form.memberId, allotments]);

//   const refreshPayments = async () => {
//     try {
//       const res = await api.fitnessFees.getPayments();
//       setPayments(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       toast.error('Failed to refresh payments');
//     }
//   };

//   // ── Form Handlers ─────────────────────────────────────────
//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleMemberSelect = (option) => {
//     setForm({
//       memberId: option ? option.value : '',
//       allotmentId: '',
//       amount: '',
//       paymentMode: 'Cash',
//       paymentDate: new Date().toISOString().split('T')[0],
//     });
//   };

//   const handleAllotmentSelect = (option) => {
//     if (!option) {
//       setForm((prev) => ({ ...prev, allotmentId: '', amount: '' }));
//       return;
//     }

//     const selectedAllotment = allotmentsForMember.find((a) => a._id === option.value);
//     setForm((prev) => ({
//       ...prev,
//       allotmentId: option.value,
//       amount: selectedAllotment?.remainingAmount || selectedAllotment?.amount || '',
//     }));
//   };

//   const handleSave = async () => {
//     if (!form.memberId) return toast.error('Please select a member');
//     if (!form.allotmentId) return toast.error('Please select an allotted fee');
//     if (!form.amount || Number(form.amount) <= 0) {
//       return toast.error('Please enter a valid payment amount');
//     }

//     setSaving(true);
//     try {
//       await api.fitnessFees.addPayment({
//         memberId: form.memberId,
//         allotmentId: form.allotmentId,
//         amount: Number(form.amount),
//         paymentMode: form.paymentMode,
//         paymentDate: form.paymentDate,
//       });

//       toast.success('Payment recorded successfully!');
//       setForm(emptyForm);
//       refreshPayments();
//       onSuccess?.();
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to record payment';
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => setForm(emptyForm);

//   // ── Options for Select ────────────────────────────────────
//   const memberOptions = members.map((member) => ({
//     value: member._id,
//     label: `${member.name} ${member.memberId ? `(${member.memberId})` : ''}`,
//   }));

//   const allotmentOptions = allotmentsForMember.map((allotment) => ({
//     value: allotment._id,
//     label: `${allotment.description || allotment.feeTypeId?.description} — ₹${allotment.amount} (${allotment.feePlan})`,
//   }));

//   // ── Filtered Payments ─────────────────────────────────────
//   const filteredPayments = payments.filter((p) => {
//     const name = p.memberId?.name || p.memberId?.fullName || '';
//     const matchesMember = !filterMember || name.toLowerCase().includes(filterMember.toLowerCase());
//     const matchesStatus =
//   filterStatus === 'All' ||
//   p.allotmentId?.status === filterStatus;
//     const matchesMode = !filterMode || p.paymentMode === filterMode;

//     return matchesMember && matchesStatus && matchesMode;
//   });

//   return (
//     <div className="space-y-5">
//       {/* Add Payment Form */}
//       <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
//         {/* <h3 className="text-base font-semibold text-gray-800">Record Fitness Fee Payment</h3> */}

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
//           {/* Member */}
//           <div>
//             {/* <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Member</label>
//             <Select
//               options={memberOptions}
//               onChange={handleMemberSelect}
//               value={memberOptions.find((opt) => opt.value === form.memberId) || null}
//               placeholder="Select member..."
//               isClearable
//               isSearchable
//               className="text-sm"
//             /> */}
//           </div>

//           {/* Allotted Fee */}
//           <div>
//             {/* <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Allotted Fee</label>
//             <Select
//               options={allotmentOptions}
//               onChange={handleAllotmentSelect}
//               value={allotmentOptions.find((opt) => opt.value === form.allotmentId) || null}
//               placeholder={form.memberId ? 'Select allotted fee...' : 'Select member first'}
//               isDisabled={!form.memberId}
//               isClearable
//               className="text-sm"
//             /> */}
//           </div>

//           {/* Amount */}
//           <div>
//             {/* <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Amount (₹)</label>
//             <input
//               type="number"
//               value={form.amount}
//               onChange={(e) => handleChange('amount', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               placeholder="Payment Amount"
//             /> */}
//           </div>

//           {/* Payment Mode */}
//           <div>
//             {/* <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Mode</label>
//             <select
//               value={form.paymentMode}
//               onChange={(e) => handleChange('paymentMode', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
//             >
//               {PAYMENT_MODES.map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select> */}
//           </div>

//           {/* Payment Date */}
//           <div>
//             {/* <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Payment Date</label>
//             <input
//               type="date"
//               value={form.paymentDate}
//               onChange={(e) => handleChange('paymentDate', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             /> */}
//           </div>
//         </div>

//         {/* <div className="flex justify-end gap-3"> */}
//           {/* <button
//             onClick={handleCancel}
//             disabled={saving}
//             className="border border-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button> */}
//           {/* <button
//             onClick={handleSave}
//             disabled={saving || !form.allotmentId || !form.amount}
//             className="bg-[#1e3a8a] hover:bg-[#1a2f72] disabled:opacity-60 text-white px-6 py-2 rounded-md transition-colors"
//           >
//             {saving ? 'Saving...' : 'Save Payment'}
//           </button> */}
//         {/* </div> */}
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3">
//         <input
//           type="text"
//           placeholder="Search By Member Name"
//           value={filterMember}
//           onChange={(e) => setFilterMember(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[200px]"
//         />
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
//         >
//           {STATUS_OPTS.map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//         <select
//           value={filterMode}
//           onChange={(e) => setFilterMode(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
//         >
//           <option value="">All Modes</option>
//           {PAYMENT_MODES.map((m) => (
//             <option key={m} value={m}>
//               {m}
//             </option>

//           ))}
//         </select>


//       </div>

//       {/* Payments Table - Now matching School style */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[900px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               {['Member', 'Description', 'Amount Paid', 'Status', 'Payment Date', 'Payment Mode'].map((h) => (
//                 <th
//                   key={h}
//                   className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap"
//                 >
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="py-10 text-center text-gray-500">
//                   Loading payments...
//                 </td>
//               </tr>
//             ) : filteredPayments.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="py-10 text-center text-gray-400">
//                   No payment records found
//                 </td>
//               </tr>
//             ) : (
//               filteredPayments.map((p, idx) => (
//                 <tr
//                   key={p._id}
//                   className={`border-b hover:bg-blue-50 transition-colors ${
//                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                   }`}
//                 >
//                   <td className="px-4 py-3 font-medium">
//                     {p.memberId?.name || p.memberId?.fullName || 'N/A'}
//                   </td>
//                   <td className="px-4 py-3">
//                     {p.description || p.allotmentId?.description || p.feeTypeId?.description || '—'}
//                   </td>
//                   <td className="px-4 py-3 font-medium">
//                     ₹{Number(p.amount).toLocaleString('en-IN')}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`inline-flex px-3 py-0.5 rounded-full text-xs font-semibold ${
//                         p.allotmentId?.status === 'Paid'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-yellow-100 text-yellow-700'
//                       }`}
//                     >
//                       {p.allotmentId?.status || 'Pending'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     {p.paymentDate
//                       ? new Date(p.paymentDate).toLocaleDateString('en-IN')
//                       : '—'}
//                   </td>
//                   <td className="px-4 py-3">{p.paymentMode}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }











/////////////////////
















// pages/fitness/Fees/AddPayments.jsx
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const PAYMENT_MODES = ['Cash', 'Bank Transfer'];
const STATUS_OPTS = ['All', 'Paid', 'Pending'];

const emptyForm = {
  memberId: '',
  allotmentId: '',
  amount: '',
  paymentMode: 'Cash',
  paymentDate: new Date().toISOString().split('T')[0],
};

export default function TransactionReport({ onSuccess }) {
  const [payments, setPayments] = useState([]);
  const [allotments, setAllotments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Filters
  const [filterMember, setFilterMember] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMode, setFilterMode] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // ── Load Initial Data ─────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [paymentsRes, allotmentsRes, membersRes] = await Promise.all([
          api.fitnessFees.getPayments(),
          api.fitnessFees.getAllotments(),
          api.fitnessMember.getAll(),
        ]);

        setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
        setAllotments(Array.isArray(allotmentsRes.data) ? allotmentsRes.data : []);
        setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ── Load Allotments when Member is selected ───────────────
  const [allotmentsForMember, setAllotmentsForMember] = useState([]);

  useEffect(() => {
    if (!form.memberId) {
      setAllotmentsForMember([]);
      return;
    }

    const filtered = allotments.filter(
      (a) =>
        (a.memberId?._id === form.memberId || a.memberId === form.memberId) &&
        a.status !== 'Paid'
    );
    setAllotmentsForMember(filtered);
  }, [form.memberId, allotments]);

  const refreshPayments = async () => {
    try {
      const res = await api.fitnessFees.getPayments();
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Failed to refresh payments');
    }
  };

  // ── Form Handlers ─────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMemberSelect = (option) => {
    setForm({
      memberId: option ? option.value : '',
      allotmentId: '',
      amount: '',
      paymentMode: 'Cash',
      paymentDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleAllotmentSelect = (option) => {
    if (!option) {
      setForm((prev) => ({ ...prev, allotmentId: '', amount: '' }));
      return;
    }

    const selectedAllotment = allotmentsForMember.find((a) => a._id === option.value);
    setForm((prev) => ({
      ...prev,
      allotmentId: option.value,
      amount: selectedAllotment?.remainingAmount || selectedAllotment?.amount || '',
    }));
  };

  const handleSave = async () => {
    if (!form.memberId) return toast.error('Please select a member');
    if (!form.allotmentId) return toast.error('Please select an allotted fee');
    if (!form.amount || Number(form.amount) <= 0) {
      return toast.error('Please enter a valid payment amount');
    }

    setSaving(true);
    try {
      await api.fitnessFees.addPayment({
        memberId: form.memberId,
        allotmentId: form.allotmentId,
        amount: Number(form.amount),
        paymentMode: form.paymentMode,
        paymentDate: form.paymentDate,
      });

      toast.success('Payment recorded successfully!');
      setForm(emptyForm);
      refreshPayments();
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to record payment';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setForm(emptyForm);

  // ── Options for Select ────────────────────────────────────
  const memberOptions = members.map((member) => ({
    value: member._id,
    label: `${member.name} ${member.memberId ? `(${member.memberId})` : ''}`,
  }));

  const allotmentOptions = allotmentsForMember.map((allotment) => ({
    value: allotment._id,
    label: `${allotment.description || allotment.feeTypeId?.description} — ₹${allotment.amount} (${allotment.feePlan})`,
  }));

  // ── Filtered Payments ─────────────────────────────────────
  const filteredPayments = payments.filter((p) => {
    const name = p.memberId?.name || p.memberId?.fullName || '';
    const matchesMember =
      !filterMember || name.toLowerCase().includes(filterMember.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || p.allotmentId?.status === filterStatus;

    const matchesMode =
      !filterMode ||   p.paymentMode?.toLowerCase().includes(filterMode.toLowerCase());

    const paymentDateValue = p.paymentDate
      ? new Date(p.paymentDate).toISOString().split('T')[0]
      : '';

    const matchesDate =
      !filterDate || paymentDateValue === filterDate;

    return matchesMember && matchesStatus && matchesMode && matchesDate;
  });

  return (
    <div className="space-y-5">
      {/* Add Payment Form */}
      <div className="">
        {/* <h3 className="text-base font-semibold text-gray-800">Record Fitness Fee Payment</h3> */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search By Member Name"
          value={filterMember}
          onChange={(e) => setFilterMember(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[200px]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          {STATUS_OPTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All Modes</option>
          {PAYMENT_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 10) {
              setFilterDate(value);
            }
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        />
      </div>

      {/* Payments Table - Now matching School style */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {['Member', 'Description', 'Amount Paid', 'Status', 'Payment Date','Responsible Staff', 'Payment Mode',].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  Loading payments...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  No payment records found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p, idx) => (
                <tr
                  key={p._id}
                  className={`border-b hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <td className="px-4 py-3 font-medium">
                    {p.memberId?.name || p.memberId?.fullName || p.customerName || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {p.description || p.allotmentId?.description || p.feeTypeId?.description || '—'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₹{Number(p.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-3 py-0.5 rounded-full text-xs font-semibold ${p.allotmentId?.status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {p.allotmentId?.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
  {p.paymentDate
    ? new Date(p.paymentDate).toLocaleDateString('en-IN')
    : '—'}
</td>

{/* ✅ ADD THIS BLOCK */}
<td className="px-4 py-3">
  {p.allotmentId?.responsibleStaff?.fullName ||
   p.allotmentId?.responsibleStaff?.name ||
   'N/A'}
</td>

<td className="px-4 py-3">{p.paymentMode}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}