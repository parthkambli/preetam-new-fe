// // pages/school/Activities/AddActivity.jsx
// import { useState } from 'react';

//  export default function AddActivity({ onCancel, onSaved }) {
//    const [activityName, setActivityName] = useState('');
//    const [error,        setError]        = useState('');
//   const [saving,       setSaving]       = useState(false);

//    const handleSave = () => {
//      if (!activityName.trim()) {
//        setError('Activity name is required.');
//        return;
//      }
//      setSaving(true);
//      // In production: await api.post('/activities', { name: activityName })
//      setTimeout(() => {
//        setSaving(false);
//        onSaved?.();
//      }, 600);
//    };

//    return (
//      <div className="max-w-lg">
//        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

//          {/* Field */}
//          <div className="flex flex-col gap-1.5">
//              <label className="text-sm font-semibold text-gray-700">               Activity Name<span className="text-red-500 ml-0.5">*</span>
//              </label>
//              <input
//               type="text" //             value={activityName}
//             onChange={e => { setActivityName(e.target.value); if (error) setError(''); }}
//             placeholder="e.g. Yoga"
//             className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
//               focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
//               ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
//           />
//           {error && <p className="text-xs text-red-500">{error}</p>}
//         </div>

//          {/* Actions */}
//          <div className="flex justify-center gap-3 pt-1">
//            <button
//              type="button"
//              onClick={onCancel}
//              className="px-6 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
//            >
//              Cancel
//            </button>
//            <button
//              type="button"
//              onClick={handleSave}
//              disabled={saving}
//              className="px-6 py-2 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60"
//            >
//              {saving ? 'Saving…' : 'Save'}
//            </button>
//          </div>

//        </div>
//      </div>
//    );
//  }
















// pages/school/Activities/AddActivity.jsx
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

export default function AddActivity({ onCancel, onSaved }) {
  const [activityName, setActivityName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!activityName.trim()) {
      setError('Activity name is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.fitnessActivities.create({ name: activityName.trim() });
      toast.success('Activity added successfully');
      onSaved?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to add activity';

      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

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
            onChange={e => {
              setActivityName(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Yoga"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
              ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  );
}