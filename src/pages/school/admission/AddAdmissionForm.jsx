// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../../../services/apiClient';
// import Select from 'react-select';

// // Helper functions for auto-generation
// const generateAdmissionId = () => {
//   const date = new Date();
//   const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
//   const randomNum = Math.floor(100 + Math.random() * 900);
//   return `PSC${dateStr}-${randomNum}`;
// };

// const generatePassword = (mobile) => {
//   // Generate password: last 4 digits of mobile + random 4 digits
//   const last4 = mobile.slice(-4) || '0000';
//   const random4 = Math.floor(1000 + Math.random() * 9000).toString();
//   return `${last4}${random4}`;
// };

// export default function AddAdmission() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
  
//   // Enquiry dropdown state
//   const [enquiryOptions, setEnquiryOptions] = useState([]);
//   const [selectedEnquiry, setSelectedEnquiry] = useState(null);
//   const [loadingEnquiries, setLoadingEnquiries] = useState(false);

//   // All form data in one object
//   const [formData, setFormData] = useState({
//     // Step 1
//     fullName: '',
//     age: '',
//     gender: 'Male',
//     dob: '',
//     aadhaar: '',
//     mobile: '',
//     fullAddress: '',
//     photo: null,
//     physicalDisability: 'No',
//     mainIllness: '',
//     bloodGroup: '',
//     doctorName: '',
//     doctorVillage: '',
//     doctorMobile: '',
//     seriousDisease: 'No',
//     regularMedication: 'No',
//     healthDetails: '',
//     medicalReports: null,
//     enquiryId: null,

//     // Step 2
//     education: '',
//     educationPlace: '',
//     yearsOfService: '',
//     servicePlace: '',
//     occupationType: 'Government',
//     wakeUpTime: '',
//     breakfastTime: '',
//     lunchTime: '',
//     dinnerTime: '',
//     behaviour: 'Calm',
//     hobbies: ['', '', ''],
//     games: ['', '', ''],

//     // Step 3
//     emergencyContactName: '',
//     relationship: '',
//     emergencyMobile: '',
//     villageCity: '',
//     alternateContact: '',
//     declarationDate: '',
//     declarationPlace: '',
//     signature: '', // could be file or text

//     // Step 4 - Auto-generated fields
//     loginMobile: '',
//     password: '',
//     role: 'Participant',
//     registrationDate: '',
//     admissionId: '',
//     assignedCaregiver: '',
//     feePlan: 'Monthly',
//     instituteType: 'School',
//     amount: '',
//     messFacility: 'No',
//     residency: 'No',
//     paymentDate: '',
//     feeDescription: '',
//     paymentStatus: 'Pending',
//     paymentMode: 'Cash',
//     nextDueDate: '',
//     feeRemarks: '',
//   });
  
//   // Load enquiries for dropdown on mount
//   useEffect(() => {
//     const loadEnquiries = async () => {
//       try {
//         setLoadingEnquiries(true);
//         const response = await api.schoolEnquiry.getForAdmission();
//         const options = response.data.map(enquiry => ({
//           value: enquiry._id,
//           label: `${enquiry.enquiryId || 'N/A'} - ${enquiry.name} (${enquiry.status})`,
//           data: enquiry
//         }));
//         setEnquiryOptions(options);
//       } catch (err) {
//         console.error('Error loading enquiries:', err);
//       } finally {
//         setLoadingEnquiries(false);
//       }
//     };
    
//     loadEnquiries();
//   }, []);

//   // Set default dates and auto-generate values on mount
//   useEffect(() => {
//     const today = new Date().toISOString().slice(0, 10);
//     setFormData(prev => ({
//       ...prev,
//       registrationDate: today,
//       paymentDate: today,
//       admissionId: generateAdmissionId(),
//     }));
//   }, []);

