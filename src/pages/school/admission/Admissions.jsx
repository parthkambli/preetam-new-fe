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
import Select from 'react-select';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const PAYMENT_MODES = ['Cash', 'Bank Transfer'];

const emptyPaymentForm = {
  amount: '',
  paymentMode: 'Cash',
  paymentDate: new Date().toISOString().split('T')[0],
  description: '',
  responsibleStaff: '',
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
  const [staffList, setStaffList] = useState([]);

  const [filters, setFilters] = useState({
    admissionId: '',
    name: '',
    mobile: '',
    feePlan: '',
    status: ''
  });

  useEffect(() => {
    fetchAdmissions();
  }, [filters]);

  // ── Load staff list when modal opens ─────────────────────────
  useEffect(() => {
    if (showModal && staffList.length === 0) {
      api.fitnessStaff.getAll().then(res => {
        setStaffList(res.data?.data?.staff || res.data?.staff || res.data || []);
      }).catch(() => {});
    }
  }, [showModal, staffList.length]);

  const fetchAdmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.admissionId) params.admissionId = filters.admissionId;
      if (filters.name) params.name = filters.name;
      if (filters.mobile) params.mobile = filters.mobile;
      if (filters.feePlan) params.feePlan = filters.feePlan;
      if (filters.status) params.status = filters.status;
      
      const response = await api.schoolAdmission.getAll(params);
      setAdmissions(response.data);
    } catch (err) {
      setError('Failed to load admissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // ── Toggle status ────────────────────────────────────────────
  const toggleStatus = async (adm) => {
    const newStatus = adm.status === 'Active' ? 'Inactive' : 'Active';

    setAdmissions(prev =>
      prev.map(item =>
        item._id === adm._id ? { ...item, status: newStatus } : item
      )
    );

    try {
      await api.schoolAdmission.update(adm._id, { status: newStatus });

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
    setPaymentForm({
      amount: adm.remainingAmount || '',
      paymentMode: 'Cash',
      paymentDate: new Date().toISOString().split('T')[0],
      description: adm.feeDescription || 'School Fee',
      responsibleStaff: '',
    });
    setShowModal(true);
  };

  const closePaymentModal = () => {
    setShowModal(false);
    setSelectedAdmission(null);
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

  // ── Select options ───────────────────────────────────────────
  const staffOptions = staffList.map(s => ({
    value: s._id,
    label: s.fullName,
  }));

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
          placeholder="Admission ID"
          className="border rounded px-4 py-2 min-w-[180px]"
          value={filters.admissionId}
          onChange={(e) => handleFilterChange('admissionId', e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          className="border rounded px-4 py-2 min-w-[180px]"
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
        />
        <input
          type="text"
          placeholder="Mobile"
          className="border rounded px-4 py-2 min-w-[180px]"
          value={filters.mobile}
          onChange={(e) => handleFilterChange('mobile', e.target.value)}
        />
        <select 
          className="border rounded px-4 py-2"
          value={filters.feePlan}
          onChange={(e) => handleFilterChange('feePlan', e.target.value)}
        >
          <option value="">Fee Plan</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Annual</option>
        </select>
        <select 
          className="border rounded px-4 py-2"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
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
                    
                    {/* Editable Status */}
                    <td className="p-4">
                      <button
                        onClick={() => toggleStatus(adm)}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${
                          adm.status === 'Active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {adm.status}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  placeholder="Fee description"
                />
              </div>

              {/* Responsible Staff */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Responsible Staff</label>
                <Select
                  options={staffOptions}
                  onChange={option => setPaymentForm(p => ({ ...p, responsibleStaff: option ? option.value : '' }))}
                  value={staffOptions.find(o => o.value === paymentForm.responsibleStaff) || null}
                  placeholder="Select staff..."
                  isClearable
                  isSearchable
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
