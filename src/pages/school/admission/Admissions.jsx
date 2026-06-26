// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { api } from '../../../services/apiClient';

// export default function SchoolAdmission() {
//   const [admissions, setAdmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     admissionId: '',
//     name: '',
//     mobile: '',
//     feePlan: '',
//     status: ''
//   });

//   useEffect(() => {
//     fetchAdmissions();
//   }, [filters]);

//   const fetchAdmissions = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const params = {};
//       if (filters.admissionId) params.admissionId = filters.admissionId;
//       if (filters.name) params.name = filters.name;
//       if (filters.mobile) params.mobile = filters.mobile;
//       if (filters.feePlan) params.feePlan = filters.feePlan;
//       if (filters.status) params.status = filters.status;
      
//       const response = await api.schoolAdmission.getAll(params);
//       setAdmissions(response.data);
//     } catch (err) {
//       setError('Failed to load admissions');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Admission</h1>
//         <Link
//           to="/school/admission/add"
//           className="bg-[#000359] text-white px-6 py-2.5 rounded-lg hover:bg-blue-900 transition"
//         >
//           Add Admission
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className=" bg-white p-4 rounded-xl shadow flex flex-wrap gap-4">
//         <input
//           type="text"
//           placeholder="Admission ID"
//           className="border rounded px-4 py-2 min-w-[180px]"
//           value={filters.admissionId}
//           onChange={(e) => handleFilterChange('admissionId', e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Name"
//           className="border rounded px-4 py-2 min-w-[180px]"
//           value={filters.name}
//           onChange={(e) => handleFilterChange('name', e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Mobile"
//           className="border rounded px-4 py-2 min-w-[180px]"
//           value={filters.mobile}
//           onChange={(e) => handleFilterChange('mobile', e.target.value)}
//         />
//         <select 
//           className="border rounded px-4 py-2"
//           value={filters.feePlan}
//           onChange={(e) => handleFilterChange('feePlan', e.target.value)}
//         >
//           <option value="">Fee Plan</option>
//           <option>Daily</option>
//           <option>Weekly</option>
//           <option>Monthly</option>
//           <option>Annual</option>
        
//         </select>
//         <select 
//           className="border rounded px-4 py-2"
//           value={filters.status}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//         >
//           <option value="">Status</option>
//           <option>Active</option>
//           <option>Inactive</option>
//         </select>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">Loading...</div>
//       ) : error ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-red-500">{error}</div>
//       ) : admissions.length === 0 ? (
//         <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No admissions found</div>
//       ) : (
//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-max">
//               <thead className="bg-[#000359] text-white">
//                 <tr>
//                   <th className="p-4 text-left font-semibold">Admission ID</th>
//                   <th className="p-4 text-left font-semibold">Name</th>
//                   <th className="p-4 text-left font-semibold">Age</th>
//                   <th className="p-4 text-left font-semibold">Mobile</th>
//                   <th className="p-4 text-left font-semibold">Fee Plan</th>
//                   <th className="p-4 text-left font-semibold">Amount</th>
//                   <th className="p-4 text-left font-semibold">Status</th>
//                   <th className="p-4 text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {admissions.map((adm) => (
//                   <tr key={adm._id} className="border-t hover:bg-gray-50">
//                     <td className="p-4">{adm.admissionId}</td>
//                     <td className="p-4 font-medium">{adm.fullName}</td>
//                     <td className="p-4">{adm.age}</td>
//                     <td className="p-4">{adm.mobile}</td>
//                     <td className="p-4">{adm.feePlan}</td>
//                     <td className="p-4">₹{adm.amount?.toLocaleString('en-IN') || '-'}</td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-full text-sm ${
//                         adm.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {adm.status}
//                       </span>
//                     </td>
//                     <td className="p-4 flex gap-3">
//                       <Link 
//                         to={`/school/admission/view/${adm._id}`} 
//                         className="text-blue-600 hover:underline"
//                       >
//                         View
//                       </Link>
//                       <Link 
//                         to={`/school/admission/edit/${adm._id}`} 
//                         className="text-green-600 hover:underline"
//                       >
//                         Edit
//                       </Link>
//                     </td>
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



import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';
import Pagination from '../../../components/Pagination';

const PAYMENT_MODES = ['Cash', 'Bank Transfer'];