//   // Auto-generate password and login mobile when mobile changes
//   useEffect(() => {
//     if (formData.mobile && formData.mobile.length === 10) {
//       setFormData(prev => ({
//         ...prev,
//         loginMobile: prev.mobile,
//         password: generatePassword(prev.mobile),
//       }));
//     }
//   }, [formData.mobile]);
  
//   // Handle enquiry selection and auto-fill
//   const handleEnquirySelect = (option) => {
//     setSelectedEnquiry(option);
//     if (option) {
//       const enquiry = option.data;
//       setFormData(prev => ({
//         ...prev,
//         enquiryId: enquiry._id,
//         fullName: enquiry.name || '',
//         mobile: enquiry.contact || '',
//         age: enquiry.age || '',
//         gender: enquiry.gender || 'Male',
//         // Map activity to education or keep as notes
//       }));
//     } else {
//       // Clear enquiry-related fields when selection is cleared
//       setFormData(prev => ({
//         ...prev,
//         enquiryId: null,
//         fullName: '',
//         mobile: '',
//         age: '',
//         gender: 'Male',
//       }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, files, type } = e.target;
//     if (type === 'file') {
//       setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
//     } else if (name.startsWith('hobby') || name.startsWith('game')) {
//       const index = parseInt(name.slice(-1)) - 1;
//       const key = name.startsWith('hobby') ? 'hobbies' : 'games';
//       const newArr = [...formData[key]];
//       newArr[index] = value;
//       setFormData((prev) => ({ ...prev, [key]: newArr }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // Prepare data for API (convert date strings to proper format)
//       const submissionData = { ...formData };
      
//       // Remove enquiryId from submission if it's null
//       if (!submissionData.enquiryId) {
//         delete submissionData.enquiryId;
//       }

//       // Handle empty object for file fields (convert to empty string)
//       if (submissionData.photo && typeof submissionData.photo === 'object' && !(submissionData.photo instanceof File)) {
//         submissionData.photo = '';
//       }
//       if (submissionData.medicalReports && typeof submissionData.medicalReports === 'object' && !(submissionData.medicalReports instanceof File)) {
//         submissionData.medicalReports = '';
//       }

//       if (submissionData.dob) submissionData.dob = new Date(submissionData.dob).toISOString();
//       if (submissionData.declarationDate) submissionData.declarationDate = new Date(submissionData.declarationDate).toISOString();
//       if (submissionData.registrationDate) submissionData.registrationDate = new Date(submissionData.registrationDate).toISOString();
//       if (submissionData.paymentDate) submissionData.paymentDate = new Date(submissionData.paymentDate).toISOString();
//       if (submissionData.nextDueDate) submissionData.nextDueDate = new Date(submissionData.nextDueDate).toISOString();

//       await api.schoolAdmission.create(submissionData);
//       alert('Admission Submitted Successfully!');
//       navigate('/school/admission');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to submit admission');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
//   const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

//   return (
//     <div className="max-w-5xl mx-auto space-y-8 pb-12">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-800">Add Admission</h1>
//         <button
//           onClick={() => navigate('/school/admission')}
//           className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//           disabled={loading}
//         >
//           Back to Admissions
//         </button>
//       </div>

//       {error && (
//         <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//           {error}
//         </div>
//       )}

//       {/* Progress indicator */}
//       <div className="flex justify-between mb-6">
//         {['Personal & Health', 'Education & Routine', 'Emergency & Declaration', 'Login & Admission Details'].map((label, i) => (
//           <div key={i} className={`flex-1 text-center py-2 ${step > i+1 ? 'text-green-600' : step === i+1 ? 'font-bold text-[#000359]' : 'text-gray-400'}`}>
//             {label}
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-10">

