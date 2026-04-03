// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { api } from '../../../services/apiClient';

// export default function EditAdmission() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [fetching, setFetching] = useState(true);
//   const [formData, setFormData] = useState(null);

//   useEffect(() => {
//     fetchAdmission();
//   }, [id]);

//   const fetchAdmission = async () => {
//     setFetching(true);
//     setError('');
//     try {
//       const response = await api.schoolAdmission.getById(id);
//       const data = response.data;
      
//       // Convert dates to YYYY-MM-DD format for input fields
//       const formatDate = (dateStr) => {
//         if (!dateStr) return '';
//         const date = new Date(dateStr);
//         return date.toISOString().split('T')[0];
//       };

//       setFormData({
//         ...data,
//         dob: formatDate(data.dob),
//         declarationDate: formatDate(data.declarationDate),
//         registrationDate: formatDate(data.registrationDate),
//         paymentDate: formatDate(data.paymentDate),
//         nextDueDate: formatDate(data.nextDueDate)
//       });
//     } catch (err) {
//       setError('Failed to load admission details');
//       console.error(err);
//     } finally {
//       setFetching(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleArrayChange = (e, field, index) => {
//     const newArr = [...formData[field]];
//     newArr[index] = e.target.value;
//     setFormData((prev) => ({ ...prev, [field]: newArr }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const submissionData = { ...formData };
//       // Convert dates back to ISO format
//       if (submissionData.dob) submissionData.dob = new Date(submissionData.dob).toISOString();
//       if (submissionData.declarationDate) submissionData.declarationDate = new Date(submissionData.declarationDate).toISOString();
//       if (submissionData.registrationDate) submissionData.registrationDate = new Date(submissionData.registrationDate).toISOString();
//       if (submissionData.paymentDate) submissionData.paymentDate = new Date(submissionData.paymentDate).toISOString();
//       if (submissionData.nextDueDate) submissionData.nextDueDate = new Date(submissionData.nextDueDate).toISOString();

//       await api.schoolAdmission.update(id, submissionData);
//       alert('Changes saved successfully!');
//       navigate('/school/admission');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save changes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) {
//     return (
//       <div className="max-w-5xl mx-auto space-y-10 pb-12">
//         <div className="text-center text-gray-500 py-12">Loading...</div>
//       </div>
//     );
//   }

//   if (error && !formData) {
//     return (
//       <div className="max-w-5xl mx-auto space-y-10 pb-12">
//         <div className="text-center text-red-500 py-12">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto space-y-10 pb-12">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Edit Admission – {formData?.admissionId}
//         </h1>
//         <button
//           onClick={() => navigate('/school/admission')}
//           className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//           disabled={loading}
//         >
//           Cancel & Back
//         </button>
//       </div>

//       {error && (
//         <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg divide-y divide-gray-200">

//         {/* Section 1: Personal & Health */}
//         <section className="p-8">
//           <h2 className="text-xl font-semibold mb-6 text-gray-800">Personal & Health Information</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
//               <input
//                 name="fullName"
//                 value={formData?.fullName || ''}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
//               <input
//                 type="number"
//                 name="age"
//                 value={formData?.age || ''}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
//               <select
//                 name="gender"
//                 value={formData?.gender || ''}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//               >
//                 <option>Male</option>
//                 <option>Female</option>
//                 <option>Other</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
//               <input
//                 type="date"
//                 name="dob"
//                 value={formData?.dob || ''}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Aadhaar Number</label>
//               <input
//                 name="aadhaar"
//                 value={formData?.aadhaar || ''}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
//               <input
//                 type="tel"
//                 name="mobile"
//                 value={formData?.mobile || ''}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
//               <textarea
//                 name="fullAddress"
//                 value={formData?.fullAddress || ''}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Physical Disability</label>
//               <select
//                 name="physicalDisability"
//                 value={formData?.physicalDisability || 'No'}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//               >
//                 <option>No</option>
//                 <option>Yes</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Illness</label>
//               <input
//                 name="mainIllness"
//                 value={formData?.mainIllness || ''}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
//               <input
//                 name="bloodGroup"
//                 value={formData?.bloodGroup || ''}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Name</label>
//               <input name="doctorName" value={formData?.doctorName || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Village</label>
//               <input name="doctorVillage" value={formData?.doctorVillage || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Mobile</label>
//               <input name="doctorMobile" value={formData?.doctorMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//           </div>
//         </section>

