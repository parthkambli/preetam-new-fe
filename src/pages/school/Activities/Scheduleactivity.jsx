// // pages/school/Activities/ScheduleActivity.jsx
// import { useState } from 'react';

// // In production this list would come from the activities API
// const activityOptions = ['Yoga', 'Music', 'Art', 'Dance', 'Meditation', 'Cooking'];

// const emptyForm = {
//   activity:   '',
//   date:       '',
//   time:       '',
//   place:      '',
//   instructor: '',
// };

// export default function ScheduleActivity({ onCancel, onSaved }) {
//   const [form,   setForm]   = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);

//   const set = (key, val) => {
//     setForm(prev => ({ ...prev, [key]: val }));
//     if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.activity)   e.activity   = 'Please select an activity.';
//     if (!form.date)       e.date       = 'Date is required.';
//     if (!form.time)       e.time       = 'Time is required.';
//     if (!form.place.trim())      e.place      = 'Place is required.';
//     if (!form.instructor.trim()) e.instructor = 'Instructor name is required.';
//     return e;
//   };

//   const handleSave = () => {
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setSaving(true);
//     // In production: await api.post('/activities/schedule', form)
//     setTimeout(() => {
//       setSaving(false);
//       onSaved?.();
//     }, 600);
//   };

//   const inputCls = (key) =>
//     `w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
//      focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
//      ${errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

//       {/* Row 1: Activity Name | Date | Time */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Activity Name<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <select
//             value={form.activity}
//             onChange={e => set('activity', e.target.value)}
//             className={inputCls('activity') + ' appearance-none'}
//           >
//             <option value="">Select Activity</option>
//             {activityOptions.map(a => <option key={a}>{a}</option>)}
//           </select>
//           {errors.activity && <p className="text-xs text-red-500">{errors.activity}</p>}
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Date<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="date"
//             value={form.date}
//             onChange={e => set('date', e.target.value)}
//             className={inputCls('date')}
//           />
//           {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Time<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="time"
//             value={form.time}
//             onChange={e => set('time', e.target.value)}
//             className={inputCls('time')}
//           />
//           {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
//         </div>

//       </div>

//       {/* Row 2: Place | Instructor */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Place<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="text"
//             value={form.place}
//             onChange={e => set('place', e.target.value)}
//             placeholder="Activity Hall"
//             className={inputCls('place')}
//           />
//           {errors.place && <p className="text-xs text-red-500">{errors.place}</p>}
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Instructor Name<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="text"
//             value={form.instructor}
//             onChange={e => set('instructor', e.target.value)}
//             placeholder="Mr. Sharma"
//             className={inputCls('instructor')}
//           />
//           {errors.instructor && <p className="text-xs text-red-500">{errors.instructor}</p>}
//         </div>

//       </div>

//       {/* Footer */}
//       <div className="flex justify-end gap-3 pt-1">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
//         >
//           Cancel
//         </button>
//         <button
//           type="button"
//           onClick={handleSave}
//           disabled={saving}
//           className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60"
//         >
//           {saving ? 'Saving…' : 'Save Schedule'}
//         </button>
//       </div>

//     </div>
//   );
// }





// // pages/school/Activities/ScheduleActivity.jsx
// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const emptyForm = {
//   activity: '',
//   date: '',
//   time: '',
//   place: '',
//   instructor: '',
// };

// export default function ScheduleActivity({ onCancel, onSaved }) {
//   const [form, setForm] = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [activityOptions, setActivityOptions] = useState([]);

//   // Fetch master activities for dropdown
//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const res = await api.activities.getAll();
//         setActivityOptions(res.data?.data || res.data || []);
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load activity list');
//       }
//     };
//     fetchActivities();
//   }, []);

//   const set = (key, val) => {
//     setForm(prev => ({ ...prev, [key]: val }));
//     if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.activity) e.activity = 'Please select an activity.';
//     if (!form.date) e.date = 'Date is required.';
//     if (!form.time) e.time = 'Time is required.';
//     if (!form.place.trim()) e.place = 'Place is required.';
//     if (!form.instructor.trim()) e.instructor = 'Instructor name is required.';
//     return e;
//   };

//   const handleSave = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       return;
//     }

