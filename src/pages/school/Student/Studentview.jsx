// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// // ─── Error parser ─────────────────────────────────────────────────────────────
// function parseApiError(err, context = 'perform this action') {
//   if (!navigator.onLine)
//     return 'No internet connection. Please check your network and try again.';
//   const status    = err?.response?.status;
//   const serverMsg = err?.response?.data?.message;
//   if (status === 400) return serverMsg || 'Invalid request. Please check your input.';
//   if (status === 401) return 'Your session has expired. Please log in again.';
//   if (status === 403) return `You don't have permission to ${context}.`;
//   if (status === 404) return 'Student not found. They may have been deleted.';
//   if (status === 409) return serverMsg || 'A conflict occurred. Please check for duplicates.';
//   if (status === 422) return serverMsg || 'Validation failed. Please check the data and retry.';
//   if (status === 429) return 'Too many requests. Please wait a moment and try again.';
//   if (status >= 500)  return 'Server error. Please try again later or contact support.';
//   if (err?.code === 'ECONNABORTED' || err?.message?.toLowerCase().includes('timeout'))
//     return 'Request timed out. Please check your connection and try again.';
//   if (err?.message === 'Network Error') return 'Network error. Unable to reach the server.';
//   return `Failed to ${context}. Please try again.`;
// }

// // ─── Shared field components ──────────────────────────────────────────────────
// function ReadField({ label, value, className = '' }) {
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
//       <div className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-800 text-sm min-h-[40px]">
//         {value ?? <span className="text-gray-400">—</span>}
//       </div>
//     </div>
//   );
// }

// function EditField({ label, name, value, onChange, type = 'text', options, className = '' }) {
//   const base = "border border-blue-300 rounded-lg px-3 py-2.5 bg-white text-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#000359]";
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
//       {options
//         ? (
//           <select name={name} value={value ?? ''} onChange={onChange} className={base}>
//             {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//           </select>
//         ) : (
//           <input type={type} name={name} value={value ?? ''} onChange={onChange} className={base} />
//         )
//       }
//     </div>
//   );
// }

// function EditTextarea({ label, name, value, onChange, rows = 3, className = '' }) {
//   const base = "border border-blue-300 rounded-lg px-3 py-2.5 bg-white text-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#000359] resize-y";
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
//       <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} className={base} />
//     </div>
//   );
// }

// function SectionCard({ title, icon, children }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
//         <span className="text-base">{icon}</span>
//         <h2 className="text-sm font-bold text-[#000359] uppercase tracking-wide">{title}</h2>
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   );
// }

// function SaveBar({ onSave, onCancel, saving }) {
//   return (
//     <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
//       <button onClick={onCancel} disabled={saving}
//         className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition disabled:opacity-50">
//         Cancel
//       </button>
//       <button onClick={onSave} disabled={saving}
//         className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition disabled:opacity-50">
//         {saving ? 'Saving…' : 'Save Changes'}
//       </button>
//     </div>
//   );
// }

// const TABS = [
//   { id: 'profile',   label: 'Profile',           icon: '👤' },
//   { id: 'health',    label: 'Health',             icon: '🏥' },
//   { id: 'emergency', label: 'Emergency Contacts', icon: '📞' },
//   { id: 'activity',  label: 'Activities',         icon: '🎯' },
//   { id: 'fee',       label: 'Fee Info',            icon: '💳' },
// ];

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function StudentView() {
//   const { id }   = useParams();
//   const navigate = useNavigate();

//   const [student,    setStudent]    = useState(null);
//   const [loading,    setLoading]    = useState(true);
//   const [activeTab,  setActiveTab]  = useState('profile');
//   const [editSection,setEditSection]= useState(null);
//   const [editData,   setEditData]   = useState({});
//   const [saving,     setSaving]     = useState(false);

//   // ── Fetch ─────────────────────────────────────────────────────────────────
//   const fetchStudent = useCallback(async () => {
//     if (!id) {
//       toast.error('No student ID in URL.');
//       navigate(-1);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res  = await api.students.getById(id);
//       const data = res?.data;
//       if (!data || typeof data !== 'object' || !data._id) throw new Error('INVALID_RESPONSE');
//       setStudent(data);
//     } catch (err) {
//       console.error('[StudentView] fetch:', err);
//       if (err.message === 'INVALID_RESPONSE') {
//         toast.error('Unexpected data from server. Please refresh.');
//       } else if (err?.response?.status === 404) {
//         toast.error('Student not found. They may have been deleted.');
//         navigate(-1);
//       } else {
//         toast.error(parseApiError(err, 'load student profile'));
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [id, navigate]);

//   useEffect(() => { fetchStudent(); }, [fetchStudent]);

//   // ── Edit helpers ──────────────────────────────────────────────────────────
//   const startEdit = (section, fields) => {
//     const draft = {};
//     fields.forEach(f => { draft[f] = student?.[f] ?? ''; });
//     // special: hobbies/games as comma-strings
//     if (fields.includes('hobbies')) draft.hobbies = student?.hobbies?.join(', ') ?? '';
//     if (fields.includes('games'))   draft.games   = student?.games?.join(', ')   ?? '';
//     setEditData(draft);
//     setEditSection(section);
//   };

//   const cancelEdit = () => { setEditSection(null); setEditData({}); };

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setEditData(p => ({ ...p, [name]: value }));
//   };

//   // ── Generic section save ──────────────────────────────────────────────────
//   const saveSection = async (section) => {
//     setSaving(true);
//     const tid = toast.loading('Saving changes…');
//     try {
//       // Validations
//       if (section === 'profile') {
//         if (!editData.fullName?.trim())
//           return void toast.error('Full name is required.', { id: tid });
//         if (!editData.mobile?.trim() || !/^\d{10}$/.test(editData.mobile.trim()))
//           return void toast.error('Mobile must be exactly 10 digits.', { id: tid });
//         if (!editData.age || isNaN(editData.age) || +editData.age < 1 || +editData.age > 120)
//           return void toast.error('Enter a valid age (1–120).', { id: tid });
//       }
//       if (section === 'fee') {
//         if (editData.amount !== '' && (isNaN(editData.amount) || +editData.amount < 0))
//           return void toast.error('Amount must be a positive number.', { id: tid });
//       }

//       // coerce hobbies/games back to arrays
//       const payload = { ...editData };
//       if (section === 'activity') {
//         payload.hobbies = (editData.hobbies || '').split(',').map(h => h.trim()).filter(Boolean);
//         payload.games   = (editData.games   || '').split(',').map(g => g.trim()).filter(Boolean);
//       }

//       const res = await api.students.update(student._id, payload);
//       const updated = res?.data;
//       if (!updated || typeof updated !== 'object') throw new Error('INVALID_RESPONSE');

//       setStudent(updated);
//       setEditSection(null);
//       setEditData({});
//       toast.success('Saved successfully.', { id: tid });
//     } catch (err) {
//       console.error(`[StudentView] save ${section}:`, err);
//       if (err.message === 'INVALID_RESPONSE')
//         toast.error('Server returned unexpected data. Please refresh.', { id: tid });
//       else
//         toast.error(parseApiError(err, 'save changes'), { id: tid });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Emergency save ────────────────────────────────────────────────────────
//   const saveEmergency = async () => {
//     setSaving(true);
//     const tid = toast.loading('Saving emergency contact…');
//     try {
//       if (!editData.primaryContactName?.trim())
//         return void toast.error('Primary contact name is required.', { id: tid });
//       if (!editData.primaryPhone?.trim() || !/^\d{10}$/.test(editData.primaryPhone.trim()))
//         return void toast.error('Primary phone must be exactly 10 digits.', { id: tid });
//       if (editData.secondaryPhone?.trim() && !/^\d{10}$/.test(editData.secondaryPhone.trim()))
//         return void toast.error('Secondary phone must be exactly 10 digits.', { id: tid });

//       const res     = await api.students.updateEmergencyContact(student._id, editData);
//       const updated = res?.data?.data;
//       if (!updated) throw new Error('INVALID_RESPONSE');

//       setStudent(p => ({ ...p, ...updated }));
//       setEditSection(null);
//       setEditData({});
//       toast.success('Emergency contact updated.', { id: tid });
//     } catch (err) {
//       console.error('[StudentView] saveEmergency:', err);
//       if (err.message === 'INVALID_RESPONSE')
//         toast.error('Unexpected server response. Please refresh.', { id: tid });
//       else
//         toast.error(parseApiError(err, 'update emergency contact'), { id: tid });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Clear emergency ───────────────────────────────────────────────────────
//   const clearEmergency = async () => {
//     if (!window.confirm('Clear all emergency contact details? This cannot be undone.')) return;
//     const tid = toast.loading('Clearing emergency contact…');
//     try {
//       await api.students.clearEmergencyContact(student._id);
//       setStudent(p => ({
//         ...p,
//         primaryContactName: '', primaryRelation: '', primaryPhone: '',
//         secondaryContactName: '', secondaryRelation: '', secondaryPhone: '',
//       }));
//       toast.success('Emergency contact cleared.', { id: tid });
//     } catch (err) {
//       console.error('[StudentView] clearEmergency:', err);
//       toast.error(parseApiError(err, 'clear emergency contact'), { id: tid });
//     }
//   };

