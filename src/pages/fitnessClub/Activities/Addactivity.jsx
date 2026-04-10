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
















// pages/fitnessClub/Activities/AddActivity.jsx
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

export default function AddActivity({ onCancel, onSaved, editData }) {

  const [activityName, setActivityName] = useState('');

  useEffect(() => {
  if (editData) {
    setActivityName(editData.name || '');
    setCapacity(editData.capacity || 0);
    setSlots(editData.slots || []);
  }
}, [editData]);

  const [capacity, setCapacity] = useState(''); // ✅ NEW
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [slots, setSlots] = useState([
    { startTime: '', endTime: '' } // ✅ REMOVED capacity
  ]);

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => {
    setSlots([
      ...slots,
      { startTime: '', endTime: '' }
    ]);
  };

  const removeSlot = (index) => {
    const updated = slots.filter((_, i) => i !== index);
    setSlots(updated);
  };

  const handleSave = async () => {
    if (!activityName.trim()) {
      setError('Activity name is required.');
      return;
    }

    if (!capacity || Number(capacity) <= 0) {
      setError('Valid capacity is required');
      return;
    }

    if (slots.length === 0) {
      setError('At least one slot is required');
      return;
    }

    for (let slot of slots) {
      if (!slot.startTime || !slot.endTime) {
        setError('All slot fields are required');
        return;
      }
    }

    setSaving(true);
    setError('');

    try {
      if (editData) {
    await api.fitnessActivities.update(editData._id, {
      name: activityName.trim(),
      capacity: Number(capacity),
      slots
    });

    toast.success('Activity updated successfully');
  } else {
    await api.fitnessActivities.create({
      name: activityName.trim(),
      capacity: Number(capacity),
      slots
    });

    toast.success('Activity added successfully');

    } }catch (err) {
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
    <div className="max-w-xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

        {/* Activity Name */}
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
            className={`w-full border rounded-lg px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#000359]/30
              ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
          />
        </div>

        {/* Capacity */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Capacity<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="e.g. 20"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#000359]/30"
          />
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Time Slots
          </h3>

          <div className="border border-gray-200 rounded-lg overflow-hidden">

            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
              <div>Start Time</div>
              <div>End Time</div>
              <div></div>
            </div>

            {/* Rows */}
            {slots.map((slot, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center px-4 py-3 border-t"
              >
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    handleSlotChange(index, 'startTime', e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                />

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{'>'}</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleSlotChange(index, 'endTime', e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-2 text-sm w-full"
                  />
                </div>

                <div className="flex justify-center">
                  {slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="text-gray-500 hover:text-red-500 text-lg"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Slot */}
            <div className="border-t flex justify-center py-3">
              <button
                type="button"
                onClick={addSlot}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 font-medium"
              >
                + Add Time Slot
              </button>
            </div>

          </div>
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm bg-[#000359] text-white rounded-lg"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  );
}

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

//         <div className="space-y-3">
//   <label className="text-sm font-semibold text-gray-700">
//     Time Slots<span className="text-red-500 ml-0.5">*</span>
//   </label>

//   {slots.map((slot, index) => (
//     <div key={index} className="flex gap-2 items-center">

//       <input
//         type="time"
//         value={slot.startTime}
//         onChange={(e) =>
//           handleSlotChange(index, 'startTime', e.target.value)
//         }
//         className="border px-2 py-2 rounded-md text-sm"
//       />

//       <input
//         type="time"
//         value={slot.endTime}
//         onChange={(e) =>
//           handleSlotChange(index, 'endTime', e.target.value)
//         }
//         className="border px-2 py-2 rounded-md text-sm"
//       />

//       <input
//         type="number"
//         placeholder="Capacity"
//         value={slot.capacity}
//         onChange={(e) =>
//           handleSlotChange(index, 'capacity', e.target.value)
//         }
//         className="border px-2 py-2 rounded-md text-sm w-24"
//       />

//       {slots.length > 1 && (
//         <button
//           type="button"
//           onClick={() => removeSlot(index)}
//           className="text-red-500 text-sm"
//         >
//           ✕
//         </button>
//       )}
//     </div>
//   ))}

//   <button
//     type="button"
//     onClick={addSlot}
//     className="text-sm text-[#000359] font-medium"
//   >
//     + Add Slot
//   </button>
// </div>

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