// // pages/school/HealthRecords/AddUpdateHealthRecord.jsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import Select from 'react-select';
// import { api } from '../../../services/apiClient';

// const STATUS_OPTIONS = ['Stable', 'Critical', 'Recovering', 'Under Observation'];

// const getTodayString = () => new Date().toISOString().split('T')[0];

// const emptyForm = {
//   name: '',
//   date: getTodayString(), // ← defaults to today
//   time: '',
//   doctor: '',
//   diagnosis: '',
//   medications: '',
//   status: 'Stable',
//   reportFile: null,
// };

// export default function AddUpdateHealthRecord() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = Boolean(id);

//   const [form, setForm] = useState(emptyForm);
//   const [fileName, setFileName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);

//   // React Select state
//   const [studentOptions, setStudentOptions] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [loadingStudents, setLoadingStudents] = useState(false);

//   // ── Fetch students for the dropdown ──────────────────────────────────────
//   useEffect(() => {
//     const fetchStudents = async () => {
//       setLoadingStudents(true);
//       try {
//         const res = await api.students.getAll();
//         const students = res.data?.data || res.data || [];
//         setStudentOptions(
//           students.map(s => ({
//             value: s._id,
//             label: `${s.fullName} (${s.studentId || s.admissionIdStr || ''})`,
//             // Store the full student object so we can auto-fill fields on select
//             student: s,
//           }))
//         );
//       } catch (err) {
//         toast.error('Failed to load students list.');
//       } finally {
//         setLoadingStudents(false);
//       }
//     };
//     fetchStudents();
//   }, []);

