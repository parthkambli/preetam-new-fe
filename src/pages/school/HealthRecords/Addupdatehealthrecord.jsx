// // pages/school/HealthRecords/AddUpdateHealthRecord.jsx

// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// // Shared mock data – same source as other pages
// const records = [
//   {
//     id: 1,
//     name: 'Ram',
//     date: '2026-01-12',
//     time: '10:30',
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
//     date: '2025-12-05',
//     time: '18:00',
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
//     date: '2025-10-18',
//     time: '11:15',
//     doctor: 'Dr. Mehta',
//     diagnosis: 'Chest Infection',
//     status: 'Critical',
//     notes: 'Chest infection detected. Antibiotics prescribed.',
//     medications: 'Antibiotics, Cough Syrup',
//     report: 'Medical_Report_Oct_2025.pdf',
//   },
// ];

// const STATUS_OPTIONS = ['Stable', 'Critical', 'Recovering', 'Under Observation'];

// const emptyForm = {
//   name:        '',
//   date:        '',
//   time:        '',
//   doctor:      '',
//   notes:       '',
//   medications: '',
//   status:      'Stable',
//   reportFile:  null,
// };

// export default function AddUpdateHealthRecord() {
//   const { id }   = useParams();          // present when editing
//   const navigate = useNavigate();

//   const isEdit      = Boolean(id);
//   const existing    = isEdit ? records.find((r) => r.id === Number(id)) : null;

//   const [form, setForm] = useState(
//     existing
//       ? {
//           name:        existing.name,
//           date:        existing.date,
//           time:        existing.time,
//           doctor:      existing.doctor,
//           notes:       existing.notes,
//           medications: existing.medications,
//           status:      existing.status,
//           reportFile:  null,
//         }
//       : emptyForm
//   );

//   const [fileName, setFileName] = useState(existing?.report ?? '');

//   const handleChange = (field, value) =>
//     setForm((prev) => ({ ...prev, [field]: value }));

//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//       setForm((prev) => ({ ...prev, reportFile: file }));
//     }
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     if (!form.name || !form.date || !form.doctor) return;
//     // In a real app: call API here
//     navigate('/school/health-records');
//   };

//   const handleCancel = () => navigate('/school/health-records');

//   return (
//     <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

//       {/* Page Title */}
//       <h1 className="text-xl font-bold text-gray-800 mb-6">
//         Add\Update Health Check up
//       </h1>

//       {/* Form Card */}
//       <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white max-w-4xl space-y-5">
//         <h2 className="text-sm font-bold text-[#1e3a8a]">Add\Update Health Checkup</h2>

//         {/* Name | Date | Time */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Name</label>
//             <input
//               type="text"
//               placeholder="Enter Name"
//               value={form.name}
//               onChange={(e) => handleChange('name', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Date</label>
//             <input
//               type="date"
//               value={form.date}
//               onChange={(e) => handleChange('date', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Time</label>
//             <input
//               type="time"
//               value={form.time}
//               onChange={(e) => handleChange('time', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//         </div>

//         {/* Doctor / Clinic */}
//         <div className="max-w-sm">
//           <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Doctor / Clinic</label>
//           <input
//             type="text"
//             placeholder="Doctor or hospital name"
//             value={form.doctor}
//             onChange={(e) => handleChange('doctor', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//         </div>

//         {/* Diagnosis / Notes */}
//         <div>
//           <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</label>
//           <textarea
//             rows={4}
//             placeholder="Enter diagnosis or notes"
//             value={form.notes}
//             onChange={(e) => handleChange('notes', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
//           />
//         </div>