//         {/* STEP 1 */}
//         {step === 1 && (
//           <>
//             {/* Enquiry Selection Section */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//               <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
//               <div className="max-w-md">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Choose an existing enquiry to auto-fill details
//                 </label>
//                 <Select
//                   options={enquiryOptions}
//                   onChange={handleEnquirySelect}
//                   value={selectedEnquiry}
//                   placeholder="Search and select enquiry..."
//                   isClearable
//                   isLoading={loadingEnquiries}
//                   className="react-select-container"
//                   classNamePrefix="react-select"
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderColor: '#d1d5db',
//                       '&:hover': {
//                         borderColor: '#9ca3af'
//                       }
//                     })
//                   }}
//                 />
//               </div>
//               <p className="text-sm text-gray-500 mt-2">
//                 OR fill the admission form manually below
//               </p>
//             </div>

//             <h2 className="text-xl font-semibold border-b pb-2">Personal Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                 <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" required />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
//                 <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" required />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                 <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>Male</option>
//                   <option>Female</option>
//                   <option>Other</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//                 <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
//                 <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
//                 <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" required />
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
//               <textarea name="fullAddress" value={formData.fullAddress} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-lg" />
//             </div>

//             <div className="mt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
//               <input type="file" name="photo" onChange={handleChange} accept="image/*" className="w-full px-3 py-2 border rounded-lg" />
//             </div>

//             <h2 className="text-xl font-semibold border-b pb-2 mt-10">Health Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Physical Disability</label>
//                 <select name="physicalDisability" value={formData.physicalDisability} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>No</option>
//                   <option>Yes</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Main Illness</label>
//                 <input name="mainIllness" value={formData.mainIllness} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
//                 <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="O+" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
//                 <input name="doctorName" value={formData.doctorName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Village Name</label>
//                 <input name="doctorVillage" value={formData.doctorVillage} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Mobile</label>
//                 <input name="doctorMobile" value={formData.doctorMobile} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Serious Disease</label>
//                 <select name="seriousDisease" value={formData.seriousDisease} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>No</option>
//                   <option>Yes</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Regular Medication</label>
//                 <select name="regularMedication" value={formData.regularMedication} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>No</option>
//                   <option>Yes</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Health Details</label>
//                 <input name="healthDetails" value={formData.healthDetails} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Upload Medical Reports</label>
//               <input type="file" name="medicalReports" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
//             </div>
//           </>
//         )}

//         {/* STEP 2 */}
//         {step === 2 && (
//           <>
//             <h2 className="text-xl font-semibold border-b pb-2">Education & Service</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
//                 <input name="education" value={formData.education} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Education Place</label>
//                 <input name="educationPlace" value={formData.educationPlace} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Years of Service</label>
//                 <input name="yearsOfService" value={formData.yearsOfService} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Service Place</label>
//                 <input name="servicePlace" value={formData.servicePlace} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Occupation Type</label>
//                 <select name="occupationType" value={formData.occupationType} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>Government</option>
//                   <option>Private</option>
//                   <option>Retired</option>
//                   <option>Self Employed</option>
//                 </select>
//               </div>
//             </div>

//             <h2 className="text-xl font-semibold border-b pb-2 mt-10">Daily Routine</h2>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Wake-up Time</label>
//                 <input type="time" name="wakeUpTime" value={formData.wakeUpTime} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Breakfast Time</label>
//                 <input type="time" name="breakfastTime" value={formData.breakfastTime} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Lunch Time</label>
//                 <input type="time" name="lunchTime" value={formData.lunchTime} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Dinner Time</label>
//                 <input type="time" name="dinnerTime" value={formData.dinnerTime} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//             </div>

//             <h2 className="text-xl font-semibold border-b pb-2 mt-10">Behaviour / Nature</h2>
//             <div className="flex gap-8">
//               {['Calm', 'Angry', 'Moderate', 'Strict'].map((opt) => (
//                 <label key={opt} className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="behaviour"
//                     value={opt}
//                     checked={formData.behaviour === opt}
//                     onChange={handleChange}
//                   />
//                   {opt}
//                 </label>
//               ))}
//             </div>