//         {/* Section 2: Education, Routine, Behaviour */}
//         <section className="p-8">
//           <h2 className="text-xl font-semibold mb-6 text-gray-800">Education, Daily Routine & Interests</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Education</label>
//               <input name="education" value={formData?.education || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Education Place</label>
//               <input name="educationPlace" value={formData?.educationPlace || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Service</label>
//               <input name="yearsOfService" value={formData?.yearsOfService || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation Type</label>
//               <select name="occupationType" value={formData?.occupationType || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
//                 <option>Government</option>
//                 <option>Private</option>
//                 <option>Retired</option>
//                 <option>Self Employed</option>
//               </select>
//             </div>

//             <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1.5 font-semibold">Daily Routine Times</label>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
//                 <div>
//                   <label className="block text-xs text-gray-600">Wake-up</label>
//                   <input type="time" name="wakeUpTime" value={formData?.wakeUpTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-gray-600">Breakfast</label>
//                   <input type="time" name="breakfastTime" value={formData?.breakfastTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-gray-600">Lunch</label>
//                   <input type="time" name="lunchTime" value={formData?.lunchTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
//                 </div>
//                 <div>
//                   <label className="block text-xs text-gray-600">Dinner</label>
//                   <input type="time" name="dinnerTime" value={formData?.dinnerTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
//                 </div>
//               </div>
//             </div>

//             <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Behaviour / Nature</label>
//               <div className="flex flex-wrap gap-6">
//                 {['Calm', 'Angry', 'Moderate', 'Strict'].map((opt) => (
//                   <label key={opt} className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="behaviour"
//                       value={opt}
//                       checked={formData?.behaviour === opt}
//                       onChange={handleChange}
//                       className="h-4 w-4 text-[#000359]"
//                     />
//                     <span>{opt}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Hobbies</label>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 {[0, 1, 2].map((i) => (
//                   <input
//                     key={i}
//                     value={formData?.hobbies?.[i] || ''}
//                     onChange={(e) => handleArrayChange(e, 'hobbies', i)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//                     placeholder={`Hobby ${i + 1}`}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Games</label>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 {[0, 1, 2].map((i) => (
//                   <input
//                     key={i}
//                     value={formData?.games?.[i] || ''}
//                     onChange={(e) => handleArrayChange(e, 'games', i)}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
//                     placeholder={`Game ${i + 1}`}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Section 3: Emergency & Declaration */}
//         <section className="p-8">
//           <h2 className="text-xl font-semibold mb-6 text-gray-800">Emergency Contact & Declaration</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Person Name</label>
//               <input name="emergencyContactName" value={formData?.emergencyContactName || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Relationship</label>
//               <input name="relationship" value={formData?.relationship || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
//               <input name="emergencyMobile" value={formData?.emergencyMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Village / City</label>
//               <input name="villageCity" value={formData?.villageCity || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Alternate Contact</label>
//               <input name="alternateContact" value={formData?.alternateContact || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//           </div>

