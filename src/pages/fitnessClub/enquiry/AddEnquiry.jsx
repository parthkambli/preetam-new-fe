// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../../../services/apiClient';

// export default function AddFitnessEnquiry() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [form, setForm] = useState({
//     fullName: '',
//     age: '',
//     gender: '',
//     mobile: '',
//     interestedActivity: '',
//     source: 'Walk-in',
//     enquiryDate: new Date().toISOString().split('T')[0],
//     notes: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       await api.fitnessEnquiry.create(form);
//       alert('Enquiry saved successfully!');
//       navigate('/fitness/enquiry');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save enquiry');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Add Enquiry</h1>
//         <button
//           onClick={() => navigate('/fitness/enquiry')}
//           className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//         >
//           Back
//         </button>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8">
//         <div className="border border-blue-200 rounded-lg p-6 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
//               <input
//                 name="fullName"
//                 value={form.fullName}
//                 onChange={handleChange}
//                 placeholder="Enter full name"
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
//               <input
//                 type="number"
//                 name="age"
//                 value={form.age}
//                 onChange={handleChange}
//                 placeholder="Age"
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
//               <select
//                 name="gender"
//                 value={form.gender}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 required
//               >
//                 <option value="">Select</option>
//                 <option>Male</option>
//                 <option>Female</option>
//                 <option>Other</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
//               <input
//                 type="tel"
//                 name="mobile"
//                 value={form.mobile}
//                 onChange={handleChange}
//                 placeholder="10-digit mobile"
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Interested Activity</label>
//               <input
//                 name="interestedActivity"
//                 value={form.interestedActivity}
//                 onChange={handleChange}
//                 placeholder="Eg: Football"
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Source</label>
//               <select
//                 name="source"
//                 value={form.source}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//               >
//                 <option>Walk-in</option>
//                 <option>App</option>
//                 <option>Call</option>
//                 <option>Website</option>
//                 <option>Reference</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Enquiry Date</label>
//               <input
//                 type="date"
//                 name="enquiryDate"
//                 value={form.enquiryDate}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
//             <textarea
//               name="notes"
//               value={form.notes}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Any remarks or follow-up notes"
//               className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-4 mt-8">
//           <button
//             type="button"
//             onClick={() => navigate('/fitness/enquiry')}
//             className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-10 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center"
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
//               'Save Enquiry'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../../../services/apiClient';

// export default function AddFitnessEnquiry() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [staffList, setStaffList] = useState([]);
//   const [staffLoading, setStaffLoading] = useState(true);

//   const [form, setForm] = useState({
//     fullName: '',
//     age: '',
//     gender: '',
//     mobile: '',
//     interestedActivity: '',
//     source: 'Walk-in',
//     enquiryDate: new Date().toISOString().split('T')[0],
//     notes: '',
//     responsibleStaff: '',
//   });

//   // Fetch Fitness Staff Members - Show Only Names
//   useEffect(() => {
//     const fetchStaff = async () => {
//       setStaffLoading(true);
//       setError('');

//       try {
//         const res = await api.fitnessStaff.getAll({ limit: 200 });

//         // Handle backend response structure
//         let staffData = 
//           res?.data?.data?.staff || 
//           res?.data?.staff || 
//           res?.data?.data || 
//           res?.data || [];

//         if (!Array.isArray(staffData)) {
//           staffData = [];
//         }

//         setStaffList(staffData);
//       } catch (err) {
//         console.error("Failed to load staff:", err);
//         setStaffList([]);
//         setError("Could not load staff members.");
//       } finally {
//         setStaffLoading(false);
//       }
//     };

//     fetchStaff();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!form.responsibleStaff) {
//       setError('Please select a Responsible Staff');
//       setLoading(false);
//       return;
//     }

//     try {
//       await api.fitnessEnquiry.create(form);
//       alert('Enquiry saved successfully!');
//       navigate('/fitness/enquiry');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save enquiry');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Add Enquiry</h1>
//         <button
//           onClick={() => navigate('/fitness/enquiry')}
//           className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//         >
//           Back
//         </button>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8">
//         <div className="border border-blue-200 rounded-lg p-6 space-y-6">

//           {/* Row 1: Full Name, Age, Gender */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
//               <input
//                 name="fullName"
//                 value={form.fullName}
//                 onChange={handleChange}
//                 placeholder="Enter full name"
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
//               <input
//                 type="number"
//                 name="age"
//                 value={form.age}
//                 onChange={handleChange}
//                 placeholder="Age"
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
//               <select
//                 name="gender"
//                 value={form.gender}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 required
//               >
//                 <option value="">Select</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//           </div>

//           {/* Row 2: Mobile, Interested Activity, Responsible Staff */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
//               <input
//                 type="tel"
//                 name="mobile"
//                 value={form.mobile}
//                 onChange={handleChange}
//                 placeholder="10-digit mobile"
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Interested Activity</label>
//               <input
//                 name="interestedActivity"
//                 value={form.interestedActivity}
//                 onChange={handleChange}
//                 placeholder="Eg: Football"
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 required
//               />
//             </div>