//   // ── Status toggle ─────────────────────────────────────────────────────────
//   const toggleStatus = async () => {
//     const next = student.status === 'Active' ? 'Inactive' : 'Active';
//     const tid  = toast.loading(`Changing status to ${next}…`);
//     try {
//       await api.students.update(student._id, { status: next });
//       setStudent(p => ({ ...p, status: next }));
//       toast.success(`Status changed to ${next}.`, { id: tid });
//     } catch (err) {
//       console.error('[StudentView] toggleStatus:', err);
//       toast.error(parseApiError(err, 'update status'), { id: tid });
//     }
//   };

//   // ─── Loading skeleton ─────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto animate-pulse">
//         <div className="flex justify-between">
//           <div className="h-4 bg-gray-200 rounded w-48" />
//           <div className="h-8 bg-gray-200 rounded w-16" />
//         </div>
//         <div className="h-8 bg-gray-200 rounded w-56" />
//         <div className="flex gap-2">
//           {TABS.map(t => <div key={t.id} className="h-10 bg-gray-200 rounded w-28" />)}
//         </div>
//         <div className="bg-white rounded-xl p-6 space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="grid grid-cols-3 gap-4">
//               {[...Array(3)].map((__, j) => <div key={j} className="h-10 bg-gray-200 rounded" />)}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!student) return null;

//   const ed = editSection;  // shorthand

//   return (
//     <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">

//       {/* Breadcrumb + Back */}
//       <div className="flex items-center justify-between">
//         <nav className="text-sm text-gray-500 flex items-center gap-1">
//           <button onClick={() => navigate(-1)} className="hover:text-[#000359] transition">
//             Participants / Students
//           </button>
//           <span className="text-gray-300">›</span>
//           <span className="text-gray-800 font-medium">View</span>
//         </nav>
//         <button onClick={() => navigate(-1)}
//           className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-lg text-sm transition">
//           Back
//         </button>
//       </div>

//       <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Participant Profile</h1>

//       {/* Tabs */}
//       <div className="flex gap-1 flex-wrap border-b border-gray-200">
//         {TABS.map(tab => (
//           <button key={tab.id}
//             onClick={() => { setActiveTab(tab.id); cancelEdit(); }}
//             className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg
//                         border-b-2 -mb-px transition ${
//               activeTab === tab.id
//                 ? 'border-[#000359] text-[#000359] bg-white'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             {tab.icon} {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* ══ PROFILE ══════════════════════════════════════════════════════════ */}
//       {activeTab === 'profile' && (
//         <SectionCard title="Personal Information" icon="👤">
//           <div className="flex flex-col sm:flex-row gap-6">
//             {/* Photo */}
//             <div className="flex-shrink-0 flex flex-col items-center gap-3">
//               <div className="w-28 h-28 rounded-xl border-2 border-gray-200 bg-gray-100
//                               flex items-center justify-center overflow-hidden">
//                 {student.photo
//                   ? <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover" />
//                   : <span className="text-gray-400 text-xs text-center px-2 leading-tight">Profile Photo</span>
//                 }
//               </div>
//               {/* Clickable status badge */}
//               <button onClick={toggleStatus}
//                 className={`px-3 py-1 rounded-full text-xs font-semibold transition hover:opacity-80 ${
//                   student.status === 'Active'
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-red-100 text-red-800'
//                 }`}
//                 title="Click to toggle status"
//               >
//                 {student.status || 'Unknown'}
//               </button>
//             </div>

//             {/* Fields */}
//             <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {ed === 'profile' ? (
//                 <>
//                   <ReadField label="Admission ID" value={student.admissionIdStr || student.admissionId} />
//                   <EditField label="Full Name"     name="fullName"     value={editData.fullName}       onChange={handleChange} />
//                   <EditField label="Age"           name="age"          value={editData.age}             onChange={handleChange} type="number" />
//                   <EditField label="Mobile"        name="mobile"       value={editData.mobile}          onChange={handleChange} type="tel" />
//                   <EditField label="Gender"        name="gender"       value={editData.gender}          onChange={handleChange}
//                     options={[
//                       { value: '',       label: 'Select…' },
//                       { value: 'Male',   label: 'Male'    },
//                       { value: 'Female', label: 'Female'  },
//                       { value: 'Other',  label: 'Other'   },
//                     ]}
//                   />
//                   <EditField label="Date of Birth" name="dob"          value={editData.dob?.slice(0,10)} onChange={handleChange} type="date" />
//                   <EditField label="Aadhaar"       name="aadhaar"      value={editData.aadhaar}         onChange={handleChange} />
//                   <EditTextarea label="Address"    name="fullAddress"  value={editData.fullAddress}     onChange={handleChange} rows={2} className="sm:col-span-2 lg:col-span-3" />
//                 </>
//               ) : (
//                 <>
//                   <ReadField label="Admission ID"  value={student.admissionIdStr || student.admissionId} />
//                   <ReadField label="Full Name"      value={student.fullName} />
//                   <ReadField label="Age"            value={student.age} />
//                   <ReadField label="Mobile"         value={student.mobile} />
//                   <ReadField label="Gender"         value={student.gender} />
//                   <ReadField label="Date of Birth"  value={student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : undefined} />
//                   <ReadField label="Aadhaar"        value={student.aadhaar} />
//                   <ReadField label="Address"        value={student.fullAddress} className="sm:col-span-2 lg:col-span-3" />
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Edit / Save bar */}
//           {ed === 'profile'
//             ? <SaveBar onSave={() => saveSection('profile')} onCancel={cancelEdit} saving={saving} />
//             : (
//               <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
//                 <button
//                   onClick={() => startEdit('profile', ['fullName','age','gender','dob','aadhaar','mobile','fullAddress'])}
//                   className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                 >
//                   ✏️ Edit Profile
//                 </button>
//               </div>
//             )
//           }

//           {/* Quick-info chips */}
//           <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {[
//               { label: 'Student ID',  value: student.studentId        },
//               { label: 'Fee Plan',    value: student.feePlan          },
//               { label: 'Caregiver',   value: student.assignedCaregiver},
//               { label: 'Blood Group', value: student.bloodGroup       },
//             ].map(({ label, value }) => (
//               <div key={label} className="bg-[#f0f2ff] rounded-lg px-3 py-2.5 text-center">
//                 <p className="text-[11px] text-gray-500 mb-0.5">{label}</p>
//                 <p className="text-sm font-semibold text-[#000359]">{value || '—'}</p>
//               </div>
//             ))}
//           </div>
//         </SectionCard>
//       )}

//       {/* ══ HEALTH ═══════════════════════════════════════════════════════════ */}
//       {activeTab === 'health' && (
//         <>
//           <SectionCard title="Health Information" icon="🏥">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {ed === 'health' ? (
//                 <>
//                   <EditField label="Blood Group" name="bloodGroup" value={editData.bloodGroup} onChange={handleChange}
//                     options={[
//                       { value: '', label: 'Select…' },
//                       ...['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => ({ value: g, label: g }))
//                     ]}
//                   />
//                   <EditField label="Physical Disability" name="physicalDisability" value={editData.physicalDisability} onChange={handleChange}
//                     options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                   />
//                   <EditField label="Serious Disease" name="seriousDisease" value={editData.seriousDisease} onChange={handleChange}
//                     options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                   />
//                   <EditField label="Regular Medication" name="regularMedication" value={editData.regularMedication} onChange={handleChange}
//                     options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                   />
//                   <EditField label="Doctor Name"   name="doctorName"   value={editData.doctorName}   onChange={handleChange} />
//                   <EditField label="Doctor Mobile" name="doctorMobile" value={editData.doctorMobile} onChange={handleChange} type="tel" />
//                 </>
//               ) : (
//                 <>
//                   {[
//                     { label: 'Blood Group',         value: student.bloodGroup         },
//                     { label: 'Physical Disability', value: student.physicalDisability  },
//                     { label: 'Serious Disease',     value: student.seriousDisease      },
//                     { label: 'Regular Medication',  value: student.regularMedication   },
//                     { label: 'Doctor Name',         value: student.doctorName          },
//                     { label: 'Doctor Mobile',       value: student.doctorMobile        },
//                   ].map(({ label, value }) => (
//                     <ReadField key={label} label={label} value={value} />
//                   ))}
//                 </>
//               )}
//             </div>
//             {ed === 'health'
//               ? <SaveBar onSave={() => saveSection('health')} onCancel={cancelEdit} saving={saving} />
//               : (
//                 <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
//                   <button
//                     onClick={() => startEdit('health', ['bloodGroup','physicalDisability','seriousDisease','regularMedication','doctorName','doctorMobile'])}
//                     className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                   >
//                     ✏️ Edit Health Info
//                   </button>
//                 </div>
//               )
//             }
//           </SectionCard>

//           {/* Last Health Checkup — mirrors screenshot exactly */}
//           <SectionCard title="Last Health Checkup" icon="🩺">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <ReadField label="Last Checkup Date"
//                 value={student.lastCheckupDate
//                   ? new Date(student.lastCheckupDate).toLocaleDateString('en-IN')
//                   : undefined}
//               />
//               <ReadField label="Doctor / Clinic" value={student.lastCheckupDoctor} />
//               <ReadField label="Health Status"   value={student.lastCheckupStatus} />
//               <ReadField label="Diagnosis / Notes" value={student.lastCheckupNotes} className="sm:col-span-3" />
//             </div>
//             <div className="flex gap-3 mt-5 flex-wrap">
//               {/* <button
//                 onClick={() => toast.info('Health record history coming soon.')}
//                 className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg text-sm transition"
//               >
//                 View Health Record History
//               </button>
//               <button
//                 onClick={() => toast.info('Update Health Check up form coming soon.')}
//                 className="bg-[#000359] hover:bg-[#000280] text-white px-5 py-2 rounded-lg text-sm font-medium transition"
//               >
//                 Update Health Check up
//               </button> */}
//             </div>
//           </SectionCard>
//         </>
//       )}