//     setSaving(true);

//     try {
//       await api.activities.createScheduled({
//         activity: form.activity,
//         date: form.date,
//         time: form.time,
//         place: form.place,
//         instructorName: form.instructor,
//       });

//       toast.success("Activity scheduled successfully");
//       onSaved?.();
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed to schedule activity';
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputCls = (key) =>
//     `w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
//      focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
//      ${errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Activity Name<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <select
//             value={form.activity}
//             onChange={e => set('activity', e.target.value)}
//             className={inputCls('activity') + ' appearance-none'}
//           >
//             <option value="">Select Activity</option>
//             {activityOptions.map(a => (
//               <option key={a._id} value={a._id}>{a.name}</option>
//             ))}
//           </select>
//           {errors.activity && <p className="text-xs text-red-500">{errors.activity}</p>}
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Date<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="date"
//             value={form.date}
//             onChange={e => set('date', e.target.value)}
//             className={inputCls('date')}
//           />
//           {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Time<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="time"
//             value={form.time}
//             onChange={e => set('time', e.target.value)}
//             className={inputCls('time')}
//           />
//           {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Place<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="text"
//             value={form.place}
//             onChange={e => set('place', e.target.value)}
//             placeholder="Activity Hall"
//             className={inputCls('place')}
//           />
//           {errors.place && <p className="text-xs text-red-500">{errors.place}</p>}
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-semibold text-gray-700">
//             Instructor Name<span className="text-red-500 ml-0.5">*</span>
//           </label>
//           <input
//             type="text"
//             value={form.instructor}
//             onChange={e => set('instructor', e.target.value)}
//             placeholder="Mr. Sharma"
//             className={inputCls('instructor')}
//           />
//           {errors.instructor && <p className="text-xs text-red-500">{errors.instructor}</p>}
//         </div>
//       </div>

//       <div className="flex justify-end gap-3 pt-1">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
//         >
//           Cancel
//         </button>
//         <button
//           type="button"
//           onClick={handleSave}
//           disabled={saving}
//           className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60"
//         >
//           {saving ? 'Saving…' : 'Save Schedule'}
//         </button>
//       </div>
//     </div>
//   );
// }











