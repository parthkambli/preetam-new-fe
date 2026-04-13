// // pages/school/Staff/AddStaff.jsx
// import { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Select from 'react-select';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// // ─── Constants ────────────────────────────────────────────────────────────────
// const MAX_PHOTO_SIZE_MB = 2;
// const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// const emptyForm = {
//   fullName: '',
//   loginId: '',
//   role: '',
//   employmentType: '',
//   mobile: '',
//   email: '',
//   gender: '',
//   dob: '',
//   joiningDate: '',
//   status: 'Active',
//   salary: '',
//   fullAddress: '',
//   emergencyContactName: '',
//   emergencyContactRelation: '',
//   emergencyContactMobile: '',
//   password: '',
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// /** Returns today's date as YYYY-MM-DD for the max attribute on date inputs */
// const getTodayString = () => new Date().toISOString().split('T')[0];

// /**
//  * Generates a random 8-character password with at least one uppercase letter,
//  * one lowercase letter, and two digits. Pattern: e.g. "Xk9mP2qR"
//  */
// const generatePassword = () => {
//   const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
//   const lower = 'abcdefghjkmnpqrstuvwxyz';
//   const digits = '23456789';
//   const all = upper + lower + digits;

//   // Guarantee at least one of each category
//   let pwd =
//     upper[Math.floor(Math.random() * upper.length)] +
//     lower[Math.floor(Math.random() * lower.length)] +
//     digits[Math.floor(Math.random() * digits.length)] +
//     digits[Math.floor(Math.random() * digits.length)];

//   // Fill remaining 4 characters from the full pool
//   for (let i = 0; i < 4; i++) {
//     pwd += all[Math.floor(Math.random() * all.length)];
//   }

//   // Shuffle so the guaranteed chars aren't always at fixed positions
//   return pwd
//     .split('')
//     .sort(() => Math.random() - 0.5)
//     .join('');
// };

// // ─── Validation Helpers ───────────────────────────────────────────────────────

// /**
//  * Validates a photo file for type and size.
//  * Returns an error string, or null if valid.
//  */
// const validatePhoto = (file) => {
//   if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
//     return 'Only JPG, PNG, or WebP images are allowed.';
//   }
//   if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
//     return `Photo must be smaller than ${MAX_PHOTO_SIZE_MB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`;
//   }
//   return null;
// };

// /**
//  * Validates all form fields.
//  * Returns an object: { fieldName: 'error message' }
//  * Empty object means no errors.
//  */
// const validateForm = (form) => {
//   const errors = {};

//   // Full Name
//   if (!form.fullName.trim()) {
//     errors.fullName = 'Full name is required.';
//   } else if (form.fullName.trim().length < 2) {
//     errors.fullName = 'Full name must be at least 2 characters.';
//   } else if (form.fullName.trim().length > 100) {
//     errors.fullName = 'Full name must not exceed 100 characters.';
//   }

//   // Mobile — must be exactly 10 digits
//   if (!form.mobile.trim()) {
//     errors.mobile = 'Mobile number is required.';
//   } else if (!/^\d{10}$/.test(form.mobile.trim())) {
//     errors.mobile = 'Mobile must be exactly 10 digits (numbers only).';
//   }

//   // Email — optional but must be valid format if provided
//   if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
//     errors.email = 'Enter a valid email address (e.g. staff@school.com).';
//   }

//   // Role
//   if (!form.role) {
//     errors.role = 'Please select a role.';
//   }

//   // Employment Type
//   if (!form.employmentType) {
//     errors.employmentType = 'Please select an employment type.';
//   }

//   // Joining Date
//   if (!form.joiningDate) {
//     errors.joiningDate = 'Joining date is required.';
//   }

//   // Date of Birth — must not be in the future, must be a realistic age
//   if (form.dob) {
//     const dobDate = new Date(form.dob);
//     const today = new Date();
//     const age = today.getFullYear() - dobDate.getFullYear();
//     if (dobDate > today) {
//       errors.dob = 'Date of birth cannot be in the future.';
//     } else if (age < 18) {
//       errors.dob = 'Staff must be at least 18 years old.';
//     } else if (age > 80) {
//       errors.dob = 'Please enter a valid date of birth.';
//     }
//   }

//   // Joining date must not be more than 10 years in the future
//   if (form.joiningDate) {
//     const joiningDate = new Date(form.joiningDate);
//     const tenYearsFromNow = new Date();
//     tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);
//     if (joiningDate > tenYearsFromNow) {
//       errors.joiningDate = 'Joining date seems too far in the future.';
//     }
//   }

//   // Password — required and length checked (auto-generated value will always pass)
//   if (!form.password.trim()) {
//     errors.password = 'Password is required.';
//   } else if (form.password.trim().length < 6) {
//     errors.password = 'Password must be at least 6 characters.';
//   } else if (form.password.trim().length > 50) {
//     errors.password = 'Password must not exceed 50 characters.';
//   }

