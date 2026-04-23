










// // pages/school/Fees/FeeTypes.jsx

// import { useState } from 'react';

// const FEE_TYPE_OPTS = ['Visitor', 'Residency', 'Membership Pass'];

// const initialFeeTypes = [
//   { id: 1, description: 'Senior Citizen Happiness School (Age 55+)',    annual: 36000, monthly: 3600, weekly: 900,  daily: 180, hourly: 30,  type: 'School'    },
//   { id: 2, description: 'Anand Nivas — Regular Room (Residency)',        annual: 36000, monthly: 3600, weekly: 900,  daily: 180, hourly: 30,  type: 'Residency' },
//   { id: 3, description: 'Anand Nivas-Regular Room (AC)(Residency)',      annual: 48000, monthly: 4800, weekly: 1200, daily: 240, hourly: 40,  type: 'Residency' },
//   { id: 4, description: 'Anand Nivas — Deluxe Room (Residency)',         annual: 60000, monthly: 6000, weekly: 1500, daily: 300, hourly: 50,  type: 'Residency' },
//   { id: 5, description: 'Anand Nivas — Premium Room (Residency)',        annual: 72000, monthly: 7200, weekly: 1800, daily: 360, hourly: 60,  type: 'Residency' },
//   { id: 6, description: 'Anand School (1st Year) Breakfast, Lunch Dinner', annual: 60000, monthly: 6000, weekly: 1500, daily: 300, hourly: 50,  type: 'School' },
//   { id: 7, description: 'Anand School (2nd Year) — Breakfast, Lunch Dinner', annual: 54000, monthly: 5400, weekly: 1350, daily: 270, hourly: 45,  type: 'School' },
//   { id: 8, description: 'Anand Nivas — Day Care (Full Day Stay)',         annual: 30000, monthly: 3000, weekly: 750,  daily: 150, hourly: 25,  type: 'DayCare'  },
// ];

// const emptyForm = { 
//   description: '', 
//   annual: '', 
//   monthly: '', 
//   weekly: '', 
//   daily: '', 
//   hourly: '', 
//   type: 'School' 
// };

// export default function FeeTypes() {
//   const [feeTypes, setFeeTypes] = useState(initialFeeTypes);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [form, setForm] = useState(emptyForm);

//   const handleChange = (field, value) =>
//     setForm((prev) => ({ ...prev, [field]: value }));

//   const handleAddClick = () => {
//     setEditId(null);
//     setForm(emptyForm);
//     setShowForm(true);
//   };

//   const handleEdit = (row) => {
//     setEditId(row.id);
//     setForm({
//       description: row.description,
//       annual: row.annual,
//       monthly: row.monthly,
//       weekly: row.weekly,
//       daily: row.daily,
//       hourly: row.hourly || '',
//       type: row.type,
//     });
//     setShowForm(true);
//   };

//   const handleDelete = (id) =>
//     setFeeTypes((prev) => prev.filter((f) => f.id !== id));

//   const handleSave = () => {
//     if (!form.description) return;

//     const newData = {
//       ...form,
//       annual: Number(form.annual) || 0,
//       monthly: Number(form.monthly) || 0,
//       weekly: Number(form.weekly) || 0,
//       daily: Number(form.daily) || 0,
//       hourly: Number(form.hourly) || 0,
//     };

//     if (editId) {
//       setFeeTypes((prev) =>
//         prev.map((f) =>
//           f.id === editId ? { ...f, ...newData } : f
//         )
//       );
//     } else {
//       setFeeTypes((prev) => [
//         ...prev,
//         {
//           id: prev.length + 1,
//           ...newData,
//         },
//       ]);
//     }

//     setShowForm(false);
//     setEditId(null);
//     setForm(emptyForm);
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setEditId(null);
//     setForm(emptyForm);
//   };

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-base font-semibold text-gray-800">Fee Types</h2>
//         <button
//           onClick={handleAddClick}
//           className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors"
//         >
//           Add Fee
//         </button>
//       </div>

//       {/* Add / Edit Form */}
//       {showForm && (
//         <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
//           <h3 className="text-base font-semibold text-gray-800">
//             {editId ? 'Edit Fee Type' : 'Add Fee Type'}
//           </h3>

