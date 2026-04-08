// // pages/school/HealthRecords/ViewHealthRecords.jsx

// import { useParams, useNavigate } from 'react-router-dom';

// // Shared mock data – in a real app this would come from an API / context
// const records = [
//   {
//     id: 1,
//     name: 'Ram',
//     date: '12/01/2026',
//     time: '10:30 AM',
//     doctor: 'Dr. Kulkarni',
//     diagnosis: 'Routine Checkup',
//     status: 'Stable',
//     notes:
//       'Routine health check-up completed.\nBP and sugar levels are normal.\nNo emergency symptoms observed.',
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

// /** A plain read-only field box */
// function ReadField({ label, value, className = '' }) {
//   return (
//     <div className={className}>
//       <p className="text-xs font-semibold text-[#1e3a8a] mb-1">{label}</p>
//       <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-sm text-gray-700 min-h-[38px] whitespace-pre-wrap break-words">
//         {value || '—'}
//       </div>
//     </div>
//   );
// }

// export default function ViewHealthRecords() {
//   const { id }   = useParams();
//   const navigate = useNavigate();

//   const record = records.find((r) => r.id === Number(id));

//   if (!record) {
//     return (
//       <div className="p-6 font-sans">
//         <p className="text-gray-500 text-sm">Record not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
//         <h1 className="text-xl font-bold text-gray-800">View Health Records</h1>
//         <button
//           onClick={() => navigate(`/school/health-records/add-update/${record.id}`)}
//           className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200 whitespace-nowrap self-start"
//         >
//           Add\Update Health Check up
//         </button>
//       </div>

//       {/* Card */}
//       <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white space-y-5 max-w-4xl">
//         <h2 className="text-sm font-bold text-[#1e3a8a]">View Health Report</h2>

//         {/* Row 1: Date | Time | Doctor */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <ReadField label="Date"           value={record.date}   />
//           <ReadField label="Time"           value={record.time}   />
//           <ReadField label="Doctor / Clinic" value={record.doctor} />
//         </div>

//         {/* Health Status */}
//         <ReadField label="Health Status" value={record.status} className="max-w-xs" />

//         {/* Diagnosis / Notes */}
//         <div>
//           <p className="text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</p>
//           <div className="border border-gray-200 rounded-md px-3 py-3 bg-gray-50 text-sm text-gray-700 min-h-[100px] whitespace-pre-wrap">
//             {record.notes}
//           </div>
//         </div>

//         {/* Medications */}
//         <ReadField label="Medications" value={record.medications} />

//         {/* Attached Report */}
//         <ReadField label="Attached Report" value={record.report} />
//       </div>
//     </div>
//   );
// }












// // pages/school/HealthRecords/ViewHealthRecords.jsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const STATUS_OPTIONS = ['Stable', 'Critical', 'Recovering', 'Under Observation'];

// function ReadField({ label, value, className = '' }) {
//   return (
//     <div className={className}>
//       <p className="text-xs font-semibold text-[#1e3a8a] mb-1">{label}</p>
//       <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-sm text-gray-700 min-h-[38px] whitespace-pre-wrap break-words">
//         {value || '—'}
//       </div>
//     </div>
//   );
// }

// function InputField({ label, name, value, onChange, type = 'text', error }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">
//         {label}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={value || ''}
//         onChange={onChange}
//         className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300
//           ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
//       />
//       {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//     </div>
//   );
// }

// function SelectField({ label, name, value, onChange, options, error }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">
//         {label}
//       </label>
//       <select
//         name={name}
//         value={value || ''}
//         onChange={onChange}
//         className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300
//           ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
//       >
//         {options.map((s) => (
//           <option key={s} value={s}>{s}</option>
//         ))}
//       </select>
//       {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//     </div>
//   );
// }

// export default function ViewHealthRecords() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [record, setRecord] = useState(null);
//   const [isEditing, setIsEditing] = useState(location.state?.editMode === true);
//   const [form, setForm] = useState({});
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch record
//   useEffect(() => {
//     const fetchRecord = async () => {
//       try {
//         setLoading(true);
//         const res = await api.healthRecords.getAll();
//         const allRecords = res.data?.data || res.data || [];
//         const found = allRecords.find(r => r._id === id);