//             {/* Responsible Staff Dropdown - ONLY NAMES */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Responsible Staff <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="responsibleStaff"
//                 value={form.responsibleStaff}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//                 disabled={staffLoading}
//                 required
//               >
//                 <option value="">Select Staff</option>

//                 {staffList.length === 0 && !staffLoading && (
//                   <option disabled>No staff found. Please add staff first.</option>
//                 )}

//                 {staffList.map((staff) => (
//                   <option key={staff._id} value={staff._id}>
//                     {staff.fullName || 'Unnamed Staff'}
//                   </option>
//                 ))}
//               </select>

//               {staffLoading && <p className="text-xs text-gray-500 mt-1">Loading staff members...</p>}
//             </div>
//           </div>

//           {/* Row 3: Source & Enquiry Date */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Source</label>
//               <select
//                 name="source"
//                 value={form.source}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//               >
//                 <option value="Walk-in">Walk-in</option>
//                 <option value="App">App</option>
//                 <option value="Call">Call</option>
//                 <option value="Website">Website</option>
//                 <option value="Reference">Reference</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Enquiry Date</label>
//               <input
//                 type="date"
//                 name="enquiryDate"
//                 value={form.enquiryDate}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//               />
//             </div>
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
//             <textarea
//               name="notes"
//               value={form.notes}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Any remarks or follow-up notes"
//               className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#000359]"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-4 mt-8">
//           <button
//             type="button"
//             onClick={() => navigate('/fitness/enquiry')}
//             className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-10 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
//           >
//             {loading ? 'Saving...' : 'Save Enquiry'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { api } from '../../../services/apiClient';

export default function AddFitnessEnquiry() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);

  const [activityList, setActivityList] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobile: '',
    interestedActivity: '',
    source: 'Walk-in',
    enquiryDate: new Date().toISOString().split('T')[0],
    notes: '',
    responsibleStaff: '',
  });

  useEffect(() => {
    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const res = await api.fitnessStaff.getAll({ limit: 200 });

        let staffData =
          res?.data?.data?.staff ||
          res?.data?.staff ||
          res?.data?.data ||
          res?.data ||
          [];

        if (!Array.isArray(staffData)) staffData = [];

        setStaffList(staffData);
      } catch (err) {
        console.error('Failed to load staff:', err);
        setStaffList([]);
        setError('Could not load staff members.');
      } finally {
        setStaffLoading(false);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      setActivityLoading(true);
      try {
        const res = await api.fitnessActivities.getAll();

        let activityData =
          res?.data?.data ||
          res?.data?.activities ||
          res?.data ||
          [];

        if (!Array.isArray(activityData)) activityData = [];

        setActivityList(activityData);
      } catch (err) {
        console.error('Failed to load activities:', err);
        setActivityList([]);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.responsibleStaff) {
      setError('Please select a Responsible Staff');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        age: form.age !== '' ? Number(form.age) : '',
        interestedActivity: form.interestedActivity || null,
        responsibleStaff: form.responsibleStaff || null,
      };

      await api.fitnessEnquiry.create(payload);
      alert('Enquiry saved successfully!');
      navigate('/fitness/enquiry');
    } catch (err) {
      console.error('SAVE ENQUIRY ERROR:', err?.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to save enquiry');
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const activityOptions = activityList.map((a) => ({
    label: a.name || a.activityName || a.title || 'Unnamed',
    value: a._id,
  }));

  const staffOptions = staffList.map((s) => ({
    label: s.fullName || s.name || 'Unnamed',
    value: s._id,
  }));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add Enquiry</h1>
        <button
          onClick={() => navigate('/fitness/enquiry')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8">
        <div className="border border-blue-200 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Gender</label>
              <Select
                options={genderOptions}
                value={genderOptions.find((opt) => opt.value === form.gender) || null}
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    gender: selected?.value || '',
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Mobile</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Interested Activity</label>
              <Select
                isLoading={activityLoading}
                options={activityOptions}
                value={
                  form.interestedActivity
                    ? activityOptions.find((opt) => opt.value === form.interestedActivity) || null
                    : null
                }
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    interestedActivity: selected?.value || '',
                  }))
                }
                placeholder="Select Activity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Responsible Staff *
              </label>
              <Select
                isLoading={staffLoading}
                options={staffOptions}
                value={
                  form.responsibleStaff
                    ? staffOptions.find((opt) => opt.value === form.responsibleStaff) || null
                    : null
                }
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    responsibleStaff: selected?.value || '',
                  }))
                }
                placeholder="Select Staff"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Source</label>
              <Select
                options={[
                  { label: 'Walk-in', value: 'Walk-in' },
                  { label: 'App', value: 'App' },
                  { label: 'Call', value: 'Call' },
                  { label: 'Website', value: 'Website' },
                  { label: 'Reference', value: 'Reference' },
                ]}
                value={{ label: form.source, value: form.source }}
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    source: selected?.value || 'Walk-in',
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Enquiry Date</label>
              <input
                type="date"
                name="enquiryDate"
                value={form.enquiryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/fitness/enquiry')}
            className="px-8 py-3 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-[#000359] text-white rounded-lg"
          >
            {loading ? 'Saving...' : 'Save Enquiry'}
          </button>
        </div>
      </form>
    </div>
  );
}