//           {/* Description */}
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Description</label>
//             <input
//               type="text"
//               placeholder="Enter description"
//               value={form.description}
//               onChange={(e) => handleChange('description', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>

//           {/* Fee Amounts - Now 5 columns */}
//           <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
//             {[
//               { field: 'annual', label: 'Annual' },
//               { field: 'monthly', label: 'Monthly' },
//               { field: 'weekly', label: 'Weekly' },
//               { field: 'daily', label: 'Daily' },
//               { field: 'hourly', label: 'Hourly' },
//             ].map(({ field, label }) => (
//               <div key={field}>
//                 <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">{label}</label>
//                 <input
//                   type="number"
//                   placeholder="₹ Amount"
//                   value={form[field]}
//                   onChange={(e) => handleChange(field, e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Type */}
//           <div className="max-w-xs">
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Type</label>
//             <select
//               value={form.type}
//               onChange={(e) => handleChange('type', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               {FEE_TYPE_OPTS.map((t) => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//           </div>

//           {/* Save / Cancel */}
//           <div className="flex gap-3">
//             <button
//               onClick={handleSave}
//               className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-sm font-semibold px-6 py-2 rounded-md transition-colors"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleCancel}
//               className="border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2 rounded-md hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="w-full min-w-[900px] border-collapse">
//           <thead>
//             <tr className="bg-[#1e3a8a]">
//               {['Sr', 'Description', 'Annual', 'Monthly', 'Weekly', 'Daily', 'Hourly', 'Type', 'Actions'].map((h) => (
//                 <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {feeTypes.length === 0 ? (
//               <tr>
//                 <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">
//                   No fee types found.
//                 </td>
//               </tr>
//             ) : (
//               feeTypes.map((row, idx) => (
//                 <tr
//                   key={row.id}
//                   className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
//                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
//                   }`}
//                 >
//                   <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700 max-w-[220px]">{row.description}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.annual.toLocaleString()}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.monthly.toLocaleString()}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.weekly.toLocaleString()}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.daily}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.hourly || 0}</td>
//                   <td className="px-4 py-3 text-sm text-gray-700">{row.type}</td>
//                   <td className="px-4 py-3 text-sm">
//                     <div className="flex gap-1.5">
//                       <button
//                         onClick={() => handleEdit(row)}
//                         className="border border-gray-300 text-gray-600 text-xs font-medium px-2.5 py-1 rounded hover:bg-gray-100 transition-colors"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(row.id)}
//                         className="border border-red-300 text-red-500 text-xs font-medium px-2.5 py-1 rounded hover:bg-red-50 transition-colors"
//                       >
//                         Delete
//                       </button>
//                     </div>
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



















import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const FEE_TYPE_OPTS = ['Visitor', 'Residency', 'Membership Pass'];

const emptyForm = {
  description: '',
  annual: '',
  halfYearly: '',   // ✅
  quarterly: '',    // ✅
  monthly: '',
  weekly: '',
  daily: '',
  hourly: '',
  type: 'Membership Pass',
};