//       {/* ══ EMERGENCY CONTACTS ═══════════════════════════════════════════════ */}
//       {activeTab === 'emergency' && (
//         <SectionCard title="Emergency Contacts" icon="📞">
//           {ed === 'emergency' ? (
//             <>
//               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Primary Contact</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <EditField label="Contact Name" name="primaryContactName" value={editData.primaryContactName} onChange={handleChange} />
//                 <EditField label="Relation"     name="primaryRelation"    value={editData.primaryRelation}    onChange={handleChange} />
//                 <EditField label="Phone"        name="primaryPhone"       value={editData.primaryPhone}       onChange={handleChange} type="tel" />
//               </div>

//               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-3">Secondary Contact</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <EditField label="Contact Name" name="secondaryContactName" value={editData.secondaryContactName} onChange={handleChange} />
//                 <EditField label="Relation"     name="secondaryRelation"    value={editData.secondaryRelation}    onChange={handleChange} />
//                 <EditField label="Phone"        name="secondaryPhone"       value={editData.secondaryPhone}       onChange={handleChange} type="tel" />
//               </div>
//               <SaveBar onSave={saveEmergency} onCancel={cancelEdit} saving={saving} />
//             </>
//           ) : (
//             <>
//               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Primary Contact</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <ReadField label="Contact Name" value={student.primaryContactName} />
//                 <ReadField label="Relation"     value={student.primaryRelation}    />
//                 <ReadField label="Phone"        value={student.primaryPhone}       />
//               </div>

//               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-3">Secondary Contact</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <ReadField label="Contact Name" value={student.secondaryContactName} />
//                 <ReadField label="Relation"     value={student.secondaryRelation}    />
//                 <ReadField label="Phone"        value={student.secondaryPhone}       />
//               </div>

//               <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3 flex-wrap">
//                 <button
//                   onClick={() => startEdit('emergency', [
//                     'primaryContactName','primaryRelation','primaryPhone',
//                     'secondaryContactName','secondaryRelation','secondaryPhone',
//                   ])}
//                   className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                 >
//                   ✏️ Edit Contacts
//                 </button>
//                 {(student.primaryContactName || student.secondaryContactName) && (
//                   <button onClick={clearEmergency}
//                     className="px-5 py-2 text-sm border border-red-300 hover:bg-red-50 text-red-600 rounded-lg transition">
//                     🗑 Clear All
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </SectionCard>
//       )}

//       {/* ══ ACTIVITIES ═══════════════════════════════════════════════════════ */}
//       {activeTab === 'activity' && (
//         <SectionCard title="Activities & Lifestyle" icon="🎯">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {ed === 'activity' ? (
//               <>
//                 <EditField label="Behaviour" name="behaviour" value={editData.behaviour} onChange={handleChange}
//                   options={[
//                     { value: '',         label: 'Select…' },
//                     { value: 'Calm',     label: 'Calm'    },
//                     { value: 'Moderate', label: 'Moderate'},
//                     { value: 'Angry',    label: 'Angry'   },
//                     { value: 'Strict',   label: 'Strict'  },
//                   ]}
//                 />
//                 <EditField label="Wake Up Time"   name="wakeUpTime"    value={editData.wakeUpTime}    onChange={handleChange} />
//                 <EditField label="Breakfast Time" name="breakfastTime" value={editData.breakfastTime} onChange={handleChange} />
//                 <EditField label="Lunch Time"     name="lunchTime"     value={editData.lunchTime}     onChange={handleChange} />
//                 <EditField label="Dinner Time"    name="dinnerTime"    value={editData.dinnerTime}    onChange={handleChange} />
//                 <EditTextarea label="Hobbies (comma-separated)" name="hobbies" value={editData.hobbies} onChange={handleChange} className="sm:col-span-2" />
//                 <EditTextarea label="Games (comma-separated)"   name="games"   value={editData.games}   onChange={handleChange} />
//               </>
//             ) : (
//               <>
//                 <ReadField label="Behaviour"      value={student.behaviour} />
//                 <ReadField label="Wake Up Time"   value={student.wakeUpTime} />
//                 <ReadField label="Breakfast Time" value={student.breakfastTime} />
//                 <ReadField label="Lunch Time"     value={student.lunchTime} />
//                 <ReadField label="Dinner Time"    value={student.dinnerTime} />
//                 <ReadField label="Hobbies"        value={student.hobbies?.join(', ')} />
//                 <ReadField label="Games"          value={student.games?.join(', ')} />
//               </>
//             )}
//           </div>

//           {ed === 'activity'
//             ? <SaveBar onSave={() => saveSection('activity')} onCancel={cancelEdit} saving={saving} />
//             : (
//               <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
//                 <button
//                   onClick={() => startEdit('activity', ['behaviour','wakeUpTime','breakfastTime','lunchTime','dinnerTime','hobbies','games'])}
//                   className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                 >
//                   ✏️ Edit Activities
//                 </button>
//               </div>
//             )
//           }
//         </SectionCard>
//       )}

//       {/* ══ FEE INFO ═════════════════════════════════════════════════════════ */}
//       {activeTab === 'fee' && (
//         <SectionCard title="Fee Information" icon="💳">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {ed === 'fee' ? (
//               <>
//                 <EditField label="Fee Plan" name="feePlan" value={editData.feePlan} onChange={handleChange}
//                   options={[
//                     { value: 'Daily',   label: 'Daily'   },
//                     { value: 'Weekly',  label: 'Weekly'  },
//                     { value: 'Monthly', label: 'Monthly' },
//                     { value: 'Annual',  label: 'Annual'  },
//                   ]}
//                 />
//                 <EditField label="Amount (₹)"         name="amount"            value={editData.amount}            onChange={handleChange} type="number" />
//                 <EditField label="Assigned Caregiver" name="assignedCaregiver" value={editData.assignedCaregiver} onChange={handleChange} />
//                 <EditField label="Mess Facility" name="messFacility" value={editData.messFacility} onChange={handleChange}
//                   options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                 />
//                 <EditField label="Residency" name="residency" value={editData.residency} onChange={handleChange}
//                   options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                 />
//               </>
//             ) : (
//               <>
//                 {[
//                   { label: 'Fee Plan',           value: student.feePlan           },
//                   { label: 'Amount',             value: student.amount != null ? `₹${Number(student.amount).toLocaleString('en-IN')}` : undefined },
//                   { label: 'Assigned Caregiver', value: student.assignedCaregiver },
//                   { label: 'Mess Facility',      value: student.messFacility      },
//                   { label: 'Residency',          value: student.residency         },
//                 ].map(({ label, value }) => (
//                   <ReadField key={label} label={label} value={value} />
//                 ))}
//               </>
//             )}
//           </div>

//           {ed === 'fee'
//             ? <SaveBar onSave={() => saveSection('fee')} onCancel={cancelEdit} saving={saving} />
//             : (
//               <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
//                 <button
//                   onClick={() => startEdit('fee', ['feePlan','amount','assignedCaregiver','messFacility','residency'])}
//                   className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                 >
//                   ✏️ Edit Fee Info
//                 </button>
//               </div>
//             )
//           }
//         </SectionCard>
//       )}

//     </div>
//   );
// }













// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// // ─── Error parser ─────────────────────────────────────────────────────────────
// function parseApiError(err, context = 'perform this action') {
//   if (!navigator.onLine)
//     return 'No internet connection. Please check your network and try again.';
//   const status    = err?.response?.status;
//   const serverMsg = err?.response?.data?.message;
//   if (status === 400) return serverMsg || 'Invalid request. Please check your input.';
//   if (status === 401) return 'Your session has expired. Please log in again.';
//   if (status === 403) return `You don't have permission to ${context}.`;
//   if (status === 404) return 'Student not found. They may have been deleted.';
//   if (status === 409) return serverMsg || 'A conflict occurred. Please check for duplicates.';
//   if (status === 422) return serverMsg || 'Validation failed. Please check the data and retry.';
//   if (status === 429) return 'Too many requests. Please wait a moment and try again.';
//   if (status >= 500)  return 'Server error. Please try again later or contact support.';
//   if (err?.code === 'ECONNABORTED' || err?.message?.toLowerCase().includes('timeout'))
//     return 'Request timed out. Please check your connection and try again.';
//   if (err?.message === 'Network Error') return 'Network error. Unable to reach the server.';
//   return `Failed to ${context}. Please try again.`;
// }

// // ─── Shared field components ──────────────────────────────────────────────────
// function ReadField({ label, value, className = '' }) {
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
//       <div className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-800 text-sm min-h-[40px]">
//         {value ?? <span className="text-gray-400">—</span>}
//       </div>
//     </div>
//   );
// }

// function EditField({ label, name, value, onChange, type = 'text', options, className = '' }) {
//   const base = "border border-blue-300 rounded-lg px-3 py-2.5 bg-white text-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#000359]";
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
//       {options
//         ? (
//           <select name={name} value={value ?? ''} onChange={onChange} className={base}>
//             {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//           </select>
//         ) : (
//           <input type={type} name={name} value={value ?? ''} onChange={onChange} className={base} />
//         )
//       }
//     </div>
//   );
// }

