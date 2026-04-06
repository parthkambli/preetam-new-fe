// // pages/school/Activities/ScheduleActivity.jsx
// import { useState } from 'react';

//  //In production this list would come from the activities API
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
























import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const getMinDate = () => new Date().toISOString().split('T')[0];
const getMaxDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 2);
  return d.toISOString().split('T')[0];
};

const emptyForm = {
  activity: '',
  date: '',
  time: '',
  place: '',
  instructor: '',
};

export default function ScheduleActivity({ onCancel, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [activityOptions, setActivityOptions] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.fitnessActivities.getAll();
        setActivityOptions(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load activity list');
      }
    };

    fetchActivities();
  }, []);

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validate = () => {
    const e = {};

    if (!form.activity) e.activity = 'Please select an activity.';

    if (!form.date) {
      e.date = 'Date is required.';
    } else {
      const [year, month, day] = form.date.split('-').map(Number);
      const today = new Date();

      const isPast =
        year < today.getFullYear() ||
        (year === today.getFullYear() && month < today.getMonth() + 1) ||
        (year === today.getFullYear() && month === today.getMonth() + 1 && day < today.getDate());

      if (isPast) {
        e.date = 'Please select today or a future date.';
      } else {
        const selected = new Date(form.date);
        const twoYearsFromNow = new Date();
        twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);

        if (selected > twoYearsFromNow) {
          e.date = 'Date must be within 2 years from today.';
        }
      }
    }

    if (!form.time) e.time = 'Time is required.';
    if (!form.place.trim()) e.place = 'Place is required.';
    if (!form.instructor.trim()) e.instructor = 'Instructor name is required.';

    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      await api.fitnessSchedules.create({
        activity: form.activity,
        date: form.date,
        time: form.time,
        place: form.place,
        instructor: form.instructor,
      });

      toast.success('Activity scheduled successfully');
      setForm(emptyForm);
      onSaved?.();
    } catch (err) {
      console.error('SAVE SCHEDULE ERROR:', err?.response?.data || err.message);
      const msg = err.response?.data?.message || 'Failed to schedule activity';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (key) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300
     focus:outline-none focus:ring-2 focus:ring-[#000359]/30 focus:border-[#000359] bg-white transition-all
     ${errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Activity Name<span className="text-red-500 ml-0.5">*</span>
          </label>
          <select
            value={form.activity}
            onChange={(e) => set('activity', e.target.value)}
            className={inputCls('activity') + ' appearance-none'}
          >
            <option value="">Select Activity</option>
            {activityOptions.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
          {errors.activity && <p className="text-xs text-red-500">{errors.activity}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Date<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            className={inputCls('date')}
          />
          {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Time<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => set('time', e.target.value)}
            className={inputCls('time')}
          />
          {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Place<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.place}
            onChange={(e) => set('place', e.target.value)}
            placeholder="Activity Hall"
            className={inputCls('place')}
          />
          {errors.place && <p className="text-xs text-red-500">{errors.place}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Instructor Name<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={form.instructor}
            onChange={(e) => set('instructor', e.target.value)}
            placeholder="Mr. Sharma"
            className={inputCls('instructor')}
          />
          {errors.instructor && <p className="text-xs text-red-500">{errors.instructor}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors font-medium"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 text-sm bg-[#000359] hover:bg-[#000280] active:bg-[#00023d] text-white rounded-lg transition-colors font-semibold shadow-sm disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Schedule'}
        </button>
      </div>
    </div>
  );
}