export default function FitnessFeeTypes() {
  const [feeTypes, setFeeTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const fetchFeeTypes = async () => {
    try {
      setLoading(true);
      console.log('🔄 [Frontend] Fetching fee types...');
      const res = await api.fitnessFees.getTypes();
      console.log('✅ [Frontend] Fetched fee types:', res.data);
      setFeeTypes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('❌ [Frontend] Fetch error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      toast.error(err.response?.data?.message || 'Failed to load fee types');
      setFeeTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const handleChange = (field, value) => {
    console.log(`🔄 [Frontend] Field changed → ${field}: ${value}`);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddClick = () => {
    console.log('➕ [Frontend] Add new fee type clicked');
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    console.log('✏️ [Frontend] Editing fee type:', row);
    setEditId(row._id);
    setForm({
      description: row.description || '',
      annual: row.annual ?? '',
      halfYearly: row.halfYearly ?? '',   // ✅
      quarterly: row.quarterly ?? '',     // ✅
      monthly: row.monthly ?? '',
      weekly: row.weekly ?? '',
      daily: row.daily ?? '',
      hourly: row.hourly ?? '',
      type: FEE_TYPE_OPTS.includes(row.type) ? row.type : 'Membership Pass',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee type?')) return;
    try {
      console.log('🗑️ [Frontend] Deleting fee type ID:', id);
      await api.fitnessFees.deleteType(id);
      setFeeTypes((prev) => prev.filter((f) => f._id !== id));
      toast.success('Fee type deleted successfully');
      console.log('✅ [Frontend] Delete successful');
    } catch (err) {
      console.error('❌ [Frontend] Delete error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to delete fee type');
    }
  };

  const handleSave = async () => {
    console.log('💾 [Frontend] handleSave triggered');
    console.log('📋 [Frontend] Current form:', form);

    if (!form.description?.trim()) {
      toast.error('Description is required');
      console.warn('❌ [Frontend] Validation failed: Description is empty');
      return;
    }

    if (!FEE_TYPE_OPTS.includes(form.type)) {
      toast.error(`Invalid category. Must be one of: ${FEE_TYPE_OPTS.join(', ')}`);
      console.warn('❌ [Frontend] Validation failed: Invalid type', form.type);
      return;
    }

    const payload = {
      description: form.description.trim(),
      type: form.type,
      annual: Number(form.annual) || 0,
      halfYearly: Number(form.halfYearly) || 0,   // ✅
      quarterly: Number(form.quarterly) || 0,     // ✅
      monthly: Number(form.monthly) || 0,
      weekly: Number(form.weekly) || 0,
      daily: Number(form.daily) || 0,
      hourly: Number(form.hourly) || 0,
    };

    console.log('📤 [Frontend] Sending payload to backend:', payload);

    try {
      let res;
      if (editId) {
        console.log('🔄 [Frontend] Updating fee type ID:', editId);
        res = await api.fitnessFees.updateType(editId, payload);
        toast.success('Fee type updated successfully');
      } else {
        console.log('🆕 [Frontend] Creating new fee type');
        res = await api.fitnessFees.createType(payload);
        toast.success('Fee type created successfully');
      }

      console.log('✅ [Frontend] Backend response success:', res.data);
      fetchFeeTypes();
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error('❌ [Frontend] Save failed with full error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      toast.error(err.response?.data?.message || 'Failed to save fee type');
    }
  };

  const handleCancel = () => {
    console.log('❌ [Frontend] Form cancelled');
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Fitness Fee Types</h2>
        <button
          onClick={handleAddClick}
          className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors"
        >
          Add Fitness Fee
        </button>
      </div>

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
          <h3 className="text-base font-semibold text-gray-800">
            {editId ? 'Edit Fitness Fee Type' : 'Add Fitness Fee Type'}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. Yoga Class - Monthly"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {['annual', 'halfYearly', 'quarterly', 'monthly', 'weekly', 'daily', 'hourly'].map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-[#1e3a8a] mb-1 capitalize">{field}</label>
                <input
                  type="number"
                  placeholder="₹ Amount"
                  value={form[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            ))}
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Category</label>
            <select
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {FEE_TYPE_OPTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white px-6 py-2 rounded-md text-sm font-semibold"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="border border-gray-300 px-5 py-2 rounded-md text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a]">
              {['Sr', 'Description', 'Annual', 'Half-Yearly', 'Quarterly', 'Monthly', 'Weekly', 'Daily', 'Hourly', 'Type', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="py-8 text-center text-gray-500">Loading...</td></tr>
            ) : feeTypes.length === 0 ? (
              <tr><td colSpan={9} className="py-8 text-center text-gray-400">No fitness fee types found</td></tr>
            ) : (
              feeTypes.map((row, idx) => (
                <tr key={row._id} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 max-w-[280px]">{row.description}</td>
                  <td className="px-4 py-3">{row.annual?.toLocaleString() || 0}</td>
                  <td>{row.halfYearly?.toLocaleString() || 0}</td>
                  <td>{row.quarterly?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3">{row.monthly?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3">{row.weekly?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3">{row.daily?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3">{row.hourly?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(row)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
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