// function EditTextarea({ label, name, value, onChange, rows = 3, className = '' }) {
//   const base = "border border-blue-300 rounded-lg px-3 py-2.5 bg-white text-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#000359] resize-y";
//   return (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
//       <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} className={base} />
//     </div>
//   );
// }

// function SectionCard({ title, icon, children }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
//         <span className="text-base">{icon}</span>
//         <h2 className="text-sm font-bold text-[#000359] uppercase tracking-wide">{title}</h2>
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   );
// }

// function SaveBar({ onSave, onCancel, saving }) {
//   return (
//     <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
//       <button onClick={onCancel} disabled={saving}
//         className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition disabled:opacity-50">
//         Cancel
//       </button>
//       <button onClick={onSave} disabled={saving}
//         className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition disabled:opacity-50">
//         {saving ? 'Saving…' : 'Save Changes'}
//       </button>
//     </div>
//   );
// }

// const TABS = [
//   { id: 'profile',   label: 'Profile',           icon: '👤' },
//   { id: 'health',    label: 'Health',             icon: '🏥' },
//   { id: 'emergency', label: 'Emergency Contacts', icon: '📞' },
//   { id: 'activity',  label: 'Activities',         icon: '🎯' },
//   { id: 'fee',       label: 'Fee Info',            icon: '💳' },
// ];

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function StudentView() {
//   const { id }   = useParams();
//   const navigate = useNavigate();

//   const [student,    setStudent]    = useState(null);
//   const [loading,    setLoading]    = useState(true);
//   const [activeTab,  setActiveTab]  = useState('profile');
//   const [editSection,setEditSection]= useState(null);
//   const [editData,   setEditData]   = useState({});
//   const [saving,     setSaving]     = useState(false);

//   // ── Fetch Student with safe handling for lastCheckup fields ─────────────────
//   const fetchStudent = useCallback(async () => {
//     if (!id) {
//       toast.error('No student ID in URL.');
//       navigate(-1);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res  = await api.students.getById(id);
//       let data = res?.data?.data || res?.data;

//       if (!data || typeof data !== 'object' || !data._id) {
//         throw new Error('INVALID_RESPONSE');
//       }

//       // Ensure last health checkup fields always exist (prevents undefined issues)
//       setStudent({
//         ...data,
//         lastCheckupDate: data.lastCheckupDate || null,
//         lastCheckupDoctor: data.lastCheckupDoctor || '',
//         lastCheckupStatus: data.lastCheckupStatus || '',
//         lastCheckupNotes: data.lastCheckupNotes || '',
//       });
//     } catch (err) {
//       console.error('[StudentView] fetch:', err);
//       if (err.message === 'INVALID_RESPONSE') {
//         toast.error('Unexpected data from server. Please refresh.');
//       } else if (err?.response?.status === 404) {
//         toast.error('Student not found. They may have been deleted.');
//         navigate(-1);
//       } else {
//         toast.error(parseApiError(err, 'load student profile'));
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [id, navigate]);

//   useEffect(() => { fetchStudent(); }, [fetchStudent]);

//   // ── Edit helpers ──────────────────────────────────────────────────────────
//   const startEdit = (section, fields) => {
//     const draft = {};
//     fields.forEach(f => { draft[f] = student?.[f] ?? ''; });
//     if (fields.includes('hobbies')) draft.hobbies = student?.hobbies?.join(', ') ?? '';
//     if (fields.includes('games'))   draft.games   = student?.games?.join(', ')   ?? '';
//     setEditData(draft);
//     setEditSection(section);
//   };

//   const cancelEdit = () => { setEditSection(null); setEditData({}); };

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setEditData(p => ({ ...p, [name]: value }));
//   };

//   // ── Generic section save ──────────────────────────────────────────────────
//   const saveSection = async (section) => {
//     setSaving(true);
//     const tid = toast.loading('Saving changes…');
//     try {
//       if (section === 'profile') {
//         if (!editData.fullName?.trim())
//           return void toast.error('Full name is required.', { id: tid });
//         if (!editData.mobile?.trim() || !/^\d{10}$/.test(editData.mobile.trim()))
//           return void toast.error('Mobile must be exactly 10 digits.', { id: tid });
//         if (!editData.age || isNaN(editData.age) || +editData.age < 1 || +editData.age > 120)
//           return void toast.error('Enter a valid age (1–120).', { id: tid });
//       }
//       if (section === 'fee') {
//         if (editData.amount !== '' && (isNaN(editData.amount) || +editData.amount < 0))
//           return void toast.error('Amount must be a positive number.', { id: tid });
//       }

//       const payload = { ...editData };
//       if (section === 'activity') {
//         payload.hobbies = (editData.hobbies || '').split(',').map(h => h.trim()).filter(Boolean);
//         payload.games   = (editData.games   || '').split(',').map(g => g.trim()).filter(Boolean);
//       }

//       const res = await api.students.update(student._id, payload);
//       const updated = res?.data;
//       if (!updated || typeof updated !== 'object') throw new Error('INVALID_RESPONSE');

//       setStudent(updated);
//       setEditSection(null);
//       setEditData({});
//       toast.success('Saved successfully.', { id: tid });
//     } catch (err) {
//       console.error(`[StudentView] save ${section}:`, err);
//       if (err.message === 'INVALID_RESPONSE')
//         toast.error('Server returned unexpected data. Please refresh.', { id: tid });
//       else
//         toast.error(parseApiError(err, 'save changes'), { id: tid });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Emergency save ────────────────────────────────────────────────────────
//   const saveEmergency = async () => {
//     setSaving(true);
//     const tid = toast.loading('Saving emergency contact…');
//     try {
//       if (!editData.primaryContactName?.trim())
//         return void toast.error('Primary contact name is required.', { id: tid });
//       if (!editData.primaryPhone?.trim() || !/^\d{10}$/.test(editData.primaryPhone.trim()))
//         return void toast.error('Primary phone must be exactly 10 digits.', { id: tid });
//       if (editData.secondaryPhone?.trim() && !/^\d{10}$/.test(editData.secondaryPhone.trim()))
//         return void toast.error('Secondary phone must be exactly 10 digits.', { id: tid });

//       const res     = await api.students.updateEmergencyContact(student._id, editData);
//       const updated = res?.data?.data;
//       if (!updated) throw new Error('INVALID_RESPONSE');

//       setStudent(p => ({ ...p, ...updated }));
//       setEditSection(null);
//       setEditData({});
//       toast.success('Emergency contact updated.', { id: tid });
//     } catch (err) {
//       console.error('[StudentView] saveEmergency:', err);
//       if (err.message === 'INVALID_RESPONSE')
//         toast.error('Unexpected server response. Please refresh.', { id: tid });
//       else
//         toast.error(parseApiError(err, 'update emergency contact'), { id: tid });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Clear emergency ───────────────────────────────────────────────────────
//   const clearEmergency = async () => {
//     if (!window.confirm('Clear all emergency contact details? This cannot be undone.')) return;
//     const tid = toast.loading('Clearing emergency contact…');
//     try {
//       await api.students.clearEmergencyContact(student._id);
//       setStudent(p => ({
//         ...p,
//         primaryContactName: '', primaryRelation: '', primaryPhone: '',
//         secondaryContactName: '', secondaryRelation: '', secondaryPhone: '',
//       }));
//       toast.success('Emergency contact cleared.', { id: tid });
//     } catch (err) {
//       console.error('[StudentView] clearEmergency:', err);
//       toast.error(parseApiError(err, 'clear emergency contact'), { id: tid });
//     }
//   };

//   // ── Status toggle ─────────────────────────────────────────────────────────
//   const toggleStatus = async () => {
//     const next = student.status === 'Active' ? 'Inactive' : 'Active';
//     const tid  = toast.loading(`Changing status to ${next}…`);
//     try {
//       await api.students.update(student._id, { status: next });
//       setStudent(p => ({ ...p, status: next }));
//       toast.success(`Status changed to ${next}.`, { id: tid });
//     } catch (err) {
//       console.error('[StudentView] toggleStatus:', err);
//       toast.error(parseApiError(err, 'update status'), { id: tid });
//     }
//   };

//   // ─── Loading skeleton ─────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto animate-pulse">
//         <div className="flex justify-between">
//           <div className="h-4 bg-gray-200 rounded w-48" />
//           <div className="h-8 bg-gray-200 rounded w-16" />
//         </div>
//         <div className="h-8 bg-gray-200 rounded w-56" />
//         <div className="flex gap-2">
//           {TABS.map(t => <div key={t.id} className="h-10 bg-gray-200 rounded w-28" />)}
//         </div>
//         <div className="bg-white rounded-xl p-6 space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="grid grid-cols-3 gap-4">
//               {[...Array(3)].map((__, j) => <div key={j} className="h-10 bg-gray-200 rounded" />)}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!student) return null;

//   const ed = editSection;

//   return (
//     <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">

//       {/* Breadcrumb + Back */}
//       <div className="flex items-center justify-between">
//         <nav className="text-sm text-gray-500 flex items-center gap-1">
//           <button onClick={() => navigate(-1)} className="hover:text-[#000359] transition">
//             Participants / Students
//           </button>
//           <span className="text-gray-300">›</span>
//           <span className="text-gray-800 font-medium">View</span>
//         </nav>
//         <button onClick={() => navigate(-1)}
//           className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-lg text-sm transition">
//           Back
//         </button>
//       </div>

//       <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Participant Profile</h1>