//   // Salary — must be a positive number if provided
//   if (form.salary !== '' && form.salary !== null) {
//     const salaryNum = Number(form.salary);
//     if (isNaN(salaryNum) || salaryNum < 0) {
//       errors.salary = 'Salary must be a positive number.';
//     } else if (salaryNum > 10000000) {
//       errors.salary = 'Salary value seems too high. Please check.';
//     }
//   }

//   // Emergency contact mobile — 10 digits if provided
//   if (form.emergencyContactMobile.trim() && !/^\d{10}$/.test(form.emergencyContactMobile.trim())) {
//     errors.emergencyContactMobile = 'Emergency mobile must be exactly 10 digits.';
//   }

//   return errors;
// };

// // ─── Reusable Field Components ────────────────────────────────────────────────

// function InputField({ label, name, value, onChange, type = 'text', required, placeholder, error, ...rest }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//         {label}{required && <span className="text-red-500 ml-0.5">*</span>}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         {...rest}
//         className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
//           focus:outline-none focus:ring-2 bg-white transition-all
//           ${error
//             ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400'
//             : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'
//           }`}
//       />
//       {error && <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
//         <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
//           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//         </svg>
//         {error}
//       </p>}
//     </div>
//   );
// }

// function SectionDivider({ title }) {
//   return (
//     <div className="flex items-center gap-3 pt-2">
//       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{title}</span>
//       <div className="flex-1 h-px bg-gray-200" />
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function AddStaff() {
//   const navigate = useNavigate();
//   const fileRef = useRef(null);

//   const [form, setForm] = useState(emptyForm);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [photoFile, setPhotoFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [wasPasswordAutoGenerated, setWasPasswordAutoGenerated] = useState(false);

//   const [roleOptions, setRoleOptions] = useState([]);
//   const [employmentTypeOptions, setEmploymentTypeOptions] = useState([]);
//   const [loadingOptions, setLoadingOptions] = useState(false);

//   // ── Fetch dropdown options on mount ────────────────────────────────────────
//   useEffect(() => {
//     const fetchOptions = async () => {
//       setLoadingOptions(true);
//       try {
//         const [rolesRes, empTypesRes] = await Promise.all([
//           api.staff.getRoles(),
//           api.staff.getEmploymentTypes()
//         ]);

//         const roles = rolesRes.data?.data || rolesRes.data || [];
//         const empTypes = empTypesRes.data?.data || empTypesRes.data || [];

//         if (roles.length === 0) {
//           toast.warning('No roles found. Please add roles first from the Staff menu.');
//         }
//         if (empTypes.length === 0) {
//           toast.warning('No employment types found. Please add them first from the Staff menu.');
//         }

//         setRoleOptions(roles.map(item => ({
//           value: item.name || item,
//           label: item.name || item
//         })));

//         setEmploymentTypeOptions(empTypes.map(item => ({
//           value: item.name || item,
//           label: item.name || item
//         })));

//       } catch (err) {
//         if (!err.response) {
//           toast.error('Cannot connect to server. Please check your internet connection.');
//         } else {
//           toast.error('Failed to load roles and employment types. Please refresh the page.');
//         }
//       } finally {
//         setLoadingOptions(false);
//       }
//     };

//     fetchOptions();
//   }, []);

//   // ── Handlers ────────────────────────────────────────────────────────────────

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     const phoneFields = ['mobile', 'emergencyContactMobile'];
//     const processedValue = phoneFields.includes(name)
//       ? value.replace(/\D/g, '').slice(0, 10)
//       : value;

//     setForm(prev => ({ ...prev, [name]: processedValue }));

//     // If the user manually edits the password field, clear the auto-generated flag
//     if (name === 'password') {
//       setWasPasswordAutoGenerated(false);
//     }

//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleRoleChange = (selected) => {
//     setForm(prev => ({ ...prev, role: selected ? selected.value : '' }));
//     if (fieldErrors.role) setFieldErrors(prev => ({ ...prev, role: '' }));
//   };

//   const handleEmploymentTypeChange = (selected) => {
//     setForm(prev => ({ ...prev, employmentType: selected ? selected.value : '' }));
//     if (fieldErrors.employmentType) setFieldErrors(prev => ({ ...prev, employmentType: '' }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const photoError = validatePhoto(file);
//     if (photoError) {
//       toast.error(photoError);
//       e.target.value = '';
//       return;
//     }

//     setPhotoFile(file);
//     setPhotoPreview(URL.createObjectURL(file));
//     toast.success('Photo selected successfully.');
//   };

//   // ── Password generation ───────────────────────────────────────────────────

//   const handleGeneratePassword = () => {
//     const pwd = generatePassword();
//     setForm(prev => ({ ...prev, password: pwd }));
//     setWasPasswordAutoGenerated(true);
//     if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
//     // Copy to clipboard as a convenience
//     navigator.clipboard?.writeText(pwd).catch(() => {});
//     toast.success(`Password generated: ${pwd} (copied to clipboard)`);
//   };

//   // ── Submit ───────────────────────────────────────────────────────────────────

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Auto-generate password if the field was left empty before running validation
//     let submittedForm = form;
//     if (!form.password.trim()) {
//       const autoPassword = generatePassword();
//       submittedForm = { ...form, password: autoPassword };
//       setForm(submittedForm);
//       setWasPasswordAutoGenerated(true);
//       navigator.clipboard?.writeText(autoPassword).catch(() => {});
//       toast.info(`No password entered — auto-generated: ${autoPassword} (copied to clipboard)`);
//     }

//     // Validate all fields
//     const errors = validateForm(submittedForm);

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       const firstError = Object.values(errors)[0];
//       toast.error(firstError);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//       return;
//     }

//     setFieldErrors({});
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append('fullName', submittedForm.fullName.trim());
//       formData.append('loginId', submittedForm.loginId.trim() || submittedForm.mobile.trim());
//       formData.append('role', submittedForm.role);
//       formData.append('employmentType', submittedForm.employmentType);
//       formData.append('mobile', submittedForm.mobile.trim());
//       formData.append('email', submittedForm.email.trim() || '');
//       formData.append('gender', submittedForm.gender || '');
//       formData.append('dob', submittedForm.dob || '');
//       formData.append('joiningDate', submittedForm.joiningDate);
//       formData.append('status', submittedForm.status);
//       formData.append('salary', submittedForm.salary || 0);
//       formData.append('fullAddress', submittedForm.fullAddress.trim() || '');
//       formData.append('emergencyContactName', submittedForm.emergencyContactName.trim() || '');
//       formData.append('emergencyContactRelation', submittedForm.emergencyContactRelation.trim() || '');
//       formData.append('emergencyContactMobile', submittedForm.emergencyContactMobile.trim() || '');
//       formData.append('password', submittedForm.password.trim());

//       if (photoFile) formData.append('photo', photoFile);

//       await api.staff.create(formData);

//       toast.success('Staff member added successfully!');

//       setTimeout(() => {
//         navigate('/school/staff');
//       }, 1500);

//     } catch (err) {
//       console.error('AddStaff submit error:', err);
//       handleApiError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Central API error handler — covers all server error types.
//    */
//   const handleApiError = (err) => {
//     if (!err.response) {
//       toast.error('Cannot reach the server. Please check your internet connection.');
//       return;
//     }

//     const { status, data } = err.response;

//     switch (status) {
//       case 400:
//         if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
//           data.errors.forEach((msg) => toast.error(msg));
//         } else {
//           toast.error(data.message || 'Invalid data. Please check your inputs.');
//         }
//         break;

//       case 409:
//         toast.error(data.message || 'A staff member with this mobile or Login ID already exists.');
//         setFieldErrors(prev => ({
//           ...prev,
//           mobile: 'This mobile number is already registered.'
//         }));
//         break;

//       case 413:
//         toast.error('The photo file is too large for the server. Please use an image smaller than 2MB.');
//         break;

//       case 422:
//         toast.error(data.message || 'The form data could not be processed. Please check your inputs.');
//         break;

//       case 500:
//         toast.error('Server error. Please try again in a moment. If it persists, contact support.');
//         break;

//       case 503:
//         toast.error('Server is temporarily unavailable. Please try again later.');
//         break;

//       default:
//         toast.error(data?.message || `Unexpected error (${status}). Please try again.`);
//     }
//   };

//   const handleReset = () => {
//     setForm(emptyForm);
//     setPhotoPreview(null);
//     setPhotoFile(null);
//     setFieldErrors({});
//     setWasPasswordAutoGenerated(false);
//     if (fileRef.current) fileRef.current.value = '';
//     toast.info('Form has been reset.');
//   };

//   // ── Render ───────────────────────────────────────────────────────────────────

//   const errorCount = Object.values(fieldErrors).filter(Boolean).length;

//   return (
//     <div className="p-4 sm:p-6">
//       <h1 className="text-sm font-semibold text-gray-500 mb-5">
//         Staff &gt; <span className="text-gray-800">Add Staff</span>
//       </h1>

//       {errorCount > 0 && (
//         <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
//           <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
//           </svg>
//           <div>
//             <p className="font-semibold">Please fix {errorCount} error{errorCount > 1 ? 's' : ''} before submitting:</p>
//             <ul className="mt-1 list-disc list-inside space-y-0.5">
//               {Object.values(fieldErrors).filter(Boolean).map((err, i) => (
//                 <li key={i}>{err}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} noValidate>
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">

//           {/* Photo Upload */}
//           <div className="flex items-center gap-5">
//             <div
//               onClick={() => fileRef.current?.click()}
//               className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#000359] transition-colors group shrink-0 overflow-hidden bg-gray-50"
//             >
//               {photoPreview ? (
//                 <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
//               ) : (
//                 <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-[#000359] transition-colors">
//                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
//                   </svg>
//                 </div>
//               )}
//               {photoPreview && (
//                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
//                   <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
//                   </svg>
//                 </div>
//               )}
//             </div>
//             <input
//               ref={fileRef}
//               type="file"
//               accept="image/jpeg,image/jpg,image/png,image/webp"
//               className="hidden"
//               onChange={handlePhotoChange}
//             />
//             <div>
//               <p className="text-sm font-semibold text-gray-700">Profile Photo</p>
//               <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, or WebP · Max {MAX_PHOTO_SIZE_MB}MB · Optional</p>
//               {photoPreview && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setPhotoPreview(null);
//                     setPhotoFile(null);
//                     if (fileRef.current) fileRef.current.value = '';
//                   }}
//                   className="mt-1 text-xs text-red-500 hover:text-red-600"
//                 >
//                   Remove photo
//                 </button>
//               )}
//             </div>
//           </div>

//           <SectionDivider title="Basic Information" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             <InputField
//               label="Full Name" name="fullName" value={form.fullName}
//               onChange={handleChange} required placeholder="e.g. Suresh Patil"
//               error={fieldErrors.fullName}
//             />

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Role<span className="text-red-500 ml-0.5">*</span>
//               </label>
//               <Select
//                 options={roleOptions}
//                 value={roleOptions.find(r => r.value === form.role) || null}
//                 onChange={handleRoleChange}
//                 isLoading={loadingOptions}
//                 placeholder={loadingOptions ? 'Loading...' : 'Select Role'}
//                 className="text-sm"
//                 classNamePrefix="react-select"
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     borderColor: fieldErrors.role ? '#f87171' : base.borderColor,
//                     backgroundColor: fieldErrors.role ? '#fef2f2' : base.backgroundColor,
//                   }),
//                 }}
//               />
//               {fieldErrors.role && (
//                 <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
//                   <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {fieldErrors.role}
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Gender<span className="text-red-500 ml-0.5">*</span>
//               </label>
//               <select
//                 name="gender" value={form.gender} onChange={handleChange}
//                 className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800
//                   focus:outline-none focus:ring-2 bg-white transition-all appearance-none
//                   ${fieldErrors.gender ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'}`}
//               >
//                 <option value="">Select Gender</option>
//                 <option>Male</option>
//                 <option>Female</option>
//                 <option>Other</option>
//               </select>
//               {fieldErrors.gender && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.gender}</p>}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             <InputField
//               label="Date of Birth" name="dob" value={form.dob}
//               onChange={handleChange} type="date"
//               max={getTodayString()}
//               error={fieldErrors.dob}
//             />

//             <InputField
//               label="Joining Date" name="joiningDate" value={form.joiningDate}
//               onChange={handleChange} type="date" required
//               error={fieldErrors.joiningDate}
//             />

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Employment Type<span className="text-red-500 ml-0.5">*</span>
//               </label>
//               <Select
//                 options={employmentTypeOptions}
//                 value={employmentTypeOptions.find(et => et.value === form.employmentType) || null}
//                 onChange={handleEmploymentTypeChange}
//                 isLoading={loadingOptions}
//                 placeholder={loadingOptions ? 'Loading...' : 'Select Employment Type'}
//                 className="text-sm"
//                 classNamePrefix="react-select"
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     borderColor: fieldErrors.employmentType ? '#f87171' : base.borderColor,
//                     backgroundColor: fieldErrors.employmentType ? '#fef2f2' : base.backgroundColor,
//                   }),
//                 }}
//               />
//               {fieldErrors.employmentType && (
//                 <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
//                   <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {fieldErrors.employmentType}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
//               <select
//                 name="status" value={form.status} onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all appearance-none"
//               >
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
//             <InputField
//               label="Salary (₹)" name="salary" value={form.salary}
//               onChange={handleChange} type="number" placeholder="e.g. 18000"
//               error={fieldErrors.salary}
//             />
//           </div>

//           <SectionDivider title="Login Credentials" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             <InputField
//               label="Mobile Number" name="mobile" value={form.mobile}
//               onChange={handleChange} type="tel" required
//               placeholder="10-digit number"
//               inputMode="numeric"
//               maxLength={10}
//               error={fieldErrors.mobile}
//             />
//             <InputField
//               label="Email ID" name="email" value={form.email}
//               onChange={handleChange} type="email" placeholder="staff@school.com"
//               error={fieldErrors.email}
//             />

//             {/* ── Password field with Generate button ── */}
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Password<span className="text-red-500 ml-0.5">*</span>
//                 <span className="ml-1 font-normal normal-case text-gray-400">(auto-generated if blank)</span>
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Min 6 characters"
//                   className={`flex-1 min-w-0 border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
//                     focus:outline-none focus:ring-2 bg-white transition-all font-mono tracking-wider
//                     ${fieldErrors.password
//                       ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400'
//                       : wasPasswordAutoGenerated
//                         ? 'border-green-400 bg-green-50 focus:ring-green-200 focus:border-green-400'
//                         : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'
//                     }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={handleGeneratePassword}
//                   title="Generate a random password"
//                   className="shrink-0 px-2.5 py-2 text-xs font-semibold text-[#000359] border border-[#000359]/30 rounded-lg bg-[#000359]/5 hover:bg-[#000359]/10 transition-colors flex items-center gap-1.5 whitespace-nowrap"
//                 >
//                   {/* Refresh / dice icon */}
//                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   Generate
//                 </button>
//               </div>
//               {wasPasswordAutoGenerated && !fieldErrors.password && (
//                 <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
//                   <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   Password auto-generated &amp; copied to clipboard. Share it with the staff member.
//                 </p>
//               )}
//               {fieldErrors.password && (
//                 <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
//                   <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {fieldErrors.password}
//                 </p>
//               )}
//             </div>
//           </div>

//           <SectionDivider title="Address" />
//           <div>
//             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Full Address</label>
//             <textarea
//               name="fullAddress"
//               value={form.fullAddress}
//               onChange={handleChange}
//               rows={3}
//               placeholder="Street, City, State, PIN"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] resize-none transition-all"
//             />
//           </div>

//           <SectionDivider title="Emergency Contact" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             <InputField label="Contact Name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} placeholder="e.g. Ramesh Patil" />
//             <InputField label="Relation" name="emergencyContactRelation" value={form.emergencyContactRelation} onChange={handleChange} placeholder="e.g. Brother" />
//             <InputField
//               label="Contact Mobile" name="emergencyContactMobile" value={form.emergencyContactMobile}
//               onChange={handleChange} type="tel" placeholder="10-digit mobile"
//               inputMode="numeric"
//               maxLength={10}
//               error={fieldErrors.emergencyContactMobile}
//             />
//           </div>

//           <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100">
//             <button
//               type="button"
//               onClick={handleReset}
//               disabled={loading}
//               className="w-full sm:w-auto px-6 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium disabled:opacity-50"
//             >
//               Reset
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full sm:w-auto px-6 py-2.5 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-50 flex items-center gap-2"
//             >
//               {loading && (
//                 <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                 </svg>
//               )}
//               {loading ? 'Adding Staff...' : 'Add Staff'}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }










// pages/school/Staff/AddStaff.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_PHOTO_SIZE_MB = 2;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const emptyForm = {
  fullName: '',
  loginId: '',
  role: '',
  employmentType: '',
  mobile: '',
  email: '',
  gender: '',
  dob: '',
  joiningDate: '',
  status: 'Active',
  salary: '',
  fullAddress: '',
  emergencyContactName: '',
  emergencyContactRelation: '',
  emergencyContactMobile: '',
  password: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns today's date as YYYY-MM-DD for the max attribute on date inputs */
const getTodayString = () => new Date().toISOString().split('T')[0];

/**
 * Generates a random 8-character password with at least one uppercase letter,
 * one lowercase letter, and two digits. Pattern: e.g. "Xk9mP2qR"
 */
const generatePassword = () => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const all = upper + lower + digits;

  // Guarantee at least one of each category
  let pwd =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    digits[Math.floor(Math.random() * digits.length)] +
    digits[Math.floor(Math.random() * digits.length)];

  // Fill remaining 4 characters from the full pool
  for (let i = 0; i < 4; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle so the guaranteed chars aren't always at fixed positions
  return pwd
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

// ─── Validation Helpers ───────────────────────────────────────────────────────

/**
 * Validates a photo file for type and size.
 * Returns an error string, or null if valid.
 */
const validatePhoto = (file) => {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, or WebP images are allowed.';
  }
  if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
    return `Photo must be smaller than ${MAX_PHOTO_SIZE_MB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`;
  }
  return null;
};