//             <h2 className="text-xl font-semibold border-b pb-2 mt-10">Hobbies & Games</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Hobby 1</label>
//                 <input name="hobby1" value={formData.hobbies[0]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Hobby 2</label>
//                 <input name="hobby2" value={formData.hobbies[1]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Hobby 3</label>
//                 <input name="hobby3" value={formData.hobbies[2]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Game 1</label>
//                 <input name="game1" value={formData.games[0]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Game 2</label>
//                 <input name="game2" value={formData.games[1]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Game 3</label>
//                 <input name="game3" value={formData.games[2]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//             </div>
//           </>
//         )}

//         {/* STEP 3 */}
//         {step === 3 && (
//           <>
//             <h2 className="text-xl font-semibold border-b pb-2">Emergency Contact Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
//                 <input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
//                 <input name="relationship" value={formData.relationship} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
//                 <input name="emergencyMobile" value={formData.emergencyMobile} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Village / City</label>
//                 <input name="villageCity" value={formData.villageCity} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact</label>
//                 <input name="alternateContact" value={formData.alternateContact} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//             </div>

//             <h2 className="text-xl font-semibold border-b pb-2 mt-10">Participant Declaration</h2>
//             <div className="bg-gray-50 p-5 rounded-lg">
//               <p className="text-gray-700 italic">
//                 I hereby declare that the information provided above is true and I agree to follow all rules and regulations of the institute.
//               </p>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                   <input type="date" name="declarationDate" value={formData.declarationDate} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
//                   <input name="declarationPlace" value={formData.declarationPlace} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Signature</label>
//                   <input name="signature" value={formData.signature} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="Type name or upload later" />
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* STEP 4 */}
//         {step === 4 && (
//           <>
//             <h2 className="text-xl font-semibold border-b pb-2">Login Credentials</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (Login ID)</label>
//                 <input type="tel" name="loginMobile" value={formData.loginMobile} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" required />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password (Auto)</label>
//                 <input name="password" value={formData.password} onChange={handleChange}  className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                 <input name="role" value={formData.role} readOnly className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg" />
//               </div>
//             </div>

//             <h2 className="text-xl font-semibold border-b pb-2 mt-10">Admission & System Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
//                 <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Admission ID (Auto)</label>
//                 <input name="admissionId" value={formData.admissionId} onChange={handleChange} className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Caregiver / Staff</label>
//                 <input name="assignedCaregiver" value={formData.assignedCaregiver} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Fee Plan</label>
//                 <select name="feePlan" value={formData.feePlan} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>Daily</option>
//                   <option>Weekly</option>
//                   <option>Monthly</option>
//                   <option>Annual</option>
          
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Institute Type</label>
//                 <select name="instituteType" value={formData.instituteType} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>School</option>
//                   <option>Residency</option>
//                   <option>DayCare</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
//                 <input name="amount" value={formData.amount} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="₹" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Mess Facility</label>
//                 <select name="messFacility" value={formData.messFacility} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>No</option>
//                   <option>Yes</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Residency</label>
//                 <select name="residency" value={formData.residency} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>No</option>
//                   <option>Yes</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
//                 <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Fee Description</label>
//               <input 
//                 name="feeDescription" 
//                 value={formData.feeDescription} 
//                 onChange={handleChange} 
//                 className="w-full px-4 py-2.5 border rounded-lg" 
//                 placeholder="Enter fee description"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
//                 <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>Paid</option>
//                   <option>Pending</option>
//                   <option>Partial</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
//                 <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
//                   <option>Cash</option>
//                   <option>UPI</option>
//                   <option>Bank Transfer</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
//                 <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Fee Remarks</label>
//               <textarea name="feeRemarks" value={formData.feeRemarks} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-lg" />
//             </div>