//   // ── Load existing record if editing ──────────────────────────────────────
//   useEffect(() => {
//     if (isEdit) {
//       const loadRecord = async () => {
//         try {
//           const res = await api.healthRecords.getAll();
//           const record = (res.data?.data || res.data || []).find(r => r._id === id);
//           if (record) {
//             setForm({
//               name: record.name || '',
//               date: record.date ? new Date(record.date).toISOString().split('T')[0] : getTodayString(),
//               time: record.time || '',
//               doctor: record.doctor || '',
//               diagnosis: record.diagnosis || '',
//               medications: record.medications || '',
//               status: record.status || 'Stable',
//               reportFile: null,
//             });
//             setFileName(record.reportFile ? record.reportFile.split('/').pop() : '');
//             // Re-select the student in the dropdown if we can match by name
//             // (best effort — edit mode may not always have a studentId stored)
//           }
//         } catch (err) {
//           toast.error('Failed to load record');
//         }
//       };
//       loadRecord();
//     }
//   }, [id, isEdit]);

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   const handleChange = (field, value) => {
//     setForm(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
//   };

//   // When a student is selected from the dropdown, auto-fill related fields
//   const handleStudentSelect = (option) => {
//     setSelectedStudent(option);
//     if (errors.name) setErrors(prev => ({ ...prev, name: '' }));

//     if (!option) {
//       setForm(prev => ({ ...prev, name: '' }));
//       return;
//     }

//     const s = option.student;

//     setForm(prev => ({
//       ...prev,
//       name: s.fullName || '',
//       // Auto-fill doctor name if available on the student record
//       doctor: s.doctorName?.trim() ? s.doctorName : prev.doctor,
//       // Auto-fill medications — regularMedication is "Yes"/"No", so only fill
//       // the medications field if there's actual text beyond Yes/No
//       medications:
//         s.regularMedication && s.regularMedication !== 'No' && s.regularMedication !== 'Yes'
//           ? s.regularMedication
//           : prev.medications,
//     }));
//   };

//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//       setForm(prev => ({ ...prev, reportFile: file }));
//     }
//   };

//   // ── Validation ────────────────────────────────────────────────────────────

//   const validate = () => {
//     const newErrors = {};

//     if (!form.name.trim()) newErrors.name = 'Name is required';
//     if (!form.date) newErrors.date = 'Date is required';
//     if (!form.time) newErrors.time = 'Time is required';
//     if (!form.doctor.trim()) newErrors.doctor = 'Doctor/Clinic is required';
//     if (!form.status) newErrors.status = 'Status is required';

//     return newErrors;
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       toast.error(Object.values(validationErrors)[0]);
//       return;
//     }

//     setSaving(true);

//     try {
//       const formData = new FormData();
//       formData.append('name', form.name);
//       formData.append('date', form.date);
//       formData.append('time', form.time);
//       formData.append('doctor', form.doctor);
//       formData.append('diagnosis', form.diagnosis || '');
//       formData.append('medications', form.medications || '');
//       formData.append('status', form.status);

//       if (form.reportFile) {
//         formData.append('reportFile', form.reportFile);
//       }

//       if (isEdit) {
//         await api.healthRecords.update(id, formData);
//         toast.success('Health record updated successfully');
//       } else {
//         await api.healthRecords.create(formData);
//         toast.success('Health record saved successfully');
//       }

//       navigate('/school/health-records');
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to save health record';
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => navigate('/school/health-records');

//   // ── Render ────────────────────────────────────────────────────────────────

//   return (
//     <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

//       <h1 className="text-xl font-bold text-gray-800 mb-6">
//         {isEdit ? 'Edit Health Record' : 'Add Health Check up'}
//       </h1>

//       <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white max-w-4xl space-y-5">
//         <h2 className="text-sm font-bold text-[#1e3a8a]">
//           {isEdit ? 'Edit Health Checkup' : 'Add Health Checkup'}
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

//           {/* Name — React Select pulling from students API */}
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">
//               Name<span className="text-red-500 ml-0.5">*</span>
//             </label>
//             <Select
//               options={studentOptions}
//               value={selectedStudent}
//               onChange={handleStudentSelect}
//               isLoading={loadingStudents}
//               placeholder={loadingStudents ? 'Loading students...' : 'Search student...'}
//               isClearable
//               className="text-sm"
//               classNamePrefix="react-select"
//               styles={{
//                 control: (base) => ({
//                   ...base,
//                   borderColor: errors.name ? '#f87171' : base.borderColor,
//                   backgroundColor: errors.name ? '#fef2f2' : base.backgroundColor,
//                   minHeight: '38px',
//                 }),
//                 placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
//                 singleValue: (base) => ({ ...base, fontSize: '0.875rem', color: '#374151' }),
//                 option: (base, state) => ({
//                   ...base,
//                   fontSize: '0.875rem',
//                   backgroundColor: state.isSelected ? '#1e3a8a' : state.isFocused ? '#eff6ff' : 'white',
//                   color: state.isSelected ? 'white' : '#374151',
//                 }),
//               }}
//             />
//             {errors.name && (
//               <p className="mt-1 text-xs text-red-500">{errors.name}</p>
//             )}
//           </div>

//           {/* Date — defaults to today */}
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">
//               Date<span className="text-red-500 ml-0.5">*</span>
//             </label>
//             <input
//               type="date"
//               value={form.date}
//               onChange={(e) => handleChange('date', e.target.value)}
//               className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
//                 errors.date ? 'border-red-400 bg-red-50' : 'border-gray-300'
//               }`}
//             />
//             {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
//           </div>

//           {/* Time */}
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">
//               Time<span className="text-red-500 ml-0.5">*</span>
//             </label>
//             <input
//               type="time"
//               value={form.time}
//               onChange={(e) => handleChange('time', e.target.value)}
//               className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
//                 errors.time ? 'border-red-400 bg-red-50' : 'border-gray-300'
//               }`}
//             />
//             {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
//           </div>
//         </div>

//         {/* Doctor / Clinic — auto-filled from student.doctorName if available */}
//         <div>
//           <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">
//             Doctor / Clinic<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Doctor or hospital name"
//             value={form.doctor}
//             onChange={(e) => handleChange('doctor', e.target.value)}
//             className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
//               errors.doctor ? 'border-red-400 bg-red-50' : 'border-gray-300'
//             }`}
//           />
//           {errors.doctor && <p className="mt-1 text-xs text-red-500">{errors.doctor}</p>}
//         </div>

//         {/* Diagnosis / Notes */}
//         <div>
//           <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</label>
//           <textarea
//             rows={4}
//             placeholder="Enter diagnosis or notes"
//             value={form.diagnosis}
//             onChange={(e) => handleChange('diagnosis', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
//           />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* Medications — auto-filled from student.regularMedication if it contains text */}
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

//           {/* Health Status */}
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Health Status</label>
//             <select
//               value={form.status}
//               onChange={(e) => handleChange('status', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               {STATUS_OPTIONS.map((s) => (
//                 <option key={s} value={s}>{s}</option>
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

//         {/* Actions */}
//         <div className="flex gap-3 pt-1">
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200 disabled:opacity-70"
//           >
//             {saving ? 'Saving...' : 'Save Health Record'}
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
import Select from 'react-select';
import { api } from '../../../services/apiClient';

const STATUS_OPTIONS = ['Stable', 'Critical', 'Recovering', 'Under Observation'];

const getTodayString = () => new Date().toISOString().split('T')[0];

const emptyForm = {
  name: '',
  date: getTodayString(),
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

  // React Select state
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Fetch students for dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await api.students.getAll();
        const students = res.data?.data || res.data || [];
        setStudentOptions(
          students.map(s => ({
            value: s._id,
            label: `${s.fullName} (${s.studentId || s.admissionIdStr || ''})`,
            student: s,
          }))
        );
      } catch (err) {
        toast.error('Failed to load students list.');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // Load existing record if editing
  useEffect(() => {
    if (isEdit) {
      const loadRecord = async () => {
        try {
          const res = await api.healthRecords.getAll();
          const record = (res.data?.data || res.data || []).find(r => r._id === id);
          if (record) {
            setForm({
              name: record.studentName || record.name || '',
              date: record.recordDate 
                ? new Date(record.recordDate).toISOString().split('T')[0] 
                : getTodayString(),
              time: record.time || '',
              doctor: record.doctorName || record.doctor || '',
              diagnosis: record.diagnosis || '',
              medications: record.prescription || record.medications || '',
              status: record.status || 'Stable',
              reportFile: null,
            });
            setFileName(record.reportFile ? record.reportFile.split('/').pop() : '');
          }
        } catch (err) {
          toast.error('Failed to load record');
        }
      };
      loadRecord();
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleStudentSelect = (option) => {
    setSelectedStudent(option);
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
    if (!option) {
      setForm(prev => ({ ...prev, name: '' }));
      return;
    }
    const s = option.student;
    setForm(prev => ({
      ...prev,
      name: s.fullName || '',
      doctor: s.doctorName?.trim() ? s.doctorName : prev.doctor,
      medications: s.regularMedication && 
                   s.regularMedication !== 'No' && 
                   s.regularMedication !== 'Yes' 
                   ? s.regularMedication 
                   : prev.medications,
    }));
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
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    if (!form.doctor.trim()) newErrors.doctor = 'Doctor/Clinic is required';
    if (!form.status) newErrors.status = 'Status is required';
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();

      // Fixed field names to match backend expectations
      formData.append('studentId', selectedStudent?.value || '');
      formData.append('studentName', form.name);
      formData.append('recordType', 'General Checkup');   // Required by schema
      formData.append('recordDate', form.date);
      formData.append('time', form.time);
      formData.append('doctorName', form.doctor);
      formData.append('diagnosis', form.diagnosis || '');
      formData.append('prescription', form.medications || '');
      formData.append('status', form.status);

      if (form.reportFile) {
        formData.append('reportFile', form.reportFile);
      }

      if (isEdit) {
        await api.healthRecords.update(id, formData);
        toast.success('Health record updated successfully');
      } else {
        await api.healthRecords.create(formData);
        toast.success('Health record saved successfully');
      }

      navigate('/school/health-records');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save health record';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate('/school/health-records');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-[#1e3a8a] mb-6">
          {isEdit ? 'Edit Health Record' : 'Add Health Check up'}
        </h1>

        <div className="space-y-6">
          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Name*</label>
            <Select
              options={studentOptions}
              value={selectedStudent}
              onChange={handleStudentSelect}
              isLoading={loadingStudents}
              placeholder="Select student..."
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: errors.name ? '#f87171' : base.borderColor,
                  backgroundColor: errors.name ? '#fef2f2' : base.backgroundColor,
                  minHeight: '38px',
                }),
                placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
                singleValue: (base) => ({ ...base, fontSize: '0.875rem', color: '#374151' }),
                option: (base, state) => ({
                  ...base,
                  fontSize: '0.875rem',
                  backgroundColor: state.isSelected ? '#1e3a8a' : state.isFocused ? '#eff6ff' : 'white',
                  color: state.isSelected ? 'white' : '#374151',
                }),
              }}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Date*</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.date ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Time*</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.time ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>

          {/* Doctor / Clinic */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Doctor / Clinic*</label>
            <input
              type="text"
              value={form.doctor}
              onChange={(e) => handleChange('doctor', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.doctor ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.doctor && <p className="text-red-500 text-xs mt-1">{errors.doctor}</p>}
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</label>
            <textarea
              value={form.diagnosis}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Medications */}
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

            {/* Status */}
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

          {/* Attach Reports */}
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

          {/* Actions */}
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
    </div>
  );
}












// // pages/school/HealthRecords/AddUpdateHealthRecord.jsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const STATUS_OPTIONS = ['Stable', 'Critical', 'Recovering', 'Under Observation'];

// const emptyForm = {
//   name: '',
//   date: '',
//   time: '',
//   doctor: '',
//   diagnosis: '',
//   medications: '',
//   status: 'Stable',
//   reportFile: null,
// };

// export default function AddUpdateHealthRecord() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = Boolean(id);

//   const [form, setForm] = useState(emptyForm);
//   const [fileName, setFileName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);

//   // Load existing record if editing
//   useEffect(() => {
//     if (isEdit) {
//       const loadRecord = async () => {
//         try {
//           const res = await api.healthRecords.getAll(); // or create getById if you want
//           const record = (res.data?.data || res.data || []).find(r => r._id === id);
//           if (record) {
//             setForm({
//               name: record.name || '',
//               date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
//               time: record.time || '',
//               doctor: record.doctor || '',
//               diagnosis: record.diagnosis || '',
//               medications: record.medications || '',
//               status: record.status || 'Stable',
//               reportFile: null,
//             });
//             setFileName(record.reportFile ? record.reportFile.split('/').pop() : '');
//           }
//         } catch (err) {
//           toast.error("Failed to load record");
//         }
//       };
//       loadRecord();
//     }
//   }, [id, isEdit]);

//   const handleChange = (field, value) => {
//     setForm(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
//   };

//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//       setForm(prev => ({ ...prev, reportFile: file }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!form.name.trim()) newErrors.name = "Name is required";
//     if (!form.date) newErrors.date = "Date is required";
//     if (!form.time) newErrors.time = "Time is required";
//     if (!form.doctor.trim()) newErrors.doctor = "Doctor/Clinic is required";
//     if (!form.status) newErrors.status = "Status is required";

//     // Date cannot be in past
//     if (form.date) {
//       const selected = new Date(form.date);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       if (selected < today) {
//         newErrors.date = "Date cannot be in the past";
//       }
//     }

//     return newErrors;
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       toast.error(Object.values(validationErrors)[0]); // Show first error
//       return;
//     }

//     setSaving(true);

//     try {
//       const formData = new FormData();
//       formData.append('name', form.name);
//       formData.append('date', form.date);
//       formData.append('time', form.time);
//       formData.append('doctor', form.doctor);
//       formData.append('diagnosis', form.diagnosis || '');
//       formData.append('medications', form.medications || '');
//       formData.append('status', form.status);

//       if (form.reportFile) {
//         formData.append('reportFile', form.reportFile);
//       }

//       if (isEdit) {
//         await api.healthRecords.update(id, formData);
//         toast.success("Health record updated successfully");
//       } else {
//         await api.healthRecords.create(formData);
//         toast.success("Health record saved successfully");
//       }

//       navigate('/school/health-records');
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to save health record";
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/school/health-records');
//   };

//   return (
//     <div className="p-4 sm:p-6 font-sans min-h-screen bg-white">

//       <h1 className="text-xl font-bold text-gray-800 mb-6">
//         Add Health Check up
//       </h1>

//       <div className="border border-gray-200 rounded-lg p-5 sm:p-6 bg-white max-w-4xl space-y-5">
//         <h2 className="text-sm font-bold text-[#1e3a8a]">Add Health Checkup</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Name</label>
//             <input
//               type="text"
//               placeholder="Enter Name"
//               value={form.name}
//               onChange={(e) => handleChange('name', e.target.value)}
//               className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
//                 errors.name ? 'border-red-400' : 'border-gray-300'
//               }`}
//             />
//             {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Date</label>
//             <input
//               type="date"
//               value={form.date}
//               onChange={(e) => handleChange('date', e.target.value)}
//               className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
//                 errors.date ? 'border-red-400' : 'border-gray-300'
//               }`}
//             />
//             {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Time</label>
//             <input
//               type="time"
//               value={form.time}
//               onChange={(e) => handleChange('time', e.target.value)}
//               className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
//                 errors.time ? 'border-red-400' : 'border-gray-300'
//               }`}
//             />
//             {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
//           </div>
//         </div>

//         <div>
//           <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Doctor / Clinic</label>
//           <input
//             type="text"
//             placeholder="Doctor or hospital name"
//             value={form.doctor}
//             onChange={(e) => handleChange('doctor', e.target.value)}
//             className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
//               errors.doctor ? 'border-red-400' : 'border-gray-300'
//             }`}
//           />
//           {errors.doctor && <p className="mt-1 text-xs text-red-500">{errors.doctor}</p>}
//         </div>

//         <div>
//           <label className="block text-xs font-semibold text-[#1e3a8a] mb-1">Diagnosis / Notes</label>
//           <textarea
//             rows={4}
//             placeholder="Enter diagnosis or notes"
//             value={form.diagnosis}
//             onChange={(e) => handleChange('diagnosis', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
//           />
//         </div>

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
//                 <option key={s} value={s}>{s}</option>
//               ))}
//             </select>
//           </div>
//         </div>

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

//         <div className="flex gap-3 pt-1">
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="bg-[#1e3a8a] hover:bg-[#1a2f72] active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200 disabled:opacity-70"
//           >
//             {saving ? 'Saving...' : 'Save Health Record'}
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