/**
 * Validates all form fields.
 * Returns an object: { fieldName: 'error message' }
 * Empty object means no errors.
 */
const validateForm = (form) => {
  const errors = {};

  // Full Name
  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  } else if (form.fullName.trim().length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters.';
  }

  // Mobile — must be exactly 10 digits
  if (!form.mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!/^\d{10}$/.test(form.mobile.trim())) {
    errors.mobile = 'Mobile must be exactly 10 digits (numbers only).';
  }

  // Email — optional but must be valid format if provided
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address (e.g. staff@school.com).';
  }

  // Role
  if (!form.role) {
    errors.role = 'Please select a role.';
  }

  // Employment Type
  if (!form.employmentType) {
    errors.employmentType = 'Please select an employment type.';
  }

  // Joining Date
  if (!form.joiningDate) {
    errors.joiningDate = 'Joining date is required.';
  }

  // Date of Birth — must not be in the future, must be a realistic age
  if (form.dob) {
    const dobDate = new Date(form.dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    if (dobDate > today) {
      errors.dob = 'Date of birth cannot be in the future.';
    } else if (age < 18) {
      errors.dob = 'Staff must be at least 18 years old.';
    } else if (age > 80) {
      errors.dob = 'Please enter a valid date of birth.';
    }
  }

  // Joining date must not be more than 10 years in the future
  if (form.joiningDate) {
    const joiningDate = new Date(form.joiningDate);
    const tenYearsFromNow = new Date();
    tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);
    if (joiningDate > tenYearsFromNow) {
      errors.joiningDate = 'Joining date seems too far in the future.';
    }
  }

  // Password — required and length checked (auto-generated value will always pass)
  if (!form.password.trim()) {
    errors.password = 'Password is required.';
  } else if (form.password.trim().length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  } else if (form.password.trim().length > 50) {
    errors.password = 'Password must not exceed 50 characters.';
  }

  // Salary — must be a positive number if provided
  if (form.salary !== '' && form.salary !== null) {
    const salaryNum = Number(form.salary);
    if (isNaN(salaryNum) || salaryNum < 0) {
      errors.salary = 'Salary must be a positive number.';
    } else if (salaryNum > 10000000) {
      errors.salary = 'Salary value seems too high. Please check.';
    }
  }

  // Emergency contact mobile — 10 digits if provided
  if (form.emergencyContactMobile.trim() && !/^\d{10}$/.test(form.emergencyContactMobile.trim())) {
    errors.emergencyContactMobile = 'Emergency mobile must be exactly 10 digits.';
  }

  return errors;
};