//       {/* Tabs */}
//       <div className="flex gap-1 flex-wrap border-b border-gray-200">
//         {TABS.map(tab => (
//           <button key={tab.id}
//             onClick={() => { setActiveTab(tab.id); cancelEdit(); }}
//             className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg
//                         border-b-2 -mb-px transition ${
//               activeTab === tab.id
//                 ? 'border-[#000359] text-[#000359] bg-white'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             {tab.icon} {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* ══ PROFILE ══════════════════════════════════════════════════════════ */}
//       {activeTab === 'profile' && (
//         <SectionCard title="Personal Information" icon="👤">
//           <div className="flex flex-col sm:flex-row gap-6">
//             <div className="flex-shrink-0 flex flex-col items-center gap-3">
//               <div className="w-28 h-28 rounded-xl border-2 border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
//                 {student.photo
//                   ? <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover" />
//                   : <span className="text-gray-400 text-xs text-center px-2 leading-tight">Profile Photo</span>
//                 }
//               </div>
//               <button onClick={toggleStatus}
//                 className={`px-3 py-1 rounded-full text-xs font-semibold transition hover:opacity-80 ${
//                   student.status === 'Active'
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-red-100 text-red-800'
//                 }`}
//                 title="Click to toggle status"
//               >
//                 {student.status || 'Unknown'}
//               </button>
//             </div>

//             <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {ed === 'profile' ? (
//                 <>
//                   <ReadField label="Admission ID" value={student.admissionIdStr || student.admissionId} />
//                   <EditField label="Full Name" name="fullName" value={editData.fullName} onChange={handleChange} />
//                   <EditField label="Age" name="age" value={editData.age} onChange={handleChange} type="number" />
//                   <EditField label="Mobile" name="mobile" value={editData.mobile} onChange={handleChange} type="tel" />
//                   <EditField label="Gender" name="gender" value={editData.gender} onChange={handleChange}
//                     options={[
//                       { value: '', label: 'Select…' },
//                       { value: 'Male', label: 'Male' },
//                       { value: 'Female', label: 'Female' },
//                       { value: 'Other', label: 'Other' },
//                     ]}
//                   />
//                   <EditField label="Date of Birth" name="dob" value={editData.dob?.slice(0,10)} onChange={handleChange} type="date" />
//                   <EditField label="Aadhaar" name="aadhaar" value={editData.aadhaar} onChange={handleChange} />
//                   <EditTextarea label="Address" name="fullAddress" value={editData.fullAddress} onChange={handleChange} rows={2} className="sm:col-span-2 lg:col-span-3" />
//                 </>
//               ) : (
//                 <>
//                   <ReadField label="Admission ID" value={student.admissionIdStr || student.admissionId} />
//                   <ReadField label="Full Name" value={student.fullName} />
//                   <ReadField label="Age" value={student.age} />
//                   <ReadField label="Mobile" value={student.mobile} />
//                   <ReadField label="Gender" value={student.gender} />
//                   <ReadField label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : undefined} />
//                   <ReadField label="Aadhaar" value={student.aadhaar} />
//                   <ReadField label="Address" value={student.fullAddress} className="sm:col-span-2 lg:col-span-3" />
//                 </>
//               )}
//             </div>
//           </div>

//           {ed === 'profile'
//             ? <SaveBar onSave={() => saveSection('profile')} onCancel={cancelEdit} saving={saving} />
//             : (
//               <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
//                 <button
//                   onClick={() => startEdit('profile', ['fullName','age','gender','dob','aadhaar','mobile','fullAddress'])}
//                   className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                 >
//                   ✏️ Edit Profile
//                 </button>
//               </div>
//             )
//           }

//           <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {[
//               { label: 'Student ID', value: student.studentId },
//               { label: 'Fee Plan', value: student.feePlan },
//               { label: 'Caregiver', value: student.assignedCaregiver },
//               { label: 'Blood Group', value: student.bloodGroup },
//             ].map(({ label, value }) => (
//               <div key={label} className="bg-[#f0f2ff] rounded-lg px-3 py-2.5 text-center">
//                 <p className="text-[11px] text-gray-500 mb-0.5">{label}</p>
//                 <p className="text-sm font-semibold text-[#000359]">{value || '—'}</p>
//               </div>
//             ))}
//           </div>
//         </SectionCard>
//       )}

//       {/* ══ HEALTH ═══════════════════════════════════════════════════════════ */}
//       {activeTab === 'health' && (
//         <>
//           <SectionCard title="Health Information" icon="🏥">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {ed === 'health' ? (
//                 <>
//                   <EditField label="Blood Group" name="bloodGroup" value={editData.bloodGroup} onChange={handleChange}
//                     options={[
//                       { value: '', label: 'Select…' },
//                       ...['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => ({ value: g, label: g }))
//                     ]}
//                   />
//                   <EditField label="Physical Disability" name="physicalDisability" value={editData.physicalDisability} onChange={handleChange}
//                     options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                   />
//                   <EditField label="Serious Disease" name="seriousDisease" value={editData.seriousDisease} onChange={handleChange}
//                     options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                   />
//                   <EditField label="Regular Medication" name="regularMedication" value={editData.regularMedication} onChange={handleChange}
//                     options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                   />
//                   <EditField label="Doctor Name" name="doctorName" value={editData.doctorName} onChange={handleChange} />
//                   <EditField label="Doctor Mobile" name="doctorMobile" value={editData.doctorMobile} onChange={handleChange} type="tel" />
//                 </>
//               ) : (
//                 <>
//                   {[
//                     { label: 'Blood Group', value: student.bloodGroup },
//                     { label: 'Physical Disability', value: student.physicalDisability },
//                     { label: 'Serious Disease', value: student.seriousDisease },
//                     { label: 'Regular Medication', value: student.regularMedication },
//                     { label: 'Doctor Name', value: student.doctorName },
//                     { label: 'Doctor Mobile', value: student.doctorMobile },
//                   ].map(({ label, value }) => (
//                     <ReadField key={label} label={label} value={value} />
//                   ))}
//                 </>
//               )}
//             </div>
//             {ed === 'health'
//               ? <SaveBar onSave={() => saveSection('health')} onCancel={cancelEdit} saving={saving} />
//               : (
//                 <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
//                   <button
//                     onClick={() => startEdit('health', ['bloodGroup','physicalDisability','seriousDisease','regularMedication','doctorName','doctorMobile'])}
//                     className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                   >
//                     ✏️ Edit Health Info
//                   </button>
//                 </div>
//               )
//             }
//           </SectionCard>

//           {/* Last Health Checkup — Improved safe display */}
//           <SectionCard title="Last Health Checkup" icon="🩺">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <ReadField 
//                 label="Last Checkup Date" 
//                 value={student.lastCheckupDate 
//                   ? new Date(student.lastCheckupDate).toLocaleDateString('en-IN') 
//                   : '—'} 
//               />
//               <ReadField 
//                 label="Doctor / Clinic" 
//                 value={student.lastCheckupDoctor || '—'} 
//               />
//               <ReadField 
//                 label="Health Status" 
//                 value={student.lastCheckupStatus || '—'} 
//               />
//               <ReadField 
//                 label="Diagnosis / Notes" 
//                 value={student.lastCheckupNotes || '—'} 
//                 className="sm:col-span-3" 
//               />
//             </div>
//             <div className="flex gap-3 mt-5 flex-wrap">
//               {/* Commented buttons preserved as-is */}
//             </div>
//           </SectionCard>
//         </>
//       )}

//       {/* ══ EMERGENCY CONTACTS ═══════════════════════════════════════════════ */}
//       {activeTab === 'emergency' && (
//         <SectionCard title="Emergency Contacts" icon="📞">
//           {ed === 'emergency' ? (
//             <>
//               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Primary Contact</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <EditField label="Contact Name" name="primaryContactName" value={editData.primaryContactName} onChange={handleChange} />
//                 <EditField label="Relation" name="primaryRelation" value={editData.primaryRelation} onChange={handleChange} />
//                 <EditField label="Phone" name="primaryPhone" value={editData.primaryPhone} onChange={handleChange} type="tel" />
//               </div>

//               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-3">Secondary Contact</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <EditField label="Contact Name" name="secondaryContactName" value={editData.secondaryContactName} onChange={handleChange} />
//                 <EditField label="Relation" name="secondaryRelation" value={editData.secondaryRelation} onChange={handleChange} />
//                 <EditField label="Phone" name="secondaryPhone" value={editData.secondaryPhone} onChange={handleChange} type="tel" />
//               </div>
//               <SaveBar onSave={saveEmergency} onCancel={cancelEdit} saving={saving} />
//             </>
//           ) : (
//             <>
//               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Primary Contact</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <ReadField label="Contact Name" value={student.primaryContactName} />
//                 <ReadField label="Relation" value={student.primaryRelation} />
//                 <ReadField label="Phone" value={student.primaryPhone} />
//               </div>

//               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-3">Secondary Contact</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <ReadField label="Contact Name" value={student.secondaryContactName} />
//                 <ReadField label="Relation" value={student.secondaryRelation} />
//                 <ReadField label="Phone" value={student.secondaryPhone} />
//               </div>

