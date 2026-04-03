// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../../../services/apiClient';

// export default function AddSchoolEnquiry() {
//   const [form, setForm] = useState({
//     name: '', contact: '', age: '', gender: 'Male', activity: '', source: 'Walk-in', date: new Date().toISOString().split('T')[0]
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       await api.schoolEnquiry.create(form);
//       alert('Enquiry added successfully!');
//       navigate('/school/enquiry');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to add enquiry. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Add Enquiry</h1>

//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
//             <input
//               type="text"
//               value={form.name}
//               onChange={e => setForm({...form, name: e.target.value})}
//               className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000359]"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">Contact</label>
//             <input
//               type="tel"
//               value={form.contact}
//               onChange={e => setForm({...form, contact: e.target.value})}
//               className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000359]"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">Age</label>
//             <input
//               type="number"
//               value={form.age}
//               onChange={e => setForm({...form, age: e.target.value})}
//               className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000359]"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">Gender</label>
//             <select
//               value={form.gender}
//               onChange={e => setForm({...form, gender: e.target.value})}
//               className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000359]"
//             >
//               <option>Male</option>
//               <option>Female</option>
//               <option>Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">Interested Activity</label>
//             <input
//               type="text"
//               value={form.activity}
//               onChange={e => setForm({...form, activity: e.target.value})}
//               className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000359]"
//               placeholder="e.g. Yoga, Music, Therapy"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">Source</label>
//             <select
//               value={form.source}
//               onChange={e => setForm({...form, source: e.target.value})}
//               className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000359]"
//             >
//               <option>Walk-in</option>
//               <option>App</option>
//               <option>Call</option>
//               <option>Website</option>
//               <option>Reference</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">Enquiry Date</label>
//             <input
//               type="date"
//               value={form.date}
//               onChange={e => setForm({...form, date: e.target.value})}
//               className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000359]"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-4 pt-4">
//           <button
//             type="button"
//             onClick={() => navigate('/school/enquiry')}
//             className="px-6 py-3 border rounded-lg hover:bg-gray-100"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-8 py-3 bg-[#000359] text-white rounded-lg hover:bg-blue-900"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/apiClient';

export default function AddSchoolEnquiry() {
  const [form, setForm] = useState({
    name: '', contact: '', age: '', gender: 'Male', activity: '', source: 'Walk-in', date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.schoolEnquiry.create(form);
      alert('Enquiry added successfully!');
      navigate('/school/enquiry');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000359] bg-white";
  const rowClass = "flex items-center gap-6 py-3";
  const labelClass = "text-sm font-medium text-gray-800 w-44 shrink-0 text-left";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-8">Add Enquiry</h1>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-1">
        {/* Full Name */}
        <div className={rowClass}>
          <label className={labelClass}>Full Name:</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className={`${fieldClass} w-72`}
            required
          />
        </div>

        {/* Contact */}
        <div className={rowClass}>
          <label className={labelClass}>Contact:</label>
          <input
            type="tel"
            value={form.contact}
            onChange={e => setForm({...form, contact: e.target.value})}
            className={`${fieldClass} w-72`}
            required
          />
        </div>

        {/* Age */}
        <div className={rowClass}>
          <label className={labelClass}>Age:</label>
          <input
            type="number"
            value={form.age}
            onChange={e => setForm({...form, age: e.target.value})}
            className={`${fieldClass} w-28`}
          />
        </div>

        {/* Gender */}
        <div className={rowClass}>
          <label className={labelClass}>Gender:</label>
          <select
            value={form.gender}
            onChange={e => setForm({...form, gender: e.target.value})}
            className={`${fieldClass} w-36`}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Interested Activity */}
        <div className={rowClass}>
          <label className={labelClass}>Interested Activity:</label>
          <input
            type="text"
            value={form.activity}
            onChange={e => setForm({...form, activity: e.target.value})}
            className={`${fieldClass} w-56`}
            placeholder="e.g. Yoga, Music"
          />
        </div>

        {/* Source */}
        <div className={rowClass}>
          <label className={labelClass}>Source:</label>
          <select
            value={form.source}
            onChange={e => setForm({...form, source: e.target.value})}
            className={`${fieldClass} w-44`}
          >
            <option>Walk-in</option>
            <option>App</option>
            <option>Call</option>
            <option>Website</option>
            <option>Reference</option>
          </select>
        </div>

        {/* Enquiry Date */}
        <div className={rowClass}>
          <label className={labelClass}>Enquiry Date:</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({...form, date: e.target.value})}
            className={`${fieldClass} w-44`}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#000359] text-white px-16 py-2.5 rounded-lg text-sm font-bold hover:bg-[#00047a] transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}