//         {/* Medications | Health Status */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Medications</label>
//             <input
//               type="text"
//               placeholder="BP tablet, Sugar tablet"
//               value={form.medications}
//               onChange={(e) => handleChange('medications', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Health Status</label>
//             <select
//               value={form.status}
//               onChange={(e) => handleChange('status', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               {STATUS_OPTIONS.map((s) => (
//                 <option key={s}>{s}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Attach Reports */}
//         <div>
//           <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Attach Reports</label>
//           <div className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white flex items-center gap-3">
//             <label className="cursor-pointer">
//               <span className="border border-gray-400 rounded px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-100 transition-colors">
//                 Choose File
//               </span>
//               <input
//                 type="file"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 className="hidden"
//                 onChange={handleFile}
//               />
//             </label>
//             <span className="text-gray-500 text-xs truncate">
//               {fileName || 'No file chosen'}
//             </span>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-3 pt-1">
//           <button
//             onClick={handleSave}
//             className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200"
//           >
//             Save Health Record
//           </button>
//           <button
//             onClick={handleCancel}
//             className="border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2 rounded-md hover:bg-gray-50 active:scale-95 transition-all duration-200"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }












// pages/school/HealthRecords/AddUpdateHealthRecord.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const STATUS_OPTIONS = ['Stable', 'Critical', 'Recovering', 'Under Observation'];

const emptyForm = {
  name: '',
  date: '',
  time: '',
  doctor: '',
  diagnosis: '',
  medications: '',
  status: 'Stable',
  reportFile: null,
};

export default function AddUpdateHealthRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Load existing record if editing
  useEffect(() => {
    if (isEdit) {
      const loadRecord = async () => {
        try {
          const res = await api.healthRecords.getAll(); // or create getById if you want
          const record = (res.data?.data || res.data || []).find(r => r._id === id);
          if (record) {
            setForm({
              name: record.name || '',
              date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
              time: record.time || '',
              doctor: record.doctor || '',
              diagnosis: record.diagnosis || '',
              medications: record.medications || '',
              status: record.status || 'Stable',
              reportFile: null,
            });
            setFileName(record.reportFile ? record.reportFile.split('/').pop() : '');
          }
        } catch (err) {
          toast.error("Failed to load record");
        }
      };
      loadRecord();
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setForm(prev => ({ ...prev, reportFile: file }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    if (!form.doctor.trim()) newErrors.doctor = "Doctor/Clinic is required";
    if (!form.status) newErrors.status = "Status is required";

    // Date cannot be in past
    if (form.date) {
      const selected = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0]); // Show first error
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('date', form.date);
      formData.append('time', form.time);
      formData.append('doctor', form.doctor);
      formData.append('diagnosis', form.diagnosis || '');
      formData.append('medications', form.medications || '');
      formData.append('status', form.status);

      if (form.reportFile) {
        formData.append('reportFile', form.reportFile);
      }

      if (isEdit) {
        await api.healthRecords.update(id, formData);
        toast.success("Health record updated successfully");
      } else {
        await api.healthRecords.create(formData);
        toast.success("Health record saved successfully");
      }

      navigate('/school/health-records');
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save health record";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/school/health-records');
  };

  return (
    <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

      <h1 className="text-xl font-bold text-gray-800 mb-6">
        Add Health Check up
      </h1>

      <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white max-w-4xl space-y-5">
        <h2 className="text-sm font-bold text-[#1e3a8a]">Add Health Checkup</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.date ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.time ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Doctor / Clinic</label>
          <input
            type="text"
            placeholder="Doctor or hospital name"
            value={form.doctor}
            onChange={(e) => handleChange('doctor', e.target.value)}
            className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              errors.doctor ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.doctor && <p className="mt-1 text-xs text-red-500">{errors.doctor}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</label>
          <textarea
            rows={4}
            placeholder="Enter diagnosis or notes"
            value={form.diagnosis}
            onChange={(e) => handleChange('diagnosis', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Medications</label>
            <input
              type="text"
              placeholder="BP tablet, Sugar tablet"
              value={form.medications}
              onChange={(e) => handleChange('medications', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Health Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Attach Reports</label>
          <div className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white flex items-center gap-3">
            <label className="cursor-pointer">
              <span className="border border-gray-400 rounded px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-100 transition-colors">
                Choose File
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFile}
              />
            </label>
            <span className="text-gray-500 text-xs truncate">
              {fileName || 'No file chosen'}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200 disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Health Record'}
          </button>
          <button
            onClick={handleCancel}
            className="border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2 rounded-md hover:bg-gray-50 active:scale-95 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}