// ─── Reusable Field Components ────────────────────────────────────────────────

function InputField({ label, name, value, onChange, type = 'text', required, placeholder, error, ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
          focus:outline-none focus:ring-2 bg-white transition-all
          ${error
            ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400'
            : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'
          }`}
      />
      {error && <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>}
    </div>
  );
}

function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{title}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddStaff() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [wasPasswordAutoGenerated, setWasPasswordAutoGenerated] = useState(false);

  const [roleOptions, setRoleOptions] = useState([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // ── Fetch dropdown options on mount ────────────────────────────────────────
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const [rolesRes, empTypesRes] = await Promise.all([
          api.staff.roles.getAll(),
          api.staff.employmentTypes.getAll()
        ]);

        const roles = rolesRes.data?.data || rolesRes.data || [];
        const empTypes = empTypesRes.data?.data || empTypesRes.data || [];

        if (roles.length === 0) {
          toast.warning('No roles found. Please add roles first from the Staff menu.');
        }
        if (empTypes.length === 0) {
          toast.warning('No employment types found. Please add them first from the Staff menu.');
        }

        setRoleOptions(roles.map(item => ({
          value: item.name || item,
          label: item.name || item
        })));

        setEmploymentTypeOptions(empTypes.map(item => ({
          value: item.name || item,
          label: item.name || item
        })));

      } catch (err) {
        if (!err.response) {
          toast.error('Cannot connect to server. Please check your internet connection.');
        } else {
          toast.error('Failed to load roles and employment types. Please refresh the page.');
        }
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;

    const phoneFields = ['mobile', 'emergencyContactMobile'];
    const processedValue = phoneFields.includes(name)
      ? value.replace(/\D/g, '').slice(0, 10)
      : value;

    setForm(prev => ({ ...prev, [name]: processedValue }));

    // If the user manually edits the password field, clear the auto-generated flag
    if (name === 'password') {
      setWasPasswordAutoGenerated(false);
    }

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (selected) => {
    setForm(prev => ({ ...prev, role: selected ? selected.value : '' }));
    if (fieldErrors.role) setFieldErrors(prev => ({ ...prev, role: '' }));
  };

  const handleEmploymentTypeChange = (selected) => {
    setForm(prev => ({ ...prev, employmentType: selected ? selected.value : '' }));
    if (fieldErrors.employmentType) setFieldErrors(prev => ({ ...prev, employmentType: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const photoError = validatePhoto(file);
    if (photoError) {
      toast.error(photoError);
      e.target.value = '';
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    toast.success('Photo selected successfully.');
  };

  // ── Password generation ───────────────────────────────────────────────────

  const handleGeneratePassword = () => {
    const pwd = generatePassword();
    setForm(prev => ({ ...prev, password: pwd }));
    setWasPasswordAutoGenerated(true);
    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
    // Copy to clipboard as a convenience
    navigator.clipboard?.writeText(pwd).catch(() => {});
    toast.success(`Password generated: ${pwd} (copied to clipboard)`);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Auto-generate password if the field was left empty before running validation
  //   let submittedForm = form;
  //   if (!form.password.trim()) {
  //     const autoPassword = generatePassword();
  //     submittedForm = { ...form, password: autoPassword };
  //     setForm(submittedForm);
  //     setWasPasswordAutoGenerated(true);
  //     navigator.clipboard?.writeText(autoPassword).catch(() => {});
  //     toast.info(`No password entered — auto-generated: ${autoPassword} (copied to clipboard)`);
  //   }

  //   // Validate all fields
  //   const errors = validateForm(submittedForm);

  //   if (Object.keys(errors).length > 0) {
  //     setFieldErrors(errors);
  //     const firstError = Object.values(errors)[0];
  //     toast.error(firstError);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //     return;
  //   }

  //   setFieldErrors({});
  //   setLoading(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append('fullName', submittedForm.fullName.trim());
  //     formData.append('loginId', submittedForm.loginId.trim() || submittedForm.mobile.trim());
  //     formData.append('role', submittedForm.role);
  //     formData.append('employmentType', submittedForm.employmentType);
  //     formData.append('mobile', submittedForm.mobile.trim());
  //     formData.append('email', submittedForm.email.trim() || '');
  //     formData.append('gender', submittedForm.gender || '');
  //     formData.append('dob', submittedForm.dob || '');
  //     formData.append('joiningDate', submittedForm.joiningDate);
  //     formData.append('status', submittedForm.status);
  //     formData.append('salary', submittedForm.salary || 0);
  //     formData.append('fullAddress', submittedForm.fullAddress.trim() || '');
  //     formData.append('emergencyContactName', submittedForm.emergencyContactName.trim() || '');
  //     formData.append('emergencyContactRelation', submittedForm.emergencyContactRelation.trim() || '');
  //     formData.append('emergencyContactMobile', submittedForm.emergencyContactMobile.trim() || '');
  //     formData.append('password', submittedForm.password.trim());

  //     if (photoFile) formData.append('photo', photoFile);

  //     await api.staff.create(formData);

  //     toast.success('Staff member added successfully!');

  //     // Reset form after successful addition (as requested)
  //     handleReset();

  //     setTimeout(() => {
  //       navigate('/school/staff');
  //     }, 1500);

  //   } catch (err) {
  //     console.error('AddStaff submit error:', err);
  //     handleApiError(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Auto-generate password if empty
  let submittedForm = form;
  if (!form.password.trim()) {
    const autoPassword = generatePassword();
    submittedForm = { ...form, password: autoPassword };
    setForm(submittedForm);
    setWasPasswordAutoGenerated(true);
    navigator.clipboard?.writeText(autoPassword).catch(() => {});
    toast.info(`No password entered — auto-generated: ${autoPassword} (copied to clipboard)`);
  }

  const errors = validateForm(submittedForm);
  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    const firstError = Object.values(errors)[0];
    toast.error(firstError);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  setFieldErrors({});
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append('fullName', submittedForm.fullName.trim());
    formData.append('role', submittedForm.role);
    formData.append('employmentType', submittedForm.employmentType);
    formData.append('mobile', submittedForm.mobile.trim());
    formData.append('email', submittedForm.email.trim() || '');
    formData.append('gender', submittedForm.gender || '');
    formData.append('dateOfBirth', submittedForm.dob || '');     // map dob → dateOfBirth if needed
    formData.append('joiningDate', submittedForm.joiningDate);
    formData.append('status', submittedForm.status);
    formData.append('salary', submittedForm.salary || 0);
    formData.append('fullAddress', submittedForm.fullAddress.trim() || '');
    formData.append('emergencyContactName', submittedForm.emergencyContactName.trim() || '');
    formData.append('emergencyContactRelation', submittedForm.emergencyContactRelation.trim() || '');
    formData.append('emergencyContactMobile', submittedForm.emergencyContactMobile.trim() || '');
    formData.append('password', submittedForm.password.trim());

    // Optional: send loginId if you want to use it
    if (submittedForm.loginId) {
      formData.append('loginId', submittedForm.loginId.trim());
    }

    if (photoFile) {
      formData.append('photo', photoFile);        // Important: backend expects 'photo'
    }

    await api.staff.create(formData);

    toast.success('School staff member added successfully!');

    handleReset();

    setTimeout(() => {
      navigate('/school/staff');
    }, 1500);

  } catch (err) {
    console.error('AddStaff submit error:', err);
    handleApiError(err);
  } finally {
    setLoading(false);
  }
};

  /**
   * Central API error handler — covers all server error types.
   */
  const handleApiError = (err) => {
    if (!err.response) {
      toast.error('Cannot reach the server. Please check your internet connection.');
      return;
    }

    const { status, data } = err.response;

    switch (status) {
      case 400:
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          data.errors.forEach((msg) => toast.error(msg));
        } else {
          toast.error(data.message || 'Invalid data. Please check your inputs.');
        }
        break;

      case 409:
        toast.error(data.message || 'A staff member with this mobile or Login ID already exists.');
        setFieldErrors(prev => ({
          ...prev,
          mobile: 'This mobile number is already registered.'
        }));
        break;

      case 413:
        toast.error('The photo file is too large for the server. Please use an image smaller than 2MB.');
        break;

      case 422:
        toast.error(data.message || 'The form data could not be processed. Please check your inputs.');
        break;

      case 500:
        toast.error('Server error. Please try again in a moment. If it persists, contact support.');
        break;

      case 503:
        toast.error('Server is temporarily unavailable. Please try again later.');
        break;

      default:
        toast.error(data?.message || `Unexpected error (${status}). Please try again.`);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setPhotoPreview(null);
    setPhotoFile(null);
    setFieldErrors({});
    setWasPasswordAutoGenerated(false);
    if (fileRef.current) fileRef.current.value = '';
    toast.info('Form has been reset.');
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const errorCount = Object.values(fieldErrors).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-sm font-semibold text-gray-500 mb-5">
        Staff &gt; <span className="text-gray-800">Add Staff</span>
      </h1>

      {errorCount > 0 && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="font-semibold">Please fix {errorCount} error{errorCount > 1 ? 's' : ''} before submitting:</p>
            <ul className="mt-1 list-disc list-inside space-y-0.5">
              {Object.values(fieldErrors).filter(Boolean).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">

          {/* Photo Upload */}
          <div className="flex items-center gap-5">
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#000359] transition-colors group shrink-0 overflow-hidden bg-gray-50"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-[#000359] transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
              {photoPreview && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
                  </svg>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <div>
              <p className="text-sm font-semibold text-gray-700">Profile Photo</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, or WebP · Max {MAX_PHOTO_SIZE_MB}MB · Optional</p>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setPhotoFile(null);
                    if (fileRef.current) fileRef.current.value = '';
                  }}
                  className="mt-1 text-xs text-red-500 hover:text-red-600"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          <SectionDivider title="Basic Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField
              label="Full Name" name="fullName" value={form.fullName}
              onChange={handleChange} required placeholder="e.g. Suresh Patil"
              error={fieldErrors.fullName}
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Role<span className="text-red-500 ml-0.5">*</span>
              </label>
              <Select
                options={roleOptions}
                value={roleOptions.find(r => r.value === form.role) || null}
                onChange={handleRoleChange}
                isLoading={loadingOptions}
                placeholder={loadingOptions ? 'Loading...' : 'Select Role'}
                className="text-sm"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: fieldErrors.role ? '#f87171' : base.borderColor,
                    backgroundColor: fieldErrors.role ? '#fef2f2' : base.backgroundColor,
                  }),
                }}
              />
              {fieldErrors.role && (
                <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.role}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Gender<span className="text-red-500 ml-0.5">*</span>
              </label>
              <select
                name="gender" value={form.gender} onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800
                  focus:outline-none focus:ring-2 bg-white transition-all appearance-none
                  ${fieldErrors.gender ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'}`}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {fieldErrors.gender && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.gender}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField
              label="Date of Birth" name="dob" value={form.dob}
              onChange={handleChange} type="date"
              max={getTodayString()}
              error={fieldErrors.dob}
            />

            <InputField
              label="Joining Date" name="joiningDate" value={form.joiningDate}
              onChange={handleChange} type="date" required
              error={fieldErrors.joiningDate}
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Employment Type<span className="text-red-500 ml-0.5">*</span>
              </label>
              <Select
                options={employmentTypeOptions}
                value={employmentTypeOptions.find(et => et.value === form.employmentType) || null}
                onChange={handleEmploymentTypeChange}
                isLoading={loadingOptions}
                placeholder={loadingOptions ? 'Loading...' : 'Select Employment Type'}
                className="text-sm"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: fieldErrors.employmentType ? '#f87171' : base.borderColor,
                    backgroundColor: fieldErrors.employmentType ? '#fef2f2' : base.backgroundColor,
                  }),
                }}
              />
              {fieldErrors.employmentType && (
                <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.employmentType}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
              <select
                name="status" value={form.status} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all appearance-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <InputField
              label="Salary (₹)" name="salary" value={form.salary}
              onChange={handleChange} type="number" placeholder="e.g. 18000"
              error={fieldErrors.salary}
            />
          </div>

          <SectionDivider title="Login Credentials" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField
              label="Mobile Number" name="mobile" value={form.mobile}
              onChange={handleChange} type="tel" required
              placeholder="10-digit number"
              inputMode="numeric"
              maxLength={10}
              error={fieldErrors.mobile}
            />
            <InputField
              label="Email ID" name="email" value={form.email}
              onChange={handleChange} type="email" placeholder="staff@school.com"
              error={fieldErrors.email}
            />

            {/* ── Password field with Generate button ── */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password<span className="text-red-500 ml-0.5">*</span>
                <span className="ml-1 font-normal normal-case text-gray-400">(auto-generated if blank)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`flex-1 min-w-0 border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
                    focus:outline-none focus:ring-2 bg-white transition-all font-mono tracking-wider
                    ${fieldErrors.password
                      ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400'
                      : wasPasswordAutoGenerated
                        ? 'border-green-400 bg-green-50 focus:ring-green-200 focus:border-green-400'
                        : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'
                    }`}
                />
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  title="Generate a random password"
                  className="shrink-0 px-2.5 py-2 text-xs font-semibold text-[#000359] border border-[#000359]/30 rounded-lg bg-[#000359]/5 hover:bg-[#000359]/10 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  {/* Refresh / dice icon */}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate
                </button>
              </div>
              {wasPasswordAutoGenerated && !fieldErrors.password && (
                <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Password auto-generated &amp; copied to clipboard. Share it with the staff member.
                </p>
              )}
              {fieldErrors.password && (
                <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldErrors.password}
                </p>
              )}
            </div>
          </div>

          <SectionDivider title="Address" />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Full Address</label>
            <textarea
              name="fullAddress"
              value={form.fullAddress}
              onChange={handleChange}
              rows={3}
              placeholder="Street, City, State, PIN"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] resize-none transition-all"
            />
          </div>

          <SectionDivider title="Emergency Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Contact Name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} placeholder="e.g. Ramesh Patil" />
            <InputField label="Relation" name="emergencyContactRelation" value={form.emergencyContactRelation} onChange={handleChange} placeholder="e.g. Brother" />
            <InputField
              label="Contact Mobile" name="emergencyContactMobile" value={form.emergencyContactMobile}
              onChange={handleChange} type="tel" placeholder="10-digit mobile"
              inputMode="numeric"
              maxLength={10}
              error={fieldErrors.emergencyContactMobile}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Adding Staff...' : 'Add Staff'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}