//               <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3 flex-wrap">
//                 <button
//                   onClick={() => startEdit('emergency', [
//                     'primaryContactName','primaryRelation','primaryPhone',
//                     'secondaryContactName','secondaryRelation','secondaryPhone',
//                   ])}
//                   className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                 >
//                   ✏️ Edit Contacts
//                 </button>
//                 {(student.primaryContactName || student.secondaryContactName) && (
//                   <button onClick={clearEmergency}
//                     className="px-5 py-2 text-sm border border-red-300 hover:bg-red-50 text-red-600 rounded-lg transition">
//                     🗑 Clear All
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </SectionCard>
//       )}

//       {/* ══ ACTIVITIES ═══════════════════════════════════════════════════════ */}
//       {activeTab === 'activity' && (
//         <SectionCard title="Activities & Lifestyle" icon="🎯">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {ed === 'activity' ? (
//               <>
//                 <EditField label="Behaviour" name="behaviour" value={editData.behaviour} onChange={handleChange}
//                   options={[
//                     { value: '', label: 'Select…' },
//                     { value: 'Calm', label: 'Calm' },
//                     { value: 'Moderate', label: 'Moderate'},
//                     { value: 'Angry', label: 'Angry' },
//                     { value: 'Strict', label: 'Strict' },
//                   ]}
//                 />
//                 <EditField label="Wake Up Time" name="wakeUpTime" value={editData.wakeUpTime} onChange={handleChange} />
//                 <EditField label="Breakfast Time" name="breakfastTime" value={editData.breakfastTime} onChange={handleChange} />
//                 <EditField label="Lunch Time" name="lunchTime" value={editData.lunchTime} onChange={handleChange} />
//                 <EditField label="Dinner Time" name="dinnerTime" value={editData.dinnerTime} onChange={handleChange} />
//                 <EditTextarea label="Hobbies (comma-separated)" name="hobbies" value={editData.hobbies} onChange={handleChange} className="sm:col-span-2" />
//                 <EditTextarea label="Games (comma-separated)" name="games" value={editData.games} onChange={handleChange} />
//               </>
//             ) : (
//               <>
//                 <ReadField label="Behaviour" value={student.behaviour} />
//                 <ReadField label="Wake Up Time" value={student.wakeUpTime} />
//                 <ReadField label="Breakfast Time" value={student.breakfastTime} />
//                 <ReadField label="Lunch Time" value={student.lunchTime} />
//                 <ReadField label="Dinner Time" value={student.dinnerTime} />
//                 <ReadField label="Hobbies" value={student.hobbies?.join(', ')} />
//                 <ReadField label="Games" value={student.games?.join(', ')} />
//               </>
//             )}
//           </div>

//           {ed === 'activity'
//             ? <SaveBar onSave={() => saveSection('activity')} onCancel={cancelEdit} saving={saving} />
//             : (
//               <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
//                 <button
//                   onClick={() => startEdit('activity', ['behaviour','wakeUpTime','breakfastTime','lunchTime','dinnerTime','hobbies','games'])}
//                   className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                 >
//                   ✏️ Edit Activities
//                 </button>
//               </div>
//             )
//           }
//         </SectionCard>
//       )}

//       {/* ══ FEE INFO ═════════════════════════════════════════════════════════ */}
//       {activeTab === 'fee' && (
//         <SectionCard title="Fee Information" icon="💳">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {ed === 'fee' ? (
//               <>
//                 <EditField label="Fee Plan" name="feePlan" value={editData.feePlan} onChange={handleChange}
//                   options={[
//                     { value: 'Daily', label: 'Daily' },
//                     { value: 'Weekly', label: 'Weekly' },
//                     { value: 'Monthly', label: 'Monthly' },
//                     { value: 'Annual', label: 'Annual' },
//                   ]}
//                 />
//                 <EditField label="Amount (₹)" name="amount" value={editData.amount} onChange={handleChange} type="number" />
//                 <EditField label="Assigned Caregiver" name="assignedCaregiver" value={editData.assignedCaregiver} onChange={handleChange} />
//                 <EditField label="Mess Facility" name="messFacility" value={editData.messFacility} onChange={handleChange}
//                   options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                 />
//                 <EditField label="Residency" name="residency" value={editData.residency} onChange={handleChange}
//                   options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
//                 />
//               </>
//             ) : (
//               <>
//                 {[
//                   { label: 'Fee Plan', value: student.feePlan },
//                   { label: 'Amount', value: student.amount != null ? `₹${Number(student.amount).toLocaleString('en-IN')}` : undefined },
//                   { label: 'Assigned Caregiver', value: student.assignedCaregiver },
//                   { label: 'Mess Facility', value: student.messFacility },
//                   { label: 'Residency', value: student.residency },
//                 ].map(({ label, value }) => (
//                   <ReadField key={label} label={label} value={value} />
//                 ))}
//               </>
//             )}
//           </div>

//           {ed === 'fee'
//             ? <SaveBar onSave={() => saveSection('fee')} onCancel={cancelEdit} saving={saving} />
//             : (
//               <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
//                 <button
//                   onClick={() => startEdit('fee', ['feePlan','amount','assignedCaregiver','messFacility','residency'])}
//                   className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
//                 >
//                   ✏️ Edit Fee Info
//                 </button>
//               </div>
//             )
//           }
//         </SectionCard>
//       )}

//     </div>
//   );
// }












import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

// ─── Error parser ─────────────────────────────────────────────────────────────
function parseApiError(err, context = 'perform this action') {
  if (!navigator.onLine)
    return 'No internet connection. Please check your network and try again.';
  const status    = err?.response?.status;
  const serverMsg = err?.response?.data?.message;
  if (status === 400) return serverMsg || 'Invalid request. Please check your input.';
  if (status === 401) return 'Your session has expired. Please log in again.';
  if (status === 403) return `You don't have permission to ${context}.`;
  if (status === 404) return 'Student not found. They may have been deleted.';
  if (status === 409) return serverMsg || 'A conflict occurred. Please check for duplicates.';
  if (status === 422) return serverMsg || 'Validation failed. Please check the data and retry.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500)  return 'Server error. Please try again later or contact support.';
  if (err?.code === 'ECONNABORTED' || err?.message?.toLowerCase().includes('timeout'))
    return 'Request timed out. Please check your connection and try again.';
  if (err?.message === 'Network Error') return 'Network error. Unable to reach the server.';
  return `Failed to ${context}. Please try again.`;
}

// ─── Shared field components ──────────────────────────────────────────────────
function ReadField({ label, value, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-800 text-sm min-h-[40px]">
        {value ?? <span className="text-gray-400">—</span>}
      </div>
    </div>
  );
}

function EditField({ label, name, value, onChange, type = 'text', options, className = '' }) {
  const base = "border border-blue-300 rounded-lg px-3 py-2.5 bg-white text-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#000359]";
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      {options
        ? (
          <select name={name} value={value ?? ''} onChange={onChange} className={base}>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : (
          <input type={type} name={name} value={value ?? ''} onChange={onChange} className={base} />
        )
      }
    </div>
  );
}

function EditTextarea({ label, name, value, onChange, rows = 3, className = '' }) {
  const base = "border border-blue-300 rounded-lg px-3 py-2.5 bg-white text-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#000359] resize-y";
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} className={base} />
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <h2 className="text-sm font-bold text-[#000359] uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function SaveBar({ onSave, onCancel, saving }) {
  return (
    <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
      <button onClick={onCancel} disabled={saving}
        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition disabled:opacity-50">
        Cancel
      </button>
      <button onClick={onSave} disabled={saving}
        className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}