//             <div className="flex justify-between items-center mt-10 pt-6 border-t">
//               <div className="flex gap-4">
//                 <button type="button" className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
//                   Print
//                 </button>
//                 <button type="button" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                   Share
//                 </button>
//               </div>
//               <div className="flex gap-4">
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   disabled={loading}
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-10 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 flex items-center"
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Submitting...
//                     </>
//                   ) : (
//                     'Submit'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Navigation for steps 1-3 */}
//         {step < 4 && (
//           <div className="flex justify-between pt-8 border-t">
//             {step > 1 && (
//               <button
//                 type="button"
//                 onClick={prevStep}
//                 className="px-10 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 disabled={loading}
//               >
//                 Back
//               </button>
//             )}
//             <div className="flex-1" />
//             <button
//               type="button"
//               onClick={nextStep}
//               disabled={loading}
//               className="px-12 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }





// pages/school/admission/AddAdmissionForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';
import Select from 'react-select';

const generateAdmissionId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `PSC${dateStr}-${randomNum}`;
};

const generatePassword = (mobile) => {
  const last4 = mobile.slice(-4) || '0000';
  const random4 = Math.floor(1000 + Math.random() * 9000).toString();
  return `${last4}${random4}`;
};

export default function AddAdmission() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [enquiryOptions, setEnquiryOptions] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    dob: '',
    aadhaar: '',
    mobile: '',
    fullAddress: '',
    photo: null,
    physicalDisability: 'No',
    mainIllness: '',
    bloodGroup: '',
    doctorName: '',
    doctorVillage: '',
    doctorMobile: '',
    seriousDisease: 'No',
    regularMedication: 'No',
    healthDetails: '',
    medicalReports: null,
    enquiryId: null,

    // Education & Routine
    education: '',
    educationPlace: '',
    yearsOfService: '',
    servicePlace: '',
    occupationType: 'Government',
    wakeUpTime: '',
    breakfastTime: '',
    lunchTime: '',
    dinnerTime: '',
    behaviour: 'Calm',
    hobbies: ['', '', ''],
    games: ['', '', ''],

    // Emergency Contact - NEW FIELD NAMES
    primaryContactName: '',
    primaryRelation: '',
    primaryPhone: '',
    secondaryContactName: '',
    secondaryRelation: '',
    secondaryPhone: '',
    villageCity: '',
    alternateContact: '',

    // Admission Details
    loginMobile: '',
    password: '',
    role: 'Participant',
    registrationDate: '',
    admissionId: '',
    assignedCaregiver: '',
    feePlan: 'Monthly',
    instituteType: 'School',
    amount: '',
    messFacility: 'No',
    residency: 'No',
    paymentDate: '',
    feeDescription: 'Senior Citizen Happiness School (Age 55+)',
    paymentStatus: 'Pending',
    paymentMode: 'Cash',
    nextDueDate: '',
    feeRemarks: '',
  });

  // Load enquiries
  useEffect(() => {
    const loadEnquiries = async () => {
      try {
        setLoadingEnquiries(true);
        const response = await api.schoolEnquiry.getForAdmission();
        const options = response.data.map(enquiry => ({
          value: enquiry._id,
          label: `${enquiry.enquiryId || 'N/A'} - ${enquiry.name} (${enquiry.status})`,
          data: enquiry
        }));
        setEnquiryOptions(options);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEnquiries(false);
      }
    };
    loadEnquiries();
  }, []);

  // Auto-generate values
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setFormData(prev => ({
      ...prev,
      registrationDate: today,
      paymentDate: today,
      admissionId: generateAdmissionId(),
    }));
  }, []);

  useEffect(() => {
    if (formData.mobile && formData.mobile.length === 10) {
      setFormData(prev => ({
        ...prev,
        loginMobile: prev.mobile,
        password: generatePassword(prev.mobile),
      }));
    }
  }, [formData.mobile]);

  const handleEnquirySelect = (option) => {
    setSelectedEnquiry(option);
    if (option) {
      const enquiry = option.data;
      setFormData(prev => ({
        ...prev,
        enquiryId: enquiry._id,
        fullName: enquiry.name || '',
        mobile: enquiry.contact || '',
        age: enquiry.age || '',
        gender: enquiry.gender || 'Male',
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] || null }));
    } else if (name.startsWith('hobby') || name.startsWith('game')) {
      const index = parseInt(name.slice(-1)) - 1;
      const key = name.startsWith('hobby') ? 'hobbies' : 'games';
      const newArr = [...formData[key]];
      newArr[index] = value;
      setFormData(prev => ({ ...prev, [key]: newArr }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = { ...formData };

      if (!submissionData.enquiryId) delete submissionData.enquiryId;

      // Handle files
      if (submissionData.photo && typeof submissionData.photo === 'object' && !(submissionData.photo instanceof File)) submissionData.photo = '';
      if (submissionData.medicalReports && typeof submissionData.medicalReports === 'object' && !(submissionData.medicalReports instanceof File)) submissionData.medicalReports = '';

      // Convert dates
      if (submissionData.dob) submissionData.dob = new Date(submissionData.dob).toISOString();
      if (submissionData.declarationDate) submissionData.declarationDate = new Date(submissionData.declarationDate).toISOString();
      if (submissionData.registrationDate) submissionData.registrationDate = new Date(submissionData.registrationDate).toISOString();
      if (submissionData.paymentDate) submissionData.paymentDate = new Date(submissionData.paymentDate).toISOString();
      if (submissionData.nextDueDate) submissionData.nextDueDate = new Date(submissionData.nextDueDate).toISOString();

      await api.schoolAdmission.create(submissionData);
      toast.success('Admission submitted successfully!');
      navigate('/school/admission');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit admission');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add Admission</h1>
        <button onClick={() => navigate('/school/admission')} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Back to Admissions
        </button>
      </div>

      {/* Progress */}
      <div className="flex justify-between mb-6">
        {['Personal & Health', 'Education & Routine', 'Emergency Contact', 'Admission Details'].map((label, i) => (
          <div key={i} className={`flex-1 text-center py-2 ${step > i + 1 ? 'text-green-600' : step === i + 1 ? 'font-bold text-[#000359]' : 'text-gray-400'}`}>
            {label}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-10">

        {step === 1 && (
          <>
            {/* Enquiry Selection Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose an existing enquiry to auto-fill details
                </label>
                <Select
                  options={enquiryOptions}
                  onChange={handleEnquirySelect}
                  value={selectedEnquiry}
                  placeholder="Search and select enquiry..."
                  isClearable
                  isLoading={loadingEnquiries}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#9ca3af'
                      }
                    })
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                OR fill the admission form manually below
              </p>
            </div>

            <h2 className="text-xl font-semibold border-b pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" required />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <textarea name="fullAddress" value={formData.fullAddress} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
              <input type="file" name="photo" onChange={handleChange} accept="image/*" className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-10">Health Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Physical Disability</label>
                <select name="physicalDisability" value={formData.physicalDisability} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Illness</label>
                <input name="mainIllness" value={formData.mainIllness} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="O+" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                <input name="doctorName" value={formData.doctorName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Village Name</label>
                <input name="doctorVillage" value={formData.doctorVillage} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Mobile</label>
                <input name="doctorMobile" value={formData.doctorMobile} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serious Disease</label>
                <select name="seriousDisease" value={formData.seriousDisease} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regular Medication</label>
                <select name="regularMedication" value={formData.regularMedication} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Health Details</label>
                <input name="healthDetails" value={formData.healthDetails} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Medical Reports</label>
              <input type="file" name="medicalReports" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold border-b pb-2">Education & Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input name="education" value={formData.education} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Place</label>
                <input name="educationPlace" value={formData.educationPlace} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Service</label>
                <input name="yearsOfService" value={formData.yearsOfService} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Place</label>
                <input name="servicePlace" value={formData.servicePlace} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation Type</label>
                <select name="occupationType" value={formData.occupationType} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>Government</option>
                  <option>Private</option>
                  <option>Retired</option>
                  <option>Self Employed</option>
                </select>
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-10">Daily Routine</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wake-up Time</label>
                <input type="time" name="wakeUpTime" value={formData.wakeUpTime} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breakfast Time</label>
                <input type="time" name="breakfastTime" value={formData.breakfastTime} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lunch Time</label>
                <input type="time" name="lunchTime" value={formData.lunchTime} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dinner Time</label>
                <input type="time" name="dinnerTime" value={formData.dinnerTime} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-10">Behaviour / Nature</h2>
            <div className="flex gap-8">
              {['Calm', 'Angry', 'Moderate', 'Strict'].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="behaviour"
                    value={opt}
                    checked={formData.behaviour === opt}
                    onChange={handleChange}
                  />
                  {opt}
                </label>
              ))}
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-10">Hobbies & Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hobby 1</label>
                <input name="hobby1" value={formData.hobbies[0]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hobby 2</label>
                <input name="hobby2" value={formData.hobbies[1]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hobby 3</label>
                <input name="hobby3" value={formData.hobbies[2]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Game 1</label>
                <input name="game1" value={formData.games[0]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Game 2</label>
                <input name="game2" value={formData.games[1]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Game 3</label>
                <input name="game3" value={formData.games[2]} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
            </div>
          </>
        )}

        {/* UPDATED STEP 3 - Emergency Contact */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold border-b pb-2">Emergency Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Name</label>
                <input name="primaryContactName" value={formData.primaryContactName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Relation</label>
                <input name="primaryRelation" value={formData.primaryRelation} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                <input name="primaryPhone" value={formData.primaryPhone} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Contact Name</label>
                <input name="secondaryContactName" value={formData.secondaryContactName} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Relation</label>
                <input name="secondaryRelation" value={formData.secondaryRelation} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
                <input name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Village / City</label>
                <input name="villageCity" value={formData.villageCity} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact</label>
                <input name="alternateContact" value={formData.alternateContact} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-[#000359]" />
              </div> */}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold border-b pb-2">Login Credentials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (Login ID)</label>
                <input type="tel" name="loginMobile" value={formData.loginMobile} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (Auto)</label>
                <input name="password" value={formData.password} onChange={handleChange}  className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input name="role" value={formData.role} readOnly className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg" />
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-10">Admission & System Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission ID (Auto)</label>
                <input name="admissionId" value={formData.admissionId} onChange={handleChange} className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Caregiver / Staff</label>
                <input name="assignedCaregiver" value={formData.assignedCaregiver} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Plan</label>
                <select name="feePlan" value={formData.feePlan} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Annual</option>
          
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institute Type</label>
                <select name="instituteType" value={formData.instituteType} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>School</option>
                  <option>Residency</option>
                  <option>DayCare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input name="amount" value={formData.amount} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="₹" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mess Facility</label>
                <select name="messFacility" value={formData.messFacility} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Residency</label>
                <select name="residency" value={formData.residency} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fee Description</label>
              <input 
                name="feeDescription" 
                value={formData.feeDescription} 
                onChange={handleChange} 
                className="w-full px-4 py-2.5 border rounded-lg" 
                placeholder="Enter fee description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Partial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg">
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fee Remarks</label>
              <textarea name="feeRemarks" value={formData.feeRemarks} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            <div className="flex justify-between items-center mt-10 pt-6 border-t">
              <div className="flex gap-4">
                <button type="button" className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Print
                </button>
                <button type="button" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Share
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex justify-between pt-8 border-t">
            {step > 1 && <button type="button" onClick={prevStep} className="px-10 py-3 border border-gray-300 rounded-lg">Back</button>}
            <button type="button" onClick={nextStep} className="px-12 py-3 bg-[#000359] text-white rounded-lg ml-auto">Next</button>
          </div>
        )}

        {step === 4 && (
          <div className="flex justify-end gap-4 pt-8 border-t">
            <button type="button" onClick={prevStep} className="px-10 py-3 border border-gray-300 rounded-lg">Back</button>
            <button type="submit" disabled={loading} className="px-10 py-3 bg-[#000359] text-white rounded-lg">
              {loading ? 'Submitting...' : 'Submit Admission'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}