//           <div className="mt-10">
//             <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">Participant Declaration</label>
//             <p className="text-gray-600 italic mb-4">
//               I hereby declare that the information provided above is true and I agree to follow all rules and regulations of the institute.
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
//                 <input type="date" name="declarationDate" value={formData?.declarationDate || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Place</label>
//                 <input name="declarationPlace" value={formData?.declarationPlace || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Section 4: Admission & Payment */}
//         <section className="p-8">
//           <h2 className="text-xl font-semibold mb-6 text-gray-800">Admission & Payment Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Admission ID (Read-only)</label>
//               <input
//                 name="admissionId"
//                 value={formData?.admissionId || ''}
//                 readOnly
//                 className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg cursor-not-allowed"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Login Mobile</label>
//               <input name="loginMobile" value={formData?.loginMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Caregiver / Staff</label>
//               <input name="assignedCaregiver" value={formData?.assignedCaregiver || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Plan</label>
//               <select name="feePlan" value={formData?.feePlan || 'Monthly'} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
//                 <option>Daily</option>
//                 <option>Monthly</option>
//                 <option>Quarterly</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (₹)</label>
//               <input
//                 type="number"
//                 name="amount"
//                 value={formData?.amount || ''}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
//               <select name="paymentStatus" value={formData?.paymentStatus || 'Pending'} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
//                 <option>Paid</option>
//                 <option>Pending</option>
//                 <option>Partial</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Mode</label>
//               <select name="paymentMode" value={formData?.paymentMode || 'Cash'} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
//                 <option>Cash</option>
//                 <option>UPI</option>
//                 <option>Bank Transfer</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Next Due Date</label>
//               <input type="date" name="nextDueDate" value={formData?.nextDueDate || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
//             </div>
//             <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Remarks</label>
//               <textarea
//                 name="feeRemarks"
//                 value={formData?.feeRemarks || ''}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Action Buttons */}
//         <div className="p-8 flex justify-end gap-4 border-t">
//           <button
//             type="button"
//             onClick={() => navigate('/school/admission')}
//             className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-10 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900 transition disabled:opacity-50 flex items-center"
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Saving...
//               </>
//             ) : (
//               'Save Changes'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/apiClient';

