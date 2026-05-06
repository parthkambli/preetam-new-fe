// pages/fitness/Fees/AddPayments.jsx
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import Pagination from '../../../components/Pagination'; // Adjust path as needed

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
  const [staffList, setStaffList] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [filterMember, setFilterMember] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMode, setFilterMode] = useState('');
  const [filterStaff, setFilterStaff] = useState('');

  // ── Load Initial Data ─────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, allotmentsRes, membersRes, staffRes] = await Promise.all([
        api.fitnessFees.getPayments({
  page,
  limit,
  member: filterMember,
  status: filterStatus,
  mode: filterMode,
  staff: filterStaff,
  fromDate,
  toDate,
}), // Backend pagination
        api.fitnessFees.getAllotments(),
        api.fitnessMember.getAll(),
        api.fitnessStaff.getAll({
  all: true,
})
      ]);

      // Handle paginated response
      const paymentsData = paymentsRes.data?.data || paymentsRes.data || [];
      const pagination = paymentsRes.data?.pagination || {};

      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setTotalCount(pagination.totalRecords || 0);
      setTotalPages(pagination.totalPages || 1);

      setAllotments(Array.isArray(allotmentsRes.data) ? allotmentsRes.data : []);
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
      setStaffList(
        Array.isArray(staffRes.data?.data?.staff)
          ? staffRes.data.data.staff
          : []
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, limit]);

  // Reset to page 1 when filters change (standard UX for server pagination)
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      loadData();
    }
  }, [filterMember, filterStatus, filterMode, filterStaff, fromDate, toDate]);

  // ── Staff lookup map ─────────────────────────────────────
  const staffMap = {};
  staffList.forEach((s) => {
    staffMap[s._id] = s.fullName || s.name || 'N/A';
  });

  const getStaffName = (staffIdOrObj) => {
    if (!staffIdOrObj) return 'N/A';
    if (typeof staffIdOrObj === 'object') {
      return staffIdOrObj.fullName || staffIdOrObj.name || 'N/A';
    }
    return staffMap[staffIdOrObj] || 'N/A';
  };

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
      await loadData(); // Uses current page/limit
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

  // ── Filtered Payments (Server Side) ───────
  const filteredPayments = payments;

  const staffOptions = staffList.map((staff) => ({
    value: staff._id,
    label: staff.fullName || staff.name,
  }));

  // Export functions remain unchanged (use filtered data)
  const handleExportExcel = () => {
    if (!filteredPayments.length) {
      toast.error('No data to export');
      return;
    }

    const data = filteredPayments.map((p) => ({
      Member: p.memberId?.name || p.memberId?.fullName || 'N/A',
      Description:
        p.description ||
        p.allotmentId?.description ||
        p.feeTypeId?.description ||
        '-',
      Amount: p.amount,
      Status: p.allotmentId?.status || 'Pending',
      Date: p.paymentDate
        ? new Date(p.paymentDate).toLocaleDateString('en-IN')
        : '',
      Staff: getStaffName(p.allotmentId?.responsibleStaff),
      Mode: p.paymentMode,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, 'Payment_Report.xlsx');
  };

  const handleExportPDF = () => {
    if (!filteredPayments.length) {
      toast.error('No data to export');
      return;
    }

    const doc = new jsPDF();
    doc.text('Payment Report', 14, 15);
    if (fromDate || toDate) {
      doc.text(`Date: ${fromDate || 'Start'} to ${toDate || 'End'}`, 14, 22);
    }

    const rows = filteredPayments.map((p) => [
      p.memberId?.name || p.memberId?.fullName || 'N/A',
      p.description ||
        p.allotmentId?.description ||
        p.feeTypeId?.description ||
        '-',
      `Rs. ${Number(p.amount).toLocaleString('en-IN')}`,
      p.allotmentId?.status || 'Pending',
      p.paymentDate
        ? new Date(p.paymentDate).toLocaleDateString('en-IN')
        : '',
      getStaffName(p.allotmentId?.responsibleStaff),
      p.paymentMode,
    ]);

    autoTable(doc, {
      head: [['Member', 'Description', 'Amount', 'Status', 'Date', 'Staff', 'Mode']],
      body: rows,
      startY: 30,
    });

    doc.save('Payment_Report.pdf');
  };

  return (
    <div className="space-y-5">
      {/* Add Payment Form - unchanged */}
      <div className="">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Filters - unchanged */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search By Member Name"
          value={filterMember}
          onChange={(e) => setFilterMember(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[200px]"
        />
        {/* <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          {STATUS_OPTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select> */}
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All Modes</option>
          {PAYMENT_MODES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={filterStaff}
          onChange={(e) => setFilterStaff(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All Staff</option>
          {staffOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        />

        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Excel
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          PDF
        </button>
      </div>

      {/* Payments Table - unchanged */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {['Member', 'Description', 'Amount Paid', 'Status', 'Payment Date', 'Responsible Staff', 'Payment Mode'].map((h) => (
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
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  Loading payments...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  No payment records found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p, idx) => (
                <tr
                  key={p._id}
                  className={`border-b hover:bg-blue-50 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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
                      className={`inline-flex px-3 py-0.5 rounded-full text-xs font-semibold ${
                        p.allotmentId?.status === 'Paid'
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
                  <td className="px-4 py-3">
                    {getStaffName(p.allotmentId?.responsibleStaff)}
                  </td>
                  <td className="px-4 py-3">{p.paymentMode}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalCount={totalCount}
        setPage={setPage}
        setLimit={setLimit}
      />
    </div>
  );
}













// // pages/fitness/Fees/AddPayments.jsx
// import { useState, useEffect } from 'react';
// import Select from 'react-select';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const PAYMENT_MODES = ['Cash', 'Bank Transfer'];
// const STATUS_OPTS = ['All', 'Paid', 'Pending'];

// const emptyForm = {
//   memberId: '',
//   allotmentId: '',
//   amount: '',
//   paymentMode: 'Cash',
//   paymentDate: new Date().toISOString().split('T')[0],
// };

// export default function TransactionReport({ onSuccess }) {
//   const [payments, setPayments] = useState([]);
//   const [allotments, setAllotments] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState(emptyForm);
//   const [staffList, setStaffList] = useState([]);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   // Filters
//   const [filterMember, setFilterMember] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [filterMode, setFilterMode] = useState('');
//   const [filterStaff, setFilterStaff] = useState('');

//   // ── Load Initial Data ─────────────────────────────────────
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const [paymentsRes, allotmentsRes, membersRes, staffRes] = await Promise.all([
//           api.fitnessFees.getPayments(),
//           api.fitnessFees.getAllotments(),
//           api.fitnessMember.getAll(),
//           api.fitnessStaff.getAll(),
//         ]);

//         setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
//         setAllotments(Array.isArray(allotmentsRes.data) ? allotmentsRes.data : []);
//         setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
//         setStaffList(
//           Array.isArray(staffRes.data?.data?.staff)
//             ? staffRes.data.data.staff
//             : []
//         );
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   // ── Staff lookup map: { id -> name } ─────────────────────
//   // responsibleStaff is a plain ID string in the API response,
//   // so we build a map to resolve it from the staffList array.
//   const staffMap = {};
//   staffList.forEach((s) => {
//     staffMap[s._id] = s.fullName || s.name || 'N/A';
//   });

//   const getStaffName = (staffIdOrObj) => {
//     if (!staffIdOrObj) return 'N/A';
//     // If somehow populated (object), use name directly
//     if (typeof staffIdOrObj === 'object') {
//       return staffIdOrObj.fullName || staffIdOrObj.name || 'N/A';
//     }
//     // Plain ID string — look up in map
//     return staffMap[staffIdOrObj] || 'N/A';
//   };

//   // ── Load Allotments when Member is selected ───────────────
//   const [allotmentsForMember, setAllotmentsForMember] = useState([]);

//   useEffect(() => {
//     if (!form.memberId) {
//       setAllotmentsForMember([]);
//       return;
//     }

//     const filtered = allotments.filter(
//       (a) =>
//         (a.memberId?._id === form.memberId || a.memberId === form.memberId) &&
//         a.status !== 'Paid'
//     );
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
//     const matchesMember =
//       !filterMember || name.toLowerCase().includes(filterMember.toLowerCase());

//     const matchesStatus =
//       filterStatus === 'All' || p.allotmentId?.status === filterStatus;

//     const matchesMode =
//       !filterMode || p.paymentMode?.toLowerCase().includes(filterMode.toLowerCase());

//     const staffId = p.allotmentId?.responsibleStaff;
//     const resolvedStaffId = typeof staffId === 'object' ? staffId?._id : staffId;
//     const matchesStaff = !filterStaff || resolvedStaffId === filterStaff;

//     const paymentDate = p.paymentDate ? new Date(p.paymentDate) : null;
//     const from = fromDate ? new Date(fromDate) : null;
//     const to = toDate ? new Date(toDate) : null;
//     if (to) to.setHours(23, 59, 59, 999);

//     const matchesDateRange =
//       (!from || (paymentDate && paymentDate >= from)) &&
//       (!to || (paymentDate && paymentDate <= to));

//     return matchesMember && matchesStatus && matchesMode && matchesStaff && matchesDateRange;
//   });

//   const staffOptions = staffList.map((staff) => ({
//     value: staff._id,
//     label: staff.fullName || staff.name,
//   }));

//   const handleExportExcel = () => {
//     if (!filteredPayments.length) {
//       toast.error('No data to export');
//       return;
//     }

//     const data = filteredPayments.map((p) => ({
//       Member: p.memberId?.name || p.memberId?.fullName || 'N/A',
//       Description:
//         p.description ||
//         p.allotmentId?.description ||
//         p.feeTypeId?.description ||
//         '-',
//       Amount: p.amount,
//       Status: p.allotmentId?.status || 'Pending',
//       Date: p.paymentDate
//         ? new Date(p.paymentDate).toLocaleDateString('en-IN')
//         : '',
//       Staff: getStaffName(p.allotmentId?.responsibleStaff),
//       Mode: p.paymentMode,
//     }));

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Payments');
//     XLSX.writeFile(wb, 'Payment_Report.xlsx');
//   };

//   const handleExportPDF = () => {
//     if (!filteredPayments.length) {
//       toast.error('No data to export');
//       return;
//     }

//     const doc = new jsPDF();
//     doc.text('Payment Report', 14, 15);
//     if (fromDate || toDate) {
//       doc.text(`Date: ${fromDate || 'Start'} to ${toDate || 'End'}`, 14, 22);
//     }

//     const rows = filteredPayments.map((p) => [
//       p.memberId?.name || p.memberId?.fullName || 'N/A',
//       p.description ||
//         p.allotmentId?.description ||
//         p.feeTypeId?.description ||
//         '-',
//       `Rs. ${Number(p.amount).toLocaleString('en-IN')}`,
//       p.allotmentId?.status || 'Pending',
//       p.paymentDate
//         ? new Date(p.paymentDate).toLocaleDateString('en-IN')
//         : '',
//       getStaffName(p.allotmentId?.responsibleStaff),
//       p.paymentMode,
//     ]);

//     autoTable(doc, {
//       head: [['Member', 'Description', 'Amount', 'Status', 'Date', 'Staff', 'Mode']],
//       body: rows,
//       startY: 30,
//     });

//     doc.save('Payment_Report.pdf');
//   };

//   return (
//     <div className="space-y-5">
//       {/* Add Payment Form */}
//       <div className="">
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
//           <div></div>
//           <div></div>
//           <div></div>
//           <div></div>
//           <div></div>
//         </div>
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
//             <option key={s} value={s}>{s}</option>
//           ))}
//         </select>
//         <select
//           value={filterMode}
//           onChange={(e) => setFilterMode(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
//         >
//           <option value="">All Modes</option>
//           {PAYMENT_MODES.map((m) => (
//             <option key={m} value={m}>{m}</option>
//           ))}
//         </select>

//         <select
//           value={filterStaff}
//           onChange={(e) => setFilterStaff(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
//         >
//           <option value="">All Staff</option>
//           {staffOptions.map((s) => (
//             <option key={s.value} value={s.value}>{s.label}</option>
//           ))}
//         </select>

//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
//         />
//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//           className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
//         />

//         <button
//           onClick={handleExportExcel}
//           className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
//         >
//           Excel
//         </button>
//         <button
//           onClick={handleExportPDF}
//           className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
//         >
//           PDF
//         </button>
//       </div>

//       {/* Payments Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[900px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               {['Member', 'Description', 'Amount Paid', 'Status', 'Payment Date', 'Responsible Staff', 'Payment Mode'].map((h) => (
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
//                 <td colSpan={7} className="py-10 text-center text-gray-500">
//                   Loading payments...
//                 </td>
//               </tr>
//             ) : filteredPayments.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="py-10 text-center text-gray-400">
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
//                     {p.memberId?.name || p.memberId?.fullName || p.customerName || 'N/A'}
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
//                   <td className="px-4 py-3">
//                     {getStaffName(p.allotmentId?.responsibleStaff)}
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