const FEE_PLAN_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'HalfYearly', value: 'halfYearly' },
  { label: 'Annual', value: 'annual' },
];

const emptyPaymentForm = {
  amount: '',
  paymentMode: 'Cash',
  paymentDate: new Date().toISOString().split('T')[0],
  description: 'Pending Fees',
  responsibleStaff: '',
};

const toPlanKey = (str) => str ? str.charAt(0).toLowerCase() + str.slice(1) : 'monthly';
const toPlanLabel = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : 'Monthly';

const getPlanEndDate = (startDate, feePlan) => {
  if (!startDate) return '';
  const start = new Date(startDate);
  switch (feePlan) {
    case 'daily': return start.toISOString().split('T')[0];
    case 'weekly': return new Date(start.setDate(start.getDate() + 7)).toISOString().split('T')[0];
    case 'monthly': return new Date(start.setMonth(start.getMonth() + 1)).toISOString().split('T')[0];
    case 'quarterly': return new Date(start.setMonth(start.getMonth() + 3)).toISOString().split('T')[0];
    case 'halfYearly': return new Date(start.setMonth(start.getMonth() + 6)).toISOString().split('T')[0];
    case 'annual': return new Date(start.setFullYear(start.getFullYear() + 1)).toISOString().split('T')[0];
    default: return new Date(start.setMonth(start.getMonth() + 1)).toISOString().split('T')[0];
  }
};

