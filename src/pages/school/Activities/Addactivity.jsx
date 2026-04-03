// // pages/school/Activities/AddActivity.jsx
// import { useState } from 'react';

// export default function AddActivity({ onCancel, onSaved }) {
//   const [activityName, setActivityName] = useState('');
//   const [error,        setError]        = useState('');
//   const [saving,       setSaving]       = useState(false);

//   const handleSave = () => {
//     if (!activityName.trim()) {
//       setError('Activity name is required.');
//       return;
//     }
//     setSaving(true);
//     // In production: await api.post('/activities', { name: activityName })
//     setTimeout(() => {
//       setSaving(false);
//       onSaved?.();
//     }, 600);
//   };

//   return (
//     <div className="max-w-lg">
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

//         {/* Field */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Activity Name<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="text"
//             value={activityName}
//             onChange={e => { setActivityName(e.target.value); if (error) setError(''); }}
//             placeholder="e.g. Yoga"
//             className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
//               focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
//               ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
//           />
//           {error && <p className="text-xs text-red-500">{error}</p>}
//         </div>

//         {/* Actions */}
//         <div className="flex justify-center gap-3 pt-1">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-6 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={saving}
//             className="px-6 py-2 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60"
//           >
//             {saving ? 'Saving…' : 'Save'}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }




// // pages/school/Activities/AddActivity.jsx
// import { useState } from 'react';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// export default function AddActivity({ onCancel, onSaved }) {
//   const [activityName, setActivityName] = useState('');
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);

//   const handleSave = async () => {
//     if (!activityName.trim()) {
//       setError('Activity name is required.');
//       return;
//     }

//     setSaving(true);
//     setError('');

//     try {
//       await api.activities.create({ name: activityName.trim() });
//       toast.success("Activity added successfully");
//       onSaved?.();
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to add activity';
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="max-w-lg">
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Activity Name<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="text"
//             value={activityName}
//             onChange={e => { 
//               setActivityName(e.target.value); 
//               if (error) setError(''); 
//             }}
//             placeholder="e.g. Yoga"
//             className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
//               focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
//               ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
//           />
//           {error && <p className="text-xs text-red-500">{error}</p>}
//         </div>

//         <div className="flex justify-center gap-3 pt-1">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-6 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={saving}
//             className="px-6 py-2 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60"
//           >
//             {saving ? 'Saving…' : 'Save'}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }



// pages/school/Activities/AddActivity.jsx
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

// ─── Validation ───────────────────────────────────────────────────────────────
const validateActivityName = (name) => {
  const trimmed = name.trim();
  if (!trimmed) return 'Activity name is required.';
  if (trimmed.length < 2) return 'Activity name must be at least 2 characters.';
  if (trimmed.length > 100) return 'Activity name must not exceed 100 characters.';
  if (!/^[a-zA-Z0-9\s\-_()/&]+$/.test(trimmed)) {
    return 'Only letters, numbers, spaces, and basic symbols (- _ / & ()) are allowed.';
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
export default function AddActivity({ onCancel, onSaved }) {
  const [activityName, setActivityName] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setActivityName(e.target.value);
    if (fieldError) setFieldError('');
  };

  // Allow save by pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  const handleSave = async () => {
    // 1. Client-side validation first
    const validationError = validateActivityName(activityName);
    if (validationError) {
      setFieldError(validationError);
      toast.error(validationError);
      return;
    }

    setSaving(true);
    setFieldError('');

    try {
      await api.activities.create({ name: activityName.trim() });
      toast.success(`"${activityName.trim()}" added successfully!`);
      onSaved?.();

    } catch (err) {
      console.error('AddActivity error:', err);
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };

  // 2. Handle every possible server response
  const handleApiError = (err) => {
    // No internet / server completely down
    if (!err.response) {
      toast.error('Cannot connect to server. Please check your internet connection.');
      return;
    }

    const { status, data } = err.response;

    switch (status) {
      case 409:
        // Duplicate activity name
        setFieldError(`"${activityName.trim()}" already exists. Please use a different name.`);
        toast.error(`Activity "${activityName.trim()}" already exists.`);
        break;

      case 400:
        if (data.errors?.length) {
          data.errors.forEach(msg => toast.error(msg));
          setFieldError(data.errors[0]);
        } else {
          const msg = data.message || 'Invalid activity name.';
          setFieldError(msg);
          toast.error(msg);
        }
        break;

      case 401:
      case 403:
        toast.error('You do not have permission to add activities.');
        break;

      case 500:
        toast.error('Server error while saving. Please try again in a moment.');
        break;

      case 503:
        toast.error('Server is temporarily unavailable. Please try again later.');
        break;

      default:
        toast.error(data?.message || `Unexpected error (${status}). Please try again.`);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Activity Name<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={activityName}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={saving}
            placeholder="e.g. Yoga"
            maxLength={101}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
              focus:outline-none focus:ring-2 bg-white transition-all
              ${fieldError
                ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400'
                : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'
              }`}
          />

          {/* Character counter + error message */}
          <div className="flex justify-between items-start">
            {fieldError
              ? (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fieldError}
                </p>
              )
              : <span />
            }
            <span className={`text-xs ml-auto ${activityName.length > 100 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {activityName.length}/100
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-6 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !activityName.trim()}
            className="px-6 py-2 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  );
}