export default function EditAdmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchAdmission();
  }, [id]);

  const fetchAdmission = async () => {
    setFetching(true);
    setError('');
    try {
      const response = await api.schoolAdmission.getById(id);
      const data = response.data;

      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        ...data,
        dob: formatDate(data.dob),
        declarationDate: formatDate(data.declarationDate),
        registrationDate: formatDate(data.registrationDate),
        paymentDate: formatDate(data.paymentDate),
        nextDueDate: formatDate(data.nextDueDate)
      });
    } catch (err) {
      setError('Failed to load admission details');
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field, index) => {
    const newArr = [...formData[field]];
    newArr[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newArr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submissionData = { ...formData };

      if (submissionData.dob) submissionData.dob = new Date(submissionData.dob).toISOString();
      if (submissionData.declarationDate) submissionData.declarationDate = new Date(submissionData.declarationDate).toISOString();
      if (submissionData.registrationDate) submissionData.registrationDate = new Date(submissionData.registrationDate).toISOString();
      if (submissionData.paymentDate) submissionData.paymentDate = new Date(submissionData.paymentDate).toISOString();
      if (submissionData.nextDueDate) submissionData.nextDueDate = new Date(submissionData.nextDueDate).toISOString();

      await api.schoolAdmission.update(id, submissionData);
      alert('Changes saved successfully!');
      navigate('/school/admission');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 pb-12">
        <div className="text-center text-gray-500 py-12">Loading...</div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 pb-12">
        <div className="text-center text-red-500 py-12">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Admission – {formData?.admissionId}
        </h1>
        <button
          onClick={() => navigate('/school/admission')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          disabled={loading}
        >
          Cancel & Back
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg divide-y divide-gray-200">

        {/* Section 1: Personal & Health */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Personal & Health Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                name="fullName"
                value={formData?.fullName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
              <input
                type="number"
                name="age"
                value={formData?.age || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select
                name="gender"
                value={formData?.gender || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData?.dob || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Aadhaar Number</label>
              <input
                name="aadhaar"
                value={formData?.aadhaar || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData?.mobile || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
              <textarea
                name="fullAddress"
                value={formData?.fullAddress || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Physical Disability</label>
              <select
                name="physicalDisability"
                value={formData?.physicalDisability || 'No'}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Illness</label>
              <input
                name="mainIllness"
                value={formData?.mainIllness || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
              <input
                name="bloodGroup"
                value={formData?.bloodGroup || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Name</label>
              <input name="doctorName" value={formData?.doctorName || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Village</label>
              <input name="doctorVillage" value={formData?.doctorVillage || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor Mobile</label>
              <input name="doctorMobile" value={formData?.doctorMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
          </div>
        </section>

        {/* Section 2: Education, Routine, Behaviour */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Education, Daily Routine & Interests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Education</label>
              <input name="education" value={formData?.education || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Education Place</label>
              <input name="educationPlace" value={formData?.educationPlace || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Service</label>
              <input name="yearsOfService" value={formData?.yearsOfService || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation Type</label>
              <select name="occupationType" value={formData?.occupationType || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
                <option>Government</option>
                <option>Private</option>
                <option>Retired</option>
                <option>Self Employed</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 font-semibold">Daily Routine Times</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div>
                  <label className="block text-xs text-gray-600">Wake-up</label>
                  <input type="time" name="wakeUpTime" value={formData?.wakeUpTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Breakfast</label>
                  <input type="time" name="breakfastTime" value={formData?.breakfastTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Lunch</label>
                  <input type="time" name="lunchTime" value={formData?.lunchTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Dinner</label>
                  <input type="time" name="dinnerTime" value={formData?.dinnerTime || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Behaviour / Nature</label>
              <div className="flex flex-wrap gap-6">
                {['Calm', 'Angry', 'Moderate', 'Strict'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="behaviour"
                      value={opt}
                      checked={formData?.behaviour === opt}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#000359]"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hobbies</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    value={formData?.hobbies?.[i] || ''}
                    onChange={(e) => handleArrayChange(e, 'hobbies', i)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
                    placeholder={`Hobby ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Games</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    value={formData?.games?.[i] || ''}
                    onChange={(e) => handleArrayChange(e, 'games', i)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000359]"
                    placeholder={`Game ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Section 3: Emergency Contact & Declaration (UPDATED ONLY THIS) */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Emergency Contact Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Name</label>
              <input name="primaryContactName" value={formData?.primaryContactName || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Relation</label>
              <input name="primaryRelation" value={formData?.primaryRelation || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
              <input name="primaryPhone" value={formData?.primaryPhone || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Contact Name</label>
              <input name="secondaryContactName" value={formData?.secondaryContactName || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Relation</label>
              <input name="secondaryRelation" value={formData?.secondaryRelation || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
              <input name="secondaryPhone" value={formData?.secondaryPhone || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village / City</label>
              <input name="villageCity" value={formData?.villageCity || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact</label>
              <input name="alternateContact" value={formData?.alternateContact || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" />
            </div> */}
          </div>

          {/* Declaration (UNCHANGED) */}
          <div className="mt-10">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">Participant Declaration</label>
            <p className="text-gray-600 italic mb-4">
              I hereby declare that the information provided above is true and I agree to follow all rules and regulations of the institute.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                <input type="date" name="declarationDate" value={formData?.declarationDate || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Place</label>
                <input name="declarationPlace" value={formData?.declarationPlace || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
              </div>
            </div>
          </div>
        </section>

                {/* Section 4: Admission & Payment */}
        <section className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Admission & Payment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admission ID (Read-only)</label>
              <input
                name="admissionId"
                value={formData?.admissionId || ''}
                readOnly
                className="w-full px-4 py-2.5 border bg-gray-100 rounded-lg cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Login Mobile</label>
              <input name="loginMobile" value={formData?.loginMobile || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Caregiver / Staff</label>
              <input name="assignedCaregiver" value={formData?.assignedCaregiver || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Plan</label>
              <select name="feePlan" value={formData?.feePlan || 'Monthly'} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
                <option>Daily</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData?.amount || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
              <select name="paymentStatus" value={formData?.paymentStatus || 'Pending'} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
                <option>Paid</option>
                <option>Pending</option>
                <option>Partial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Mode</label>
              <select name="paymentMode" value={formData?.paymentMode || 'Cash'} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]">
                <option>Cash</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Next Due Date</label>
              <input type="date" name="nextDueDate" value={formData?.nextDueDate || ''} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]" />
            </div>
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fee Remarks</label>
              <textarea
                name="feeRemarks"
                value={formData?.feeRemarks || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#000359]"
              />
            </div>
          </div>
        </section>

        <div className="p-8 flex justify-end gap-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/school/admission')}
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900 transition disabled:opacity-50 flex items-center"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}