export default function SchoolAdmission() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Payment modal state ──────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);
  const [savingPayment, setSavingPayment] = useState(false);
  const [selectedStaffOption, setSelectedStaffOption] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filterSearch, setFilterSearch] = useState('');
  const [filterFeePlan, setFilterFeePlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');

  // ── Renewal state ───────────────────────────────────────────
  const [expiringMap, setExpiringMap] = useState({});
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewAdmission, setRenewAdmission] = useState(null);
  const [savingRenewal, setSavingRenewal] = useState(false);
  const [feeTypes, setFeeTypes] = useState([]);
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [services, setServices] = useState([]);

  const todayStr = () => new Date().toISOString().split('T')[0];

  const emptyRenewFee = {
    feeTypeId: '', feePlan: 'monthly', feeAmount: 0, discount: 0, totalFee: 0,
    paidAmount: 0, remainingAmount: 0, paymentStatus: 'Pending', paymentMode: 'Cash',
    paymentDate: todayStr(), startDate: '', endDate: '', description: '', responsibleStaff: '',
  };

  const makeEmptySvc = (index = 0) => ({
    serviceIndex: index, serviceId: '', serviceName: '',
    oldStartDate: '', oldEndDate: '',
    startDate: '', endDate: '', days: 0, perDayFee: 0, totalFee: 0,
    paidAmount: 0, remainingAmount: 0, paymentStatus: 'Pending', paymentMode: 'Cash',
    paymentDate: todayStr(), description: '', responsibleStaff: '', responsibleStaffObj: null,
  });

  const [renewFeeForm, setRenewFeeForm] = useState(emptyRenewFee);
  const [renewServiceForms, setRenewServiceForms] = useState([]);
  const [selectedFeeStaff, setSelectedFeeStaff] = useState(null);
  const [renewTab, setRenewTab] = useState('fee');

  // Auto-recalc fee totals when feeAmount/discount/paidAmount change
  useEffect(() => {
    if (!showRenewModal) return;
    setRenewFeeForm(f => {
      const total = Math.max(0, (Number(f.feeAmount) || 0) - (Number(f.discount) || 0));
      const paid = Number(f.paidAmount) || 0;
      const remaining = Math.max(0, total - paid);
      const status = remaining <= 0 && paid > 0 ? 'Paid' : 'Pending';
      return { ...f, totalFee: total, remainingAmount: remaining, paymentStatus: status };
    });
  }, [renewFeeForm.feeAmount, renewFeeForm.discount, renewFeeForm.paidAmount, showRenewModal]);

  const fetchExpiring = async () => {
    try {
      const res = await api.renewals.getExpiring({ days: 3 });
      const list = res.data?.data || [];
      const map = {};
      list.forEach(item => { map[item._id] = item; });
      setExpiringMap(map);
    } catch (err) {
      console.error('Failed to fetch expiring:', err);
    }
  };

  const fetchAdmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit };
      if (filterSearch) params.search = filterSearch;
      if (filterFeePlan) params.feePlan = filterFeePlan;
      if (filterStatus) params.status = filterStatus;
      if (filterPayment) params.paymentFilter = filterPayment;

      const response = await api.schoolAdmission.getAll(params);
      const data = response.data?.data || response.data || [];
      const pagination = response.data?.pagination || {};

      setAdmissions(Array.isArray(data) ? data : []);
      setTotalCount(pagination.totalRecords || 0);
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      setError('Failed to load admissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
    fetchExpiring();
  }, [page, limit]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchAdmissions();
    }
  }, [filterSearch, filterFeePlan, filterStatus, filterPayment]);

  // ── Toggle status ────────────────────────────────────────────
  const toggleStatus = async (adm) => {
    const newStatus = adm.status === 'Active' ? 'Inactive' : 'Active';

    setAdmissions(prev =>
      prev.map(item =>
        item._id === adm._id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const fd = new FormData();
      fd.append('status', newStatus);
      await api.schoolAdmission.update(adm._id, fd);

      window.dispatchEvent(
        new CustomEvent("admissionStatusChanged", {
          detail: { id: adm._id, status: newStatus },
        })
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      setAdmissions(prev =>
        prev.map(item =>
          item._id === adm._id ? { ...item, status: adm.status } : item
        )
      );
      fetchAdmissions();
    }
  };

  // ── Payment modal handlers ───────────────────────────────────
  const openPaymentModal = (adm) => {
    setSelectedAdmission(adm);
    setSelectedStaffOption(null);
    setPaymentForm({
      amount: adm.remainingAmount || '',
      paymentMode: 'Cash',
      paymentDate: new Date().toISOString().split('T')[0],
      description: 'Pending Fees',
      responsibleStaff: '',
    });
    setShowModal(true);
  };

  const closePaymentModal = () => {
    setShowModal(false);
    setSelectedAdmission(null);
    setSelectedStaffOption(null);
    setPaymentForm(emptyPaymentForm);
    setSavingPayment(false);
  };

  const handleCollectPayment = async () => {
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      return toast.error('Enter a valid payment amount');
    }
    if (!paymentForm.paymentDate) {
      return toast.error('Select payment date');
    }

    setSavingPayment(true);
    try {
      const payload = {
        amount: Number(paymentForm.amount),
        paymentMode: paymentForm.paymentMode,
        paymentDate: paymentForm.paymentDate,
        description: paymentForm.description,
        responsibleStaff: paymentForm.responsibleStaff || null,
      };

      await api.schoolAdmission.collectPayment(selectedAdmission._id, payload);

      toast.success('Payment collected successfully!');
      closePaymentModal();
      fetchAdmissions();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to record payment';
      toast.error(msg);
    } finally {
      setSavingPayment(false);
    }
  };

  const fetchFeeTypes = async () => {
    try {
      const res = await api.fees.getTypes();
      const options = (res.data || []).map(fee => ({
        value: fee._id,
        label: fee.description,
        data: fee,
      }));
      setFeeTypes(options);
    } catch (err) {
      console.error('Failed to fetch fee types:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.schoolServices.getAll();
      const options = (res.data?.data || [])
        .filter(s => s.isActive)
        .map(s => ({
          value: s._id,
          label: s.serviceName,
          oneDayFee: s.oneDayFee,
        }));
      setServices(options);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  const updateFeeAmount = (feeType, plan) => {
    if (!feeType || !plan) return;
    const amount = feeType[plan.toLowerCase()] || 0;
    const total = Math.max(0, amount - (Number(renewFeeForm.discount) || 0));
    const paid = Number(renewFeeForm.paidAmount) || 0;
    const remaining = Math.max(0, total - paid);
    const status = remaining <= 0 && paid > 0 ? 'Paid' : 'Pending';
    setRenewFeeForm(f => ({
      ...f, feeAmount: amount, totalFee: total,
      remainingAmount: remaining, paymentStatus: status,
    }));
  };

  // ── Renewal modal handlers ──────────────────────────────────
  const openRenewModal = (adm) => {
    const exp = expiringMap[adm._id];
    if (!exp) return;

    fetchFeeTypes();
    fetchServices();

    setRenewAdmission(adm);
    setSelectedFeeType(null);
    setSelectedFeeStaff(null);
    if (exp.hasExpiringFee && !exp.hasExpiringServices) setRenewTab('fee');
    else if (!exp.hasExpiringFee && exp.hasExpiringServices) setRenewTab('service');
    else setRenewTab('fee');

    const today = todayStr();

    if (exp.hasExpiringFee) {
      setRenewFeeForm({
        feeTypeId: exp.feeTypeId || '',
        feePlan: toPlanKey(adm.feePlan) || 'monthly',
        feeAmount: 0,
        discount: 0,
        totalFee: 0,
        paidAmount: 0,
        remainingAmount: 0,
        paymentStatus: 'Pending',
        paymentMode: 'Cash',
        paymentDate: today,
        startDate: '',
        endDate: '',
        description: `Renewal`,
        //- ${adm.feePlan}
        responsibleStaff: '',
      });
    } else {
      setRenewFeeForm(emptyRenewFee);
    }

    if (exp.hasExpiringServices) {
      setRenewServiceForms(
        exp.expiringServices.map((svc, idx) => ({
          serviceIndex: svc.index,
          serviceId: svc.serviceId?._id || svc.serviceId,
          serviceName: svc.serviceName || '',
          oldStartDate: svc.startDate,
          oldEndDate: svc.endDate,
          startDate: '',
          endDate: '',
          days: svc.days || 0,
          perDayFee: svc.perDayFee || 0,
          totalFee: svc.totalFee || 0,
          paidAmount: 0,
          remainingAmount: svc.totalFee || 0,
          paymentStatus: 'Pending',
          paymentMode: 'Cash',
          paymentDate: today,
          description: `Service Renewal - ${svc.serviceName || ''}`,
          responsibleStaff: '',
          responsibleStaffObj: null,
        }))
      );
    } else {
      setRenewServiceForms([]);
    }

    setShowRenewModal(true);
  };

  const closeRenewModal = () => {
    setShowRenewModal(false);
    setRenewAdmission(null);
    setSelectedFeeType(null);
    setSelectedFeeStaff(null);
    setRenewTab('fee');
    setRenewFeeForm(emptyRenewFee);
    setRenewServiceForms([]);
    setSavingRenewal(false);
  };

  const handleRenewSubmit = async () => {
    const exp = expiringMap[renewAdmission._id];
    const renewals = [];

    if (renewTab === 'fee' && exp.hasExpiringFee) {
      if (!renewFeeForm.startDate) {
        return toast.error('Enter start date for fee renewal');
      }
      const paid = Number(renewFeeForm.paidAmount) || 0;
      renewals.push({
        type: 'fee',
        newFeePlan: toPlanLabel(renewFeeForm.feePlan),
        newStartDate: renewFeeForm.startDate,
        newEndDate: renewFeeForm.endDate || undefined,
        amount: renewFeeForm.totalFee || 0,
        payment: paid > 0 ? {
          amount: paid,
          paymentMode: renewFeeForm.paymentMode,
          paymentDate: renewFeeForm.paymentDate,
          description: renewFeeForm.description || 'Renewal',
          responsibleStaff: renewFeeForm.responsibleStaff || null,
        } : undefined,
      });
    }

    if (renewTab === 'service' && exp.hasExpiringServices) {
      for (const svcForm of renewServiceForms) {
        if (!svcForm.startDate) {
          return toast.error(`Enter start date for service renewal`);
        }
        const svcPaid = Number(svcForm.paidAmount) || 0;
        renewals.push({
          type: 'service',
          serviceIndex: svcForm.serviceIndex,
          serviceId: svcForm.serviceId,
          newStartDate: svcForm.startDate,
          newEndDate: svcForm.endDate || undefined,
          amount: svcForm.totalFee || 0,
          days: Number(svcForm.days) || 0,
          perDayFee: Number(svcForm.perDayFee) || 0,
          payment: svcPaid > 0 ? {
            amount: svcPaid,
            paymentMode: svcForm.paymentMode,
            paymentDate: svcForm.paymentDate,
            description: svcForm.description || 'Service Renewal',
            responsibleStaff: svcForm.responsibleStaff || null,
          } : undefined,
        });
      }
    }

    if (renewals.length === 0) return;

    setSavingRenewal(true);
    try {
      await api.renewals.renew({
        admissionId: renewAdmission._id,
        renewals,
      });

      toast.success('Renewal completed successfully!');
      closeRenewModal();
      fetchAdmissions();
      fetchExpiring();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process renewal';
      toast.error(msg);
    } finally {
      setSavingRenewal(false);
    }
  };

  const loadStaffOptions = async (inputValue) => {
    try {
      const res = await api.fitnessStaff.getAll({ search: inputValue || '', status: 'Active', page: 1, limit: 10 });
      const list = res.data?.data?.staff || [];
      return list.map((s) => ({
        value: s._id,
        label: `${s.fullName} (${s.role || 'Staff'})`,
      }));
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admission</h1>
        <Link
          to="/school/admission/add"
          className="bg-[#000359] text-white px-6 py-2.5 rounded-lg hover:bg-blue-900 transition"
        >
          Add Admission
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Admission ID, Name, or Mobile"
          className="border rounded px-4 py-2 min-w-[280px]"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
        />
        <select 
          className="border rounded px-4 py-2"
          value={filterFeePlan}
          onChange={(e) => setFilterFeePlan(e.target.value)}
        >
          <option value="">Fee Plan</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="halfYearly">Half Yearly</option>
          <option value="annual">Annual</option>
        </select>
        <select 
          className="border rounded px-4 py-2"
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
        >
          <option value="">Payment Status</option>
          <option>Paid</option>
          <option>Pending</option>
        </select>
        <select 
          className="border rounded px-4 py-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-red-500">{error}</div>
      ) : admissions.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No admissions found</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-[#000359] text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">Admission ID</th>
                  <th className="p-4 text-left font-semibold">Name</th>
                  <th className="p-4 text-left font-semibold">Age</th>
                  <th className="p-4 text-left font-semibold">Mobile</th>
                  <th className="p-4 text-left font-semibold">Fee Plan</th>
                  <th className="p-4 text-left font-semibold">Total Fee</th>
                  <th className="p-4 text-left font-semibold">Paid</th>
                  <th className="p-4 text-left font-semibold">Pending</th>
                  <th className="p-4 text-left font-semibold">Fees Remain</th>
                  <th className="p-4 text-left font-semibold">Services Remain</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((adm) => (
                  <tr key={adm._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{adm.admissionId}</td>
                    <td className="p-4 font-medium">{adm.fullName}</td>
                    <td className="p-4">{adm.age}</td>
                    <td className="p-4">{adm.mobile}</td>
                    <td className="p-4">{adm.feePlan}</td>
                    <td className="p-4">₹{(adm.totalFee || 0).toLocaleString('en-IN')}</td>
                    <td className="p-4">₹{(adm.paidAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="p-4">₹{(adm.remainingAmount || 0).toLocaleString('en-IN')}</td>
                    
                    <td className="p-4">
                      {adm.feeRemainingDays === 'Expired' ? (
                        <span className="text-red-600 font-semibold">Expired</span>
                      ) : adm.feeRemainingDays && adm.feeRemainingDays.startsWith('Starts in') ? (
                        <span className="text-green-600 font-semibold">{adm.feeRemainingDays}</span>
                      ) : adm.feeRemainingDays && adm.feeRemainingDays !== '—' ? (
                        <span className={parseInt(adm.feeRemainingDays) <= 3 ? 'text-yellow-600 font-semibold' : ''}>
                          {adm.feeRemainingDays}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {adm.serviceRemainingDays === 'Expired' ? (
                        <span className="text-red-600 font-semibold">Expired</span>
                      ) : adm.serviceRemainingDays && adm.serviceRemainingDays !== '—' ? (
                        <span className={parseInt(adm.serviceRemainingDays) <= 3 ? 'text-yellow-600 font-semibold' : ''}>
                          {adm.serviceRemainingDays}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Editable Status */}
                    <td className="p-4">
                      <button
                        onClick={() => toggleStatus(adm)}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${
                          (adm.computedStatus || adm.status) === 'Active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {adm.computedStatus || adm.status}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3 flex-wrap items-center">
                        <Link 
                          to={`/school/admission/view/${adm._id}`} 
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/school/admission/edit/${adm._id}`} 
                          className="text-green-600 hover:underline"
                        >
                          Edit
                        </Link>
                        {(adm.remainingAmount || 0) > 0 && (
                          <button
                            onClick={() => openPaymentModal(adm)}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded transition-colors"
                          >
                            Collect
                          </button>
                        )}
                        {expiringMap[adm._id] && (expiringMap[adm._id].hasExpiringFee || expiringMap[adm._id].hasExpiringServices) && (
                          <button
                            onClick={() => openRenewModal(adm)}
                            className={`text-white text-xs font-semibold px-3 py-1 rounded transition-colors ${
                              expiringMap[adm._id].feeExpired
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                          >
                            {expiringMap[adm._id].feeExpired ? 'Expired' : 'Renew'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && admissions.length > 0 && (
        <Pagination
          page={page}
          limit={limit}
          totalPages={totalPages}
          totalCount={totalCount}
          setPage={setPage}
          setLimit={setLimit}
        />
      )}

      {/* ── Renew Modal ──────────────────────────────────────────── */}
      {showRenewModal && renewAdmission && expiringMap[renewAdmission._id] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Renewal</h2>
              <button onClick={closeRenewModal} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            {/* Admission info */}
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold">{renewAdmission.fullName}</span> — {renewAdmission.admissionId}</p>
              {expiringMap[renewAdmission._id].feeExpired && (
                <p className="text-red-600 font-medium">Fee plan expired on {new Date(renewAdmission.endDate).toLocaleDateString('en-CA')}</p>
              )}
              {expiringMap[renewAdmission._id].feeExpiring && !expiringMap[renewAdmission._id].feeExpired && (
                <p className="text-yellow-600 font-medium">Fee plan ending on {new Date(renewAdmission.endDate).toLocaleDateString('en-CA')}</p>
              )}
            </div>

            {/* ── Tabs ── */}
            {expiringMap[renewAdmission._id].hasExpiringFee && expiringMap[renewAdmission._id].hasExpiringServices && (
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setRenewTab('fee')}
                  className={`px-5 py-2 text-sm font-semibold border-b-2 transition ${
                    renewTab === 'fee'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Fee Renewal
                </button>
                <button
                  onClick={() => setRenewTab('service')}
                  className={`px-5 py-2 text-sm font-semibold border-b-2 transition ${
                    renewTab === 'service'
                      ? 'border-green-600 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Service Renewal
                </button>
              </div>
            )}

            {/* ── Admission Fee Renewal Section ── */}
            {renewTab === 'fee' && expiringMap[renewAdmission._id].hasExpiringFee && (
              <div className="border border-blue-200 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 text-sm">Admission Fee Renewal</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Fee Type</label>
                    <Select
                      options={feeTypes}
                      value={selectedFeeType}
                      onChange={opt => {
                        setSelectedFeeType(opt);
                        const plan = opt?.data ? (opt.data[renewFeeForm.feePlan] || 0) : 0;
                        const disc = Number(renewFeeForm.discount) || 0;
                        const total = Math.max(0, plan - disc);
                        setRenewFeeForm(f => ({
                          ...f,
                          feeTypeId: opt?.value || '',
                          feeAmount: plan,
                          totalFee: total,
                        }));
                      }}
                      placeholder="Select Fee Type"
                      isClearable
                      classNamePrefix="react-select"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Type</label>
                    <select
                      value={renewFeeForm.feePlan}
                      onChange={e => {
                        const plan = e.target.value;
                        const amount = selectedFeeType?.data?.[plan] || 0;
                        const disc = Number(renewFeeForm.discount) || 0;
                        const total = Math.max(0, amount - disc);
                        const end = getPlanEndDate(renewFeeForm.startDate, plan);
                        setRenewFeeForm(f => ({
                          ...f, feePlan: plan, feeAmount: amount, totalFee: total, endDate: end,
                        }));
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="halfYearly">Half Yearly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Fee Amount</label>
                    <input
                      type="number"
                      value={renewFeeForm.feeAmount}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Discount</label>
                    <input
                      type="number"
                      value={renewFeeForm.discount}
                      onChange={e => {
                        const disc = Number(e.target.value) || 0;
                        const total = Math.max(0, renewFeeForm.feeAmount - disc);
                        const paid = Number(renewFeeForm.paidAmount) || 0;
                        const remaining = Math.max(0, total - paid);
                        const status = remaining <= 0 && paid > 0 ? 'Paid' : 'Pending';
                        setRenewFeeForm(f => ({ ...f, discount: disc, totalFee: total, remainingAmount: remaining, paymentStatus: status }));
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Total</label>
                    <input
                      type="number"
                      value={renewFeeForm.totalFee}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={renewFeeForm.startDate}
                      onChange={e => {
                        const start = e.target.value;
                        const end = getPlanEndDate(start, renewFeeForm.feePlan);
                        setRenewFeeForm(f => ({ ...f, startDate: start, endDate: end }));
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">End Date (auto)</label>
                    <input
                      type="date"
                      value={renewFeeForm.endDate}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Payment</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Paid Amount</label>
                      <input
                        type="number"
                        value={renewFeeForm.paidAmount}
                        onChange={e => {
                          const paid = Number(e.target.value) || 0;
                          const total = renewFeeForm.totalFee;
                          const remaining = Math.max(0, total - paid);
                          const status = remaining <= 0 && paid > 0 ? 'Paid' : 'Pending';
                          setRenewFeeForm(f => ({ ...f, paidAmount: paid, remainingAmount: remaining, paymentStatus: status }));
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="₹ Amount"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Remaining</label>
                      <input
                        type="number"
                        value={renewFeeForm.remainingAmount}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Status</label>
                      <input
                        value={renewFeeForm.paymentStatus}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Mode</label>
                      <select
                        value={renewFeeForm.paymentMode}
                        onChange={e => setRenewFeeForm(f => ({ ...f, paymentMode: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      >
                        {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Date</label>
                      <input
                        type="date"
                        value={renewFeeForm.paymentDate}
                        onChange={e => setRenewFeeForm(f => ({ ...f, paymentDate: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={renewFeeForm.description}
                        onChange={e => setRenewFeeForm(f => ({ ...f, description: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Renewal fee"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Responsible Staff</label>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadStaffOptions}
                        value={selectedFeeStaff}
                        onChange={option => {
                          setSelectedFeeStaff(option);
                          setRenewFeeForm(f => ({ ...f, responsibleStaff: option ? option.value : '' }));
                        }}
                        placeholder="Search staff..."
                        isClearable
                        classNamePrefix="react-select"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Service Renewal Sections ── */}
            {renewTab === 'service' && expiringMap[renewAdmission._id].hasExpiringServices && renewServiceForms.map((svcForm, idx) => (
              <div key={idx} className="border border-green-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 text-sm">Service Renewal — {svcForm.serviceName || `#${idx + 1}`}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = renewServiceForms.filter((_, i) => i !== idx);
                      setRenewServiceForms(filtered);
                    }}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold border border-red-300 px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Current End Date</label>
                    <p className="text-sm text-gray-800 font-medium">
                      {svcForm.oldEndDate ? new Date(svcForm.oldEndDate).toLocaleDateString('en-CA') : '—'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Service</label>
                    <Select
                      options={services}
                      value={services.find(s => s.value === svcForm.serviceId) || null}
                      onChange={opt => {
                        const newForms = [...renewServiceForms];
                        const perDay = opt?.oneDayFee || 0;
                        const days = Number(newForms[idx].days) || 0;
                        const total = perDay * days;
                        newForms[idx] = {
                          ...newForms[idx],
                          serviceId: opt?.value || '',
                          serviceName: opt?.label || '',
                          perDayFee: perDay,
                          totalFee: total,
                        };
                        setRenewServiceForms(newForms);
                      }}
                      placeholder="Select Service"
                      isClearable
                      classNamePrefix="react-select"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={svcForm.startDate}
                      onChange={e => {
                        const start = e.target.value;
                        const days = Number(svcForm.days) || 0;
                        let end = '';
                        if (start && days > 0) {
                          const ed = new Date(start);
                          ed.setDate(ed.getDate() + days);
                          end = ed.toISOString().split('T')[0];
                        }
                        const newForms = [...renewServiceForms];
                        newForms[idx] = { ...newForms[idx], startDate: start, endDate: end };
                        setRenewServiceForms(newForms);
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">End Date (auto)</label>
                    <input
                      type="date"
                      value={svcForm.endDate}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Days</label>
                    <input
                      type="number"
                      min="1"
                      value={svcForm.days}
                      onChange={e => {
                        const days = Number(e.target.value) || 0;
                        const perDay = Number(svcForm.perDayFee) || 0;
                        const total = perDay * days;
                        const start = svcForm.startDate;
                        let end = '';
                        if (start && days > 0) {
                          const ed = new Date(start);
                          ed.setDate(ed.getDate() + days);
                          end = ed.toISOString().split('T')[0];
                        }
                        const newForms = [...renewServiceForms];
                        newForms[idx] = { ...newForms[idx], days, totalFee: total, endDate: end };
                        setRenewServiceForms(newForms);
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Per Day Fee (₹)</label>
                    <input
                      type="number"
                      value={svcForm.perDayFee}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Total (₹)</label>
                    <input
                      type="number"
                      value={svcForm.totalFee}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Payment</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Paid Amount</label>
                      <input
                        type="number"
                        value={svcForm.paidAmount}
                        onChange={e => {
                          const paid = Number(e.target.value) || 0;
                          const total = Number(svcForm.totalFee) || 0;
                          const remaining = Math.max(0, total - paid);
                          const status = remaining <= 0 && paid > 0 ? 'Paid' : 'Pending';
                          const newForms = [...renewServiceForms];
                          newForms[idx] = { ...newForms[idx], paidAmount: paid, remainingAmount: remaining, paymentStatus: status };
                          setRenewServiceForms(newForms);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="₹ Amount"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Remaining</label>
                      <input
                        type="number"
                        value={svcForm.remainingAmount}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Status</label>
                      <input
                        value={svcForm.paymentStatus}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Mode</label>
                      <select
                        value={svcForm.paymentMode}
                        onChange={e => {
                          const newForms = [...renewServiceForms];
                          newForms[idx] = { ...newForms[idx], paymentMode: e.target.value };
                          setRenewServiceForms(newForms);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      >
                        {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Date</label>
                      <input
                        type="date"
                        value={svcForm.paymentDate}
                        onChange={e => {
                          const newForms = [...renewServiceForms];
                          newForms[idx] = { ...newForms[idx], paymentDate: e.target.value };
                          setRenewServiceForms(newForms);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={svcForm.description}
                        onChange={e => {
                          const newForms = [...renewServiceForms];
                          newForms[idx] = { ...newForms[idx], description: e.target.value };
                          setRenewServiceForms(newForms);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Service Renewal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Responsible Staff</label>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadStaffOptions}
                        value={svcForm.responsibleStaffObj}
                        onChange={option => {
                          const newForms = [...renewServiceForms];
                          newForms[idx] = { ...newForms[idx], responsibleStaff: option ? option.value : '', responsibleStaffObj: option };
                          setRenewServiceForms(newForms);
                        }}
                        placeholder="Search staff..."
                        isClearable
                        classNamePrefix="react-select"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeRenewModal}
                disabled={savingRenewal}
                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRenewSubmit}
                disabled={savingRenewal}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                {savingRenewal ? 'Processing...' : 'Submit Renewal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Collect Payment Modal ────────────────────────────────── */}
      {showModal && selectedAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Collect Payment</h2>
              <button onClick={closePaymentModal} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            {/* Admission info */}
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold">{selectedAdmission.fullName}</span> — {selectedAdmission.admissionId}</p>
              <p>Pending: ₹{(selectedAdmission.remainingAmount || 0).toLocaleString('en-IN')}</p>
            </div>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={e => setPaymentForm(p => ({ ...p, amount: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="₹ Amount"
                />
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Mode</label>
                <select
                  value={paymentForm.paymentMode}
                  onChange={e => setPaymentForm(p => ({ ...p, paymentMode: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                >
                  {PAYMENT_MODES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={e => setPaymentForm(p => ({ ...p, paymentDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={paymentForm.description}
                  onChange={e => setPaymentForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Pending Fees"
                />
              </div>

              {/* Responsible Staff */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Responsible Staff</label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadStaffOptions}
                  value={selectedStaffOption}
                  onChange={option => {
                    setSelectedStaffOption(option);
                    setPaymentForm(p => ({ ...p, responsibleStaff: option ? option.value : '' }));
                  }}
                  placeholder="Search staff..."
                  isClearable
                  classNamePrefix="react-select"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closePaymentModal}
                disabled={savingPayment}
                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCollectPayment}
                disabled={savingPayment || !paymentForm.amount || Number(paymentForm.amount) <= 0}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                {savingPayment ? 'Processing...' : 'Collect Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