const TABS = [
  { id: 'profile',   label: 'Profile',           icon: '👤' },
  { id: 'health',    label: 'Health',             icon: '🏥' },
  { id: 'emergency', label: 'Emergency Contacts', icon: '📞' },
  { id: 'activity',  label: 'Activities',         icon: '🎯' },
  { id: 'fee',       label: 'Fee Info',            icon: '💳' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StudentView() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [student,    setStudent]    = useState(null);
  const [lastHealthRecord, setLastHealthRecord] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [activeTab,  setActiveTab]  = useState('profile');
  const [editSection,setEditSection]= useState(null);
  const [editData,   setEditData]   = useState({});
  const [saving,     setSaving]     = useState(false);

  // ── Fetch Student ─────────────────────────────────────────────────────────
  const fetchStudent = useCallback(async () => {
    if (!id) {
      toast.error('No student ID in URL.');
      navigate(-1);
      return;
    }
    setLoading(true);
    try {
      const res  = await api.students.getById(id);
      let data = res?.data?.data || res?.data;

      if (!data || typeof data !== 'object' || !data._id) {
        throw new Error('INVALID_RESPONSE');
      }

      setStudent(data);
    } catch (err) {
      console.error('[StudentView] fetch:', err);
      if (err.message === 'INVALID_RESPONSE') {
        toast.error('Unexpected data from server. Please refresh.');
      } else if (err?.response?.status === 404) {
        toast.error('Student not found. They may have been deleted.');
        navigate(-1);
      } else {
        toast.error(parseApiError(err, 'load student profile'));
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // ── Fetch Latest Health Record ────────────────────────────────────────────
  const fetchLatestHealthRecord = useCallback(async () => {
    if (!id) return;
    setLoadingHealth(true);
    try {
      const res = await api.healthRecords.getAll({ 
        studentId: id 
      });

      const records = res?.data?.data || res?.data || [];
      // Take the most recent record (backend already sorts by recordDate desc)
      const latest = records.length > 0 ? records[0] : null;
      
      setLastHealthRecord(latest);
    } catch (err) {
      console.error('[StudentView] fetchLatestHealthRecord:', err);
      setLastHealthRecord(null);
    } finally {
      setLoadingHealth(false);
    }
  }, [id]);

  useEffect(() => { 
    fetchStudent(); 
  }, [fetchStudent]);

  // Fetch latest health record when health tab is active
  useEffect(() => {
    if (activeTab === 'health' && student) {
      fetchLatestHealthRecord();
    }
  }, [activeTab, student, fetchLatestHealthRecord]);

  // ── Edit helpers ──────────────────────────────────────────────────────────
  const startEdit = (section, fields) => {
    const draft = {};
    fields.forEach(f => { draft[f] = student?.[f] ?? ''; });
    if (fields.includes('hobbies')) draft.hobbies = student?.hobbies?.join(', ') ?? '';
    if (fields.includes('games'))   draft.games   = student?.games?.join(', ')   ?? '';
    setEditData(draft);
    setEditSection(section);
  };

  const cancelEdit = () => { setEditSection(null); setEditData({}); };

  const handleChange = e => {
    const { name, value } = e.target;
    setEditData(p => ({ ...p, [name]: value }));
  };

  // ── Generic section save ──────────────────────────────────────────────────
  const saveSection = async (section) => {
    setSaving(true);
    const tid = toast.loading('Saving changes…');
    try {
      if (section === 'profile') {
        if (!editData.fullName?.trim())
          return void toast.error('Full name is required.', { id: tid });
        if (!editData.mobile?.trim() || !/^\d{10}$/.test(editData.mobile.trim()))
          return void toast.error('Mobile must be exactly 10 digits.', { id: tid });
        if (!editData.age || isNaN(editData.age) || +editData.age < 1 || +editData.age > 120)
          return void toast.error('Enter a valid age (1–120).', { id: tid });
      }
      if (section === 'fee') {
        if (editData.amount !== '' && (isNaN(editData.amount) || +editData.amount < 0))
          return void toast.error('Amount must be a positive number.', { id: tid });
      }

      const payload = { ...editData };
      if (section === 'activity') {
        payload.hobbies = (editData.hobbies || '').split(',').map(h => h.trim()).filter(Boolean);
        payload.games   = (editData.games   || '').split(',').map(g => g.trim()).filter(Boolean);
      }

      const res = await api.students.update(student._id, payload);
      const updated = res?.data;
      if (!updated || typeof updated !== 'object') throw new Error('INVALID_RESPONSE');

      setStudent(updated);
      setEditSection(null);
      setEditData({});
      toast.success('Saved successfully.', { id: tid });
    } catch (err) {
      console.error(`[StudentView] save ${section}:`, err);
      if (err.message === 'INVALID_RESPONSE')
        toast.error('Server returned unexpected data. Please refresh.', { id: tid });
      else
        toast.error(parseApiError(err, 'save changes'), { id: tid });
    } finally {
      setSaving(false);
    }
  };

  // ── Emergency save ────────────────────────────────────────────────────────
  const saveEmergency = async () => {
    setSaving(true);
    const tid = toast.loading('Saving emergency contact…');
    try {
      if (!editData.primaryContactName?.trim())
        return void toast.error('Primary contact name is required.', { id: tid });
      if (!editData.primaryPhone?.trim() || !/^\d{10}$/.test(editData.primaryPhone.trim()))
        return void toast.error('Primary phone must be exactly 10 digits.', { id: tid });
      if (editData.secondaryPhone?.trim() && !/^\d{10}$/.test(editData.secondaryPhone.trim()))
        return void toast.error('Secondary phone must be exactly 10 digits.', { id: tid });

      const res     = await api.students.updateEmergencyContact(student._id, editData);
      const updated = res?.data?.data;
      if (!updated) throw new Error('INVALID_RESPONSE');

      setStudent(p => ({ ...p, ...updated }));
      setEditSection(null);
      setEditData({});
      toast.success('Emergency contact updated.', { id: tid });
    } catch (err) {
      console.error('[StudentView] saveEmergency:', err);
      if (err.message === 'INVALID_RESPONSE')
        toast.error('Unexpected server response. Please refresh.', { id: tid });
      else
        toast.error(parseApiError(err, 'update emergency contact'), { id: tid });
    } finally {
      setSaving(false);
    }
  };

  // ── Clear emergency ───────────────────────────────────────────────────────
  const clearEmergency = async () => {
    if (!window.confirm('Clear all emergency contact details? This cannot be undone.')) return;
    const tid = toast.loading('Clearing emergency contact…');
    try {
      await api.students.clearEmergencyContact(student._id);
      setStudent(p => ({
        ...p,
        primaryContactName: '', primaryRelation: '', primaryPhone: '',
        secondaryContactName: '', secondaryRelation: '', secondaryPhone: '',
      }));
      toast.success('Emergency contact cleared.', { id: tid });
    } catch (err) {
      console.error('[StudentView] clearEmergency:', err);
      toast.error(parseApiError(err, 'clear emergency contact'), { id: tid });
    }
  };

  // ── Status toggle ─────────────────────────────────────────────────────────
  const toggleStatus = async () => {
    const next = student.status === 'Active' ? 'Inactive' : 'Active';
    const tid  = toast.loading(`Changing status to ${next}…`);
    try {
      await api.students.update(student._id, { status: next });
      setStudent(p => ({ ...p, status: next }));
      toast.success(`Status changed to ${next}.`, { id: tid });
    } catch (err) {
      console.error('[StudentView] toggleStatus:', err);
      toast.error(parseApiError(err, 'update status'), { id: tid });
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto animate-pulse">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-56" />
        <div className="flex gap-2">
          {TABS.map(t => <div key={t.id} className="h-10 bg-gray-200 rounded w-28" />)}
        </div>
        <div className="bg-white rounded-xl p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((__, j) => <div key={j} className="h-10 bg-gray-200 rounded" />)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!student) return null;

  const ed = editSection;

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">

      {/* Breadcrumb + Back */}
      <div className="flex items-center justify-between">
        <nav className="text-sm text-gray-500 flex items-center gap-1">
          <button onClick={() => navigate(-1)} className="hover:text-[#000359] transition">
            Participants / Students
          </button>
          <span className="text-gray-300">›</span>
          <span className="text-gray-800 font-medium">View</span>
        </nav>
        <button onClick={() => navigate(-1)}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-lg text-sm transition">
          Back
        </button>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Participant Profile</h1>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-gray-200">
        {TABS.map(tab => (
          <button key={tab.id}
            onClick={() => { setActiveTab(tab.id); cancelEdit(); }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg
                        border-b-2 -mb-px transition ${
              activeTab === tab.id
                ? 'border-[#000359] text-[#000359] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ══ PROFILE ══════════════════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <SectionCard title="Personal Information" icon="👤">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-xl border-2 border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
                {student.photo
                  ? <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover" />
                  : <span className="text-gray-400 text-xs text-center px-2 leading-tight">Profile Photo</span>
                }
              </div>
              <button onClick={toggleStatus}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition hover:opacity-80 ${
                  student.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
                title="Click to toggle status"
              >
                {student.status || 'Unknown'}
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ed === 'profile' ? (
                <>
                  <ReadField label="Admission ID" value={student.admissionIdStr || student.admissionId} />
                  <EditField label="Full Name" name="fullName" value={editData.fullName} onChange={handleChange} />
                  <EditField label="Age" name="age" value={editData.age} onChange={handleChange} type="number" />
                  <EditField label="Mobile" name="mobile" value={editData.mobile} onChange={handleChange} type="tel" />
                  <EditField label="Gender" name="gender" value={editData.gender} onChange={handleChange}
                    options={[
                      { value: '', label: 'Select…' },
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />
                  <EditField label="Date of Birth" name="dob" value={editData.dob?.slice(0,10)} onChange={handleChange} type="date" />
                  <EditField label="Aadhaar" name="aadhaar" value={editData.aadhaar} onChange={handleChange} />
                  <EditTextarea label="Address" name="fullAddress" value={editData.fullAddress} onChange={handleChange} rows={2} className="sm:col-span-2 lg:col-span-3" />
                </>
              ) : (
                <>
                  <ReadField label="Admission ID" value={student.admissionIdStr || student.admissionId} />
                  <ReadField label="Full Name" value={student.fullName} />
                  <ReadField label="Age" value={student.age} />
                  <ReadField label="Mobile" value={student.mobile} />
                  <ReadField label="Gender" value={student.gender} />
                  <ReadField label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : undefined} />
                  <ReadField label="Aadhaar" value={student.aadhaar} />
                  <ReadField label="Address" value={student.fullAddress} className="sm:col-span-2 lg:col-span-3" />
                </>
              )}
            </div>
          </div>

          {ed === 'profile'
            ? <SaveBar onSave={() => saveSection('profile')} onCancel={cancelEdit} saving={saving} />
            : (
              <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => startEdit('profile', ['fullName','age','gender','dob','aadhaar','mobile','fullAddress'])}
                  className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            )
          }

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Student ID', value: student.studentId },
              { label: 'Fee Plan', value: student.feePlan },
              { label: 'Caregiver', value: student.assignedCaregiver },
              { label: 'Blood Group', value: student.bloodGroup },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#f0f2ff] rounded-lg px-3 py-2.5 text-center">
                <p className="text-[11px] text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-[#000359]">{value || '—'}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ══ HEALTH ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'health' && (
        <>
          <SectionCard title="Health Information" icon="🏥">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ed === 'health' ? (
                <>
                  <EditField label="Blood Group" name="bloodGroup" value={editData.bloodGroup} onChange={handleChange}
                    options={[
                      { value: '', label: 'Select…' },
                      ...['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => ({ value: g, label: g }))
                    ]}
                  />
                  <EditField label="Physical Disability" name="physicalDisability" value={editData.physicalDisability} onChange={handleChange}
                    options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
                  />
                  <EditField label="Serious Disease" name="seriousDisease" value={editData.seriousDisease} onChange={handleChange}
                    options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
                  />
                  <EditField label="Regular Medication" name="regularMedication" value={editData.regularMedication} onChange={handleChange}
                    options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
                  />
                  <EditField label="Doctor Name" name="doctorName" value={editData.doctorName} onChange={handleChange} />
                  <EditField label="Doctor Mobile" name="doctorMobile" value={editData.doctorMobile} onChange={handleChange} type="tel" />
                </>
              ) : (
                <>
                  {[
                    { label: 'Blood Group', value: student.bloodGroup },
                    { label: 'Physical Disability', value: student.physicalDisability },
                    { label: 'Serious Disease', value: student.seriousDisease },
                    { label: 'Regular Medication', value: student.regularMedication },
                    { label: 'Doctor Name', value: student.doctorName },
                    { label: 'Doctor Mobile', value: student.doctorMobile },
                  ].map(({ label, value }) => (
                    <ReadField key={label} label={label} value={value} />
                  ))}
                </>
              )}
            </div>
            {ed === 'health'
              ? <SaveBar onSave={() => saveSection('health')} onCancel={cancelEdit} saving={saving} />
              : (
                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => startEdit('health', ['bloodGroup','physicalDisability','seriousDisease','regularMedication','doctorName','doctorMobile'])}
                    className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
                  >
                    ✏️ Edit Health Info
                  </button>
                </div>
              )
            }
          </SectionCard>

          {/* Last Health Checkup — Now from latest Health Record */}
          <SectionCard title="Last Health Checkup" icon="🩺">
            {loadingHealth ? (
              <div className="py-8 text-center text-gray-500">Loading latest health record...</div>
            ) : lastHealthRecord ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ReadField 
                  label="Last Checkup Date" 
                  value={lastHealthRecord.recordDate 
                    ? new Date(lastHealthRecord.recordDate).toLocaleDateString('en-IN') 
                    : '—'} 
                />
                <ReadField 
                  label="Doctor / Clinic" 
                  value={lastHealthRecord.doctorName || lastHealthRecord.doctor || '—'} 
                />
                <ReadField 
                  label="Health Status" 
                  value={lastHealthRecord.status || '—'} 
                />
                <ReadField 
                  label="Diagnosis / Notes" 
                  value={lastHealthRecord.diagnosis || lastHealthRecord.notes || '—'} 
                  className="sm:col-span-3" 
                />
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No health records found yet.
              </div>
            )}
            <div className="flex gap-3 mt-5 flex-wrap">
              {/* Commented buttons preserved as-is */}
            </div>
          </SectionCard>
        </>
      )}

      {/* ══ EMERGENCY CONTACTS ═══════════════════════════════════════════════ */}
      {activeTab === 'emergency' && (
        <SectionCard title="Emergency Contacts" icon="📞">
          {ed === 'emergency' ? (
            <>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Primary Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <EditField label="Contact Name" name="primaryContactName" value={editData.primaryContactName} onChange={handleChange} />
                <EditField label="Relation" name="primaryRelation" value={editData.primaryRelation} onChange={handleChange} />
                <EditField label="Phone" name="primaryPhone" value={editData.primaryPhone} onChange={handleChange} type="tel" />
              </div>

              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-3">Secondary Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <EditField label="Contact Name" name="secondaryContactName" value={editData.secondaryContactName} onChange={handleChange} />
                <EditField label="Relation" name="secondaryRelation" value={editData.secondaryRelation} onChange={handleChange} />
                <EditField label="Phone" name="secondaryPhone" value={editData.secondaryPhone} onChange={handleChange} type="tel" />
              </div>
              <SaveBar onSave={saveEmergency} onCancel={cancelEdit} saving={saving} />
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Primary Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ReadField label="Contact Name" value={student.primaryContactName} />
                <ReadField label="Relation" value={student.primaryRelation} />
                <ReadField label="Phone" value={student.primaryPhone} />
              </div>

              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-3">Secondary Contact</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ReadField label="Contact Name" value={student.secondaryContactName} />
                <ReadField label="Relation" value={student.secondaryRelation} />
                <ReadField label="Phone" value={student.secondaryPhone} />
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3 flex-wrap">
                <button
                  onClick={() => startEdit('emergency', [
                    'primaryContactName','primaryRelation','primaryPhone',
                    'secondaryContactName','secondaryRelation','secondaryPhone',
                  ])}
                  className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
                >
                  ✏️ Edit Contacts
                </button>
                {(student.primaryContactName || student.secondaryContactName) && (
                  <button onClick={clearEmergency}
                    className="px-5 py-2 text-sm border border-red-300 hover:bg-red-50 text-red-600 rounded-lg transition">
                    🗑 Clear All
                  </button>
                )}
              </div>
            </>
          )}
        </SectionCard>
      )}

      {/* ══ ACTIVITIES ═══════════════════════════════════════════════════════ */}
      {activeTab === 'activity' && (
        <SectionCard title="Activities & Lifestyle" icon="🎯">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ed === 'activity' ? (
              <>
                <EditField label="Behaviour" name="behaviour" value={editData.behaviour} onChange={handleChange}
                  options={[
                    { value: '', label: 'Select…' },
                    { value: 'Calm', label: 'Calm' },
                    { value: 'Moderate', label: 'Moderate'},
                    { value: 'Angry', label: 'Angry' },
                    { value: 'Strict', label: 'Strict' },
                  ]}
                />
                <EditField label="Wake Up Time" name="wakeUpTime" value={editData.wakeUpTime} onChange={handleChange} />
                <EditField label="Breakfast Time" name="breakfastTime" value={editData.breakfastTime} onChange={handleChange} />
                <EditField label="Lunch Time" name="lunchTime" value={editData.lunchTime} onChange={handleChange} />
                <EditField label="Dinner Time" name="dinnerTime" value={editData.dinnerTime} onChange={handleChange} />
                <EditTextarea label="Hobbies (comma-separated)" name="hobbies" value={editData.hobbies} onChange={handleChange} className="sm:col-span-2" />
                <EditTextarea label="Games (comma-separated)" name="games" value={editData.games} onChange={handleChange} />
              </>
            ) : (
              <>
                <ReadField label="Behaviour" value={student.behaviour} />
                <ReadField label="Wake Up Time" value={student.wakeUpTime} />
                <ReadField label="Breakfast Time" value={student.breakfastTime} />
                <ReadField label="Lunch Time" value={student.lunchTime} />
                <ReadField label="Dinner Time" value={student.dinnerTime} />
                <ReadField label="Hobbies" value={student.hobbies?.join(', ')} />
                <ReadField label="Games" value={student.games?.join(', ')} />
              </>
            )}
          </div>

          {ed === 'activity'
            ? <SaveBar onSave={() => saveSection('activity')} onCancel={cancelEdit} saving={saving} />
            : (
              <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => startEdit('activity', ['behaviour','wakeUpTime','breakfastTime','lunchTime','dinnerTime','hobbies','games'])}
                  className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
                >
                  ✏️ Edit Activities
                </button>
              </div>
            )
          }
        </SectionCard>
      )}

      {/* ══ FEE INFO ═════════════════════════════════════════════════════════ */}
      {activeTab === 'fee' && (
        <SectionCard title="Fee Information" icon="💳">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ed === 'fee' ? (
              <>
                <EditField label="Fee Plan" name="feePlan" value={editData.feePlan} onChange={handleChange}
                  options={[
                    { value: 'Daily', label: 'Daily' },
                    { value: 'Weekly', label: 'Weekly' },
                    { value: 'Monthly', label: 'Monthly' },
                    { value: 'Annual', label: 'Annual' },
                  ]}
                />
                <EditField label="Amount (₹)" name="amount" value={editData.amount} onChange={handleChange} type="number" />
                <EditField label="Assigned Caregiver" name="assignedCaregiver" value={editData.assignedCaregiver} onChange={handleChange} />
                <EditField label="Mess Facility" name="messFacility" value={editData.messFacility} onChange={handleChange}
                  options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
                />
                <EditField label="Residency" name="residency" value={editData.residency} onChange={handleChange}
                  options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
                />
              </>
            ) : (
              <>
                {[
                  { label: 'Fee Plan', value: student.feePlan },
                  { label: 'Amount', value: student.amount != null ? `₹${Number(student.amount).toLocaleString('en-IN')}` : undefined },
                  { label: 'Assigned Caregiver', value: student.assignedCaregiver },
                  { label: 'Mess Facility', value: student.messFacility },
                  { label: 'Residency', value: student.residency },
                ].map(({ label, value }) => (
                  <ReadField key={label} label={label} value={value} />
                ))}
              </>
            )}
          </div>

          {ed === 'fee'
            ? <SaveBar onSave={() => saveSection('fee')} onCancel={cancelEdit} saving={saving} />
            : (
              <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => startEdit('fee', ['feePlan','amount','assignedCaregiver','messFacility','residency'])}
                  className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] text-white font-medium rounded-lg transition"
                >
                  ✏️ Edit Fee Info
                </button>
              </div>
            )
          }
        </SectionCard>
      )}
      
    </div>
  );
}