//         if (!found) {
//           toast.error("Health record not found");
//           navigate('/school/health-records');
//           return;
//         }

//         setRecord(found);
//         setForm({
//           name: found.name || '',
//           date: found.date ? new Date(found.date).toISOString().split('T')[0] : '',
//           time: found.time || '',
//           doctor: found.doctor || '',
//           diagnosis: found.diagnosis || found.notes || '',
//           medications: found.medications || '',
//           status: found.status || 'Stable',
//         });
//       } catch (err) {
//         const msg = err.response?.data?.message || "Failed to load health record";
//         toast.error(msg);
//         navigate('/school/health-records');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecord();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!form.name?.trim()) errors.name = "Name is required";
//     if (!form.date) errors.date = "Date is required";
//     if (!form.time) errors.time = "Time is required";
//     if (!form.doctor?.trim()) errors.doctor = "Doctor / Clinic is required";
//     if (!form.status) errors.status = "Health status is required";

//     if (form.date) {
//       const selectedDate = new Date(form.date);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       if (selectedDate < today) {
//         errors.date = "Date cannot be in the past";
//       }
//     }
//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       toast.error(Object.values(errors)[0]);
//       return;
//     }

//     setSaving(true);

//     try {
//       const formData = new FormData();
//       formData.append('name', form.name.trim());
//       formData.append('date', form.date);
//       formData.append('time', form.time);
//       formData.append('doctor', form.doctor.trim());
//       formData.append('diagnosis', form.diagnosis?.trim() || '');
//       formData.append('medications', form.medications?.trim() || '');
//       formData.append('status', form.status);

//       await api.healthRecords.update(id, formData);

//       toast.success("Health record updated successfully!");

//       // Refresh data and switch back to view mode
//       const res = await api.healthRecords.getAll();
//       const updated = (res.data?.data || res.data || []).find(r => r._id === id);
//       setRecord(updated);
//       setIsEditing(false);