// pages/school/Activities/ScheduleActivity.jsx
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const emptyForm = {
  activity: '',
  date: '',
  time: '',
  place: '',
  instructor: '',
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validateForm = (form) => {
  const errors = {};

  if (!form.activity) {
    errors.activity = 'Please select an activity.';
  }

  if (!form.date) {
    errors.date = 'Date is required.';
  } else {
    const selected = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Warn if date is more than 2 years in the future (likely a typo)
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    if (selected > twoYearsFromNow) {
      errors.date = 'Date seems too far in the future. Please check.';
    }
  }

  if (!form.time) {
    errors.time = 'Time is required.';
  }

  if (!form.place.trim()) {
    errors.place = 'Place is required.';
  } else if (form.place.trim().length > 200) {
    errors.place = 'Place name must not exceed 200 characters.';
  }

  if (!form.instructor.trim()) {
    errors.instructor = 'Instructor name is required.';
  } else if (form.instructor.trim().length < 2) {
    errors.instructor = 'Instructor name must be at least 2 characters.';
  } else if (form.instructor.trim().length > 100) {
    errors.instructor = 'Instructor name must not exceed 100 characters.';
  }

  return errors;
};

// ─────────────────────────────────────────────────────────────────────────────
export default function ScheduleActivity({ onCancel, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [activityOptions, setActivityOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // ── Fetch master activities for dropdown ─────────────────────────────────
  useEffect(() => {
    const fetchActivities = async () => {
      setLoadingOptions(true);
      try {
        const res = await api.activities.getAll();
        const data = res.data?.data || res.data || [];

        if (data.length === 0) {
          toast.warning('No activities found. Please add activities first from "Add Activities".');
        }

        setActivityOptions(data);
      } catch (err) {
        console.error('ScheduleActivity fetch options error:', err);
        if (!err.response) {
          toast.error('Cannot connect to server. Please check your internet connection.');
        } else {
          toast.error('Failed to load activities. Please refresh the page.');
        }
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchActivities();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    // Clear that field's error as user edits it
    if (fieldErrors[key]) {
      setFieldErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleSave = async () => {
    // 1. Validate all fields
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Show first error as toast
      toast.error(Object.values(errors)[0]);
      return;
    }

    setSaving(true);

    try {
      await api.activities.createScheduled({
        activity: form.activity,
        date: form.date,
        time: form.time,
        place: form.place.trim(),
        instructorName: form.instructor.trim(),
      });

      toast.success('Activity scheduled successfully!');
      onSaved?.();

    } catch (err) {
      console.error('ScheduleActivity save error:', err);
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };

  // 2. Handle every possible server response
  const handleApiError = (err) => {
    if (!err.response) {
      toast.error('Cannot connect to server. Please check your internet connection.');
      return;
    }

    const { status, data } = err.response;

    switch (status) {
      case 400:
        if (data.errors?.length) {
          // Show each backend validation error separately
          data.errors.forEach(msg => toast.error(msg));
        } else {
          toast.error(data.message || 'Invalid data. Please check your inputs.');
        }
        break;

      case 404:
        // The selected activity was deleted between page load and save
        toast.error('The selected activity no longer exists. Please refresh the page and try again.');
        setFieldErrors(prev => ({
          ...prev,
          activity: 'This activity no longer exists. Please refresh and re-select.'
        }));
        break;

      case 409:
        toast.error(data.message || 'A conflict occurred. Please check the schedule.');
        break;

      case 401:
      case 403:
        toast.error('You do not have permission to schedule activities.');
        break;

      case 500:
        toast.error('Server error. Please try again in a moment.');
        break;

      case 503:
        toast.error('Server is temporarily unavailable. Please try again later.');
        break;

      default:
        toast.error(data?.message || `Unexpected error (${status}). Please try again.`);
    }
  };

  // ── Shared input class ───────────────────────────────────────────────────────
  const inputCls = (key) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
     focus:outline-none focus:ring-2 bg-white transition-all
     ${fieldErrors[key]
       ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-400'
       : 'border-gray-300 focus:ring-[#000359]/30 focus:border-[#000359]'
     }`;

  // Reusable inline error message
  const FieldError = ({ name }) => fieldErrors[name] ? (
    <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {fieldErrors[name]}
    </p>
  ) : null;

  // Count total errors for the summary banner
  const errorCount = Object.values(fieldErrors).filter(Boolean).length;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

      {/* Error summary banner */}
      {errorCount > 0 && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="font-semibold">Please fix {errorCount} error{errorCount > 1 ? 's' : ''} below:</p>
            <ul className="mt-1 list-disc list-inside space-y-0.5">
              {Object.values(fieldErrors).filter(Boolean).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Activity select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Activity Name<span className="text-red-500 ml-0.5">*</span>
          </label>
          <select
            value={form.activity}
            onChange={e => set('activity', e.target.value)}
            disabled={loadingOptions}
            className={inputCls('activity') + ' appearance-none'}
          >
            <option value="">
              {loadingOptions ? 'Loading activities...' : 'Select Activity'}
            </option>
            {activityOptions.map(a => (
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
          </select>
          <FieldError name="activity" />
          {/* Show a hint if no options are available */}
          {!loadingOptions && activityOptions.length === 0 && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              No activities yet. Add some from "Add Activities" tab.
            </p>
          )}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Date<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            className={inputCls('date')}
          />
          <FieldError name="date" />
        </div>

        {/* Time */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Time<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="time"
            value={form.time}
            onChange={e => set('time', e.target.value)}
            className={inputCls('time')}
          />
          <FieldError name="time" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Place */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Place<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.place}
            onChange={e => set('place', e.target.value)}
            placeholder="e.g. Activity Hall"
            className={inputCls('place')}
          />
          <FieldError name="place" />
        </div>

        {/* Instructor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Instructor Name<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.instructor}
            onChange={e => set('instructor', e.target.value)}
            placeholder="e.g. Mr. Sharma"
            className={inputCls('instructor')}
          />
          <FieldError name="instructor" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60 flex items-center gap-2"
        >
          {saving && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {saving ? 'Saving…' : 'Save Schedule'}
        </button>
      </div>
    </div>
  );
}