

// import { useState } from 'react';

// export default function AddEmploymentType() {
//   const [empType, setEmpType] = useState('');

//   const handleSave = () => {
//     if (!empType.trim()) return;
//     // TODO: API call
//     console.log('Saving employment type:', empType);
//     setEmpType('');
//   };

//   return (
//     <div className="space-y-4">
//       <h2 className="text-lg font-semibold text-gray-800">Add Employment Type</h2>

//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 w-full max-w-lg">
//         <div className="mb-6">
//           <label className="block text-sm font-semibold text-gray-800 mb-2">
//             Employment Type
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. Full Time"
//             value={empType}
//             onChange={e => setEmpType(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent transition"
//           />
//         </div>
//         <div className="flex items-center justify-center gap-3">
//           <button
//             onClick={() => setEmpType('')}
//             className="px-8 py-2 rounded-lg border border-gray-400 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!empType.trim()}
//             className="px-8 py-2 rounded-lg bg-[#000359] hover:bg-[#0a0f6b] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import api from '../../../services/api';
export default function AddEmploymentType() {
  const [empType,  setEmpType]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const handleSave = async () => {
    if (!empType.trim()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.fitnessStaff.createEmploymentType({ name: empType.trim() });
      setSuccess('Employment type added successfully!');
      setEmpType('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEmpType('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Add Employment Type</h2>

      {error   && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 w-full max-w-lg">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Employment Type
          </label>
          <input
            type="text"
            placeholder="e.g. Full Time"
            value={empType}
            onChange={e => setEmpType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#000359] focus:border-transparent transition"
          />
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleCancel}
            className="px-8 py-2 rounded-lg border border-gray-400 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!empType.trim() || loading}
            className="px-8 py-2 rounded-lg bg-[#000359] hover:bg-[#0a0f6b] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}