//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to update health record";
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const enterEditMode = () => {
//     setIsEditing(true);
//     navigate(`/school/health-records/view/${id}`, { 
//       replace: true, 
//       state: { editMode: true } 
//     });
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setFieldErrors({});
//     navigate(`/school/health-records/view/${id}`, { 
//       replace: true, 
//       state: {} 
//     });
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-gray-500">Loading health record...</div>;
//   }

//   if (!record) {
//     return <div className="p-6 text-red-500">Record not found.</div>;
//   }

//   // ====================== VIEW MODE ======================
//   if (!isEditing) {
//     return (
//       <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">
//         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
//           <h1 className="text-xl font-bold text-gray-800">View Health Records</h1>
//           <button
//             onClick={() => navigate('/school/health-records/add-update')}
//             className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200"
//           >
//             Add Health Check up
//           </button>
//         </div>

//         <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white space-y-5 max-w-4xl">
//           <h2 className="text-sm font-bold text-[#1e3a8a]">View Health Report</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <ReadField label="Date" value={record.date ? new Date(record.date).toLocaleDateString('en-GB') : '—'} />
//             <ReadField label="Time" value={record.time} />
//             <ReadField label="Doctor / Clinic" value={record.doctor} />
//           </div>

//           <ReadField label="Health Status" value={record.status} className="max-w-xs" />

//           <div>
//             <p className="text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</p>
//             <div className="border border-gray-200 rounded-md px-3 py-3 bg-gray-50 text-sm text-gray-700 min-h-[100px] whitespace-pre-wrap">
//               {record.diagnosis || record.notes || '—'}
//             </div>
//           </div>

//           <ReadField label="Medications" value={record.medications} />
//           <ReadField label="Attached Report" value={record.reportFile ? record.reportFile.split('/').pop() : 'No report attached'} />

//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
//             <button
//               onClick={() => navigate('/school/health-records')}
//               className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//             >
//               Back to List
//             </button>
//             <button
//               onClick={enterEditMode}
//               className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white px-6 py-2.5 rounded-md font-semibold"
//             >
//               Edit This Record
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ====================== EDIT MODE ======================
//   return (
//     <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">
//       <h1 className="text-xl font-bold text-gray-800 mb-6">Edit Health Record</h1>

//       <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white max-w-4xl space-y-5">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <InputField label="Name" name="name" value={form.name} onChange={handleChange} error={fieldErrors.name} />
//             <InputField label="Date" name="date" value={form.date} onChange={handleChange} type="date" error={fieldErrors.date} />
//             <InputField label="Time" name="time" value={form.time} onChange={handleChange} type="time" error={fieldErrors.time} />
//           </div>

//           <InputField label="Doctor / Clinic" name="doctor" value={form.doctor} onChange={handleChange} error={fieldErrors.doctor} />

//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</label>
//             <textarea
//               name="diagnosis"
//               value={form.diagnosis}
//               onChange={handleChange}
//               rows={4}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <InputField label="Medications" name="medications" value={form.medications} onChange={handleChange} />
//             <SelectField 
//               label="Health Status" 
//               name="status" 
//               value={form.status} 
//               onChange={handleChange} 
//               options={STATUS_OPTIONS} 
//               error={fieldErrors.status}
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={handleCancelEdit}
//               className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="flex-1 sm:flex-none bg-[#1e3a8a] hover:bg-[#1a2f72] text-white px-6 py-2.5 rounded-md font-semibold disabled:opacity-70"
//             >
//               {saving ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }







  // pages/school/HealthRecords/ViewHealthRecords.jsx
  import { useState, useEffect } from 'react';
  import { useParams, useNavigate, useLocation } from 'react-router-dom';
  import { toast } from 'sonner';
  import { api } from '../../../services/apiClient';

  const STATUS_OPTIONS = ['Stable', 'Critical', 'Recovering', 'Under Observation'];

  function ReadField({ label, value, className = '' }) {
    return (
      <div className={className}>
        <p className="text-xs font-semibold text-[#1e3a8a] mb-1">{label}</p>
        <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-sm text-gray-700 min-h-9.5 whitespace-pre-wrap wrap-break-words">
          {value || '—'}
        </div>
      </div>
    );
  }

  function InputField({ label, name, value, onChange, type = 'text', error }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300
            ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  function SelectField({ label, name, value, onChange, options, error }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">
          {label}
        </label>
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300
            ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        >
          {options.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  export default function ViewHealthRecords() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [record, setRecord] = useState(null);
    const [isEditing, setIsEditing] = useState(location.state?.editMode === true);
    const [form, setForm] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch record using getById (as requested)
    useEffect(() => {
      const fetchRecord = async () => {
        try {
          setLoading(true);
          const res = await api.healthRecords.getById(id);
          const found = res.data?.data || res.data;

          if (!found) {
            toast.error("Health record not found");
            navigate('/school/health-records');
            return;
          }

          setRecord(found);
          setForm({
            name: found.studentName || found.name || '',
            date: found.recordDate 
              ? new Date(found.recordDate).toISOString().split('T')[0] 
              : '',
            time: found.time || '',
            doctor: found.doctorName || found.doctor || '',
            diagnosis: found.diagnosis || found.notes || '',
            medications: found.prescription || found.medications || '',
            status: found.status || 'Stable',
          });
        } catch (err) {
          const msg = err.response?.data?.message || "Failed to load health record";
          toast.error(msg);
          navigate('/school/health-records');
        } finally {
          setLoading(false);
        }
      };

      fetchRecord();
    }, [id, navigate]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) {
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    const validateForm = () => {
      const errors = {};
      if (!form.name?.trim()) errors.name = "Name is required";
      if (!form.date) errors.date = "Date is required";
      if (!form.time) errors.time = "Time is required";
      if (!form.doctor?.trim()) errors.doctor = "Doctor / Clinic is required";
      if (!form.status) errors.status = "Health status is required";

      if (form.date) {
        const selectedDate = new Date(form.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          errors.date = "Date cannot be in the past";
        }
      }
      return errors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        toast.error(Object.values(errors)[0]);
        return;
      }

      setSaving(true);

      try {
        const formData = new FormData();
        formData.append('name', form.name.trim());
        formData.append('date', form.date);
        formData.append('time', form.time);
        formData.append('doctor', form.doctor.trim());
        formData.append('diagnosis', form.diagnosis?.trim() || '');
        formData.append('medications', form.medications?.trim() || '');
        formData.append('status', form.status);

        await api.healthRecords.update(id, formData);

        toast.success("Health record updated successfully!");

        // Refresh the record after update
        const res = await api.healthRecords.getById(id);
        const updated = res.data?.data || res.data;
        setRecord(updated);
        setIsEditing(false);

      } catch (err) {
        const msg = err.response?.data?.message || "Failed to update health record";
        toast.error(msg);
      } finally {
        setSaving(false);
      }
    };

    const enterEditMode = () => {
      setIsEditing(true);
      navigate(`/school/health-records/view/${id}`, { 
        replace: true, 
        state: { editMode: true } 
      });
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      setFieldErrors({});
      navigate(`/school/health-records/view/${id}`, { 
        replace: true, 
        state: {} 
      });
    };

    if (loading) {
      return <div className="p-8 text-center text-gray-500">Loading health record...</div>;
    }

    if (!record) {
      return <div className="p-6 text-red-500">Record not found.</div>;
    }

    // ====================== VIEW MODE ======================
    if (!isEditing) {
      return (
        <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-gray-800">View Health Records</h1>
            <button
              onClick={() => navigate('/school/health-records/add-update')}
              className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200"
            >
              Add Health Check up
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white space-y-5 max-w-4xl">
            <h2 className="text-sm font-bold text-[#1e3a8a]">View Health Report</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ReadField 
                label="Date" 
                value={record.recordDate 
                  ? new Date(record.recordDate).toLocaleDateString('en-GB') 
                  : record.date 
                    ? new Date(record.date).toLocaleDateString('en-GB') 
                    : '—'} 
              />
              <ReadField label="Time" value={record.time} />
              <ReadField 
                label="Doctor / Clinic" 
                value={record.doctorName || record.doctor} 
              />
            </div>

            <ReadField 
              label="Health Status" 
              value={record.status} 
              className="max-w-xs" 
            />

            <div>
              <p className="text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</p>
              <div className="border border-gray-200 rounded-md px-3 py-3 bg-gray-50 text-sm text-gray-700 min-h-25 whitespace-pre-wrap">
                {record.diagnosis || record.notes || '—'}
              </div>
            </div>

            <ReadField 
              label="Medications" 
              value={record.prescription || record.medications} 
            />
            
            <ReadField 
              label="Attached Report" 
              value={record.reportFile 
                ? record.reportFile.split('/').pop() 
                : 'No report attached'} 
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate('/school/health-records')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back to List
              </button>
              <button
                onClick={enterEditMode}
                className="bg-[#1e3a8a] hover:bg-[#1a2f72] text-white px-6 py-2.5 rounded-md font-semibold"
              >
                Edit This Record
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ====================== EDIT MODE ======================
    return (
      <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Edit Health Record</h1>

        <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white max-w-4xl space-y-5">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField label="Name" name="name" value={form.name} onChange={handleChange} error={fieldErrors.name} />
              <InputField label="Date" name="date" value={form.date} onChange={handleChange} type="date" error={fieldErrors.date} />
              <InputField label="Time" name="time" value={form.time} onChange={handleChange} type="time" error={fieldErrors.time} />
            </div>

            <InputField label="Doctor / Clinic" name="doctor" value={form.doctor} onChange={handleChange} error={fieldErrors.doctor} />

            <div>
              <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</label>
              <textarea
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Medications" name="medications" value={form.medications} onChange={handleChange} />
              <SelectField 
                label="Health Status" 
                name="status" 
                value={form.status} 
                onChange={handleChange} 
                options={STATUS_OPTIONS} 
                error={fieldErrors.status}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none bg-[#1e3a8a] hover:bg-[#1a2f72] text-white px-6 py-2.5 rounded-md font-semibold disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }