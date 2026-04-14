// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const EVENT_TYPES = ["Birthday", "Lunch", "Health Camp", "Cultural", "Sports", "Other"];

// const emptyForm = {
//   title: "",
//   type: "Birthday",
//   date: "",
//   location: "",
//   startTime: "",
//   endTime: "",
//   description: "",
// };

// export default function AddEvent() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editingEvent = location.state?.event || null;

//   const [form, setForm] = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     if (editingEvent) {
//       // Parse time range "HH:MM – HH:MM" back to start/end
//       const [startTime, endTime] = (editingEvent.time || "").split(" – ");
//       setForm({
//         title: editingEvent.title || "",
//         type: editingEvent.type || "Birthday",
//         date: editingEvent.date || "",
//         location: editingEvent.location || "",
//         startTime: startTime || "",
//         endTime: endTime || "",
//         description: editingEvent.description || "",
//       });
//     }
//   }, [editingEvent]);

//   const validate = () => {
//     const newErrors = {};
//     if (!form.title.trim()) newErrors.title = "Event title is required.";
//     if (!form.date) newErrors.date = "Date is required.";
//     if (!form.location.trim()) newErrors.location = "Location is required.";
//     if (!form.startTime) newErrors.startTime = "Start time is required.";
//     if (!form.endTime) newErrors.endTime = "End time is required.";
//     if (form.startTime && form.endTime && form.startTime >= form.endTime) {
//       newErrors.endTime = "End time must be after start time.";
//     }
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     // In a real app, you'd dispatch to global state / API here
//     setSubmitted(true);
//     setTimeout(() => navigate("/fitness/events"), 1200);
//   };

//   const handleCancel = () => {
//     navigate("/fitness/events");
//   };

//   if (submitted) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
//           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <p className="text-lg font-semibold text-gray-800">
//             Event {editingEvent ? "updated" : "saved"} successfully!
//           </p>
//           <p className="text-sm text-gray-500">Redirecting to events list…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           {editingEvent ? "Edit Event" : "Add Event"}
//         </h1>
//       </div>

//       {/* Form Card */}
//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-4xl">
//         <form onSubmit={handleSave} noValidate>
//           {/* Row 1: Event Title + Event Type */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Event Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//                 placeholder="Enter event title"
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${
//                   errors.title ? "border-red-400" : "border-gray-300"
//                 }`}
//               />
//               {errors.title && (
//                 <p className="mt-1 text-xs text-red-500">{errors.title}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Event Type
//               </label>
//               <select
//                 name="type"
//                 value={form.type}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition"
//               >
//                 {EVENT_TYPES.map((t) => (
//                   <option key={t} value={t}>{t}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Row 2: Date + Location */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Date
//               </label>
//               <input
//                 type="date"
//                 name="date"
//                 value={form.date}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${
//                   errors.date ? "border-red-400" : "border-gray-300"
//                 }`}
//               />
//               {errors.date && (
//                 <p className="mt-1 text-xs text-red-500">{errors.date}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Location
//               </label>
//               <input
//                 type="text"
//                 name="location"
//                 value={form.location}
//                 onChange={handleChange}
//                 placeholder="Enter location"
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${
//                   errors.location ? "border-red-400" : "border-gray-300"
//                 }`}
//               />
//               {errors.location && (
//                 <p className="mt-1 text-xs text-red-500">{errors.location}</p>
//               )}
//             </div>
//           </div>

//           {/* Row 3: Start Time + End Time */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 Start Time
//               </label>
//               <input
//                 type="time"
//                 name="startTime"
//                 value={form.startTime}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${
//                   errors.startTime ? "border-red-400" : "border-gray-300"
//                 }`}
//               />
//               {errors.startTime && (
//                 <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">
//                 End Time
//               </label>
//               <input
//                 type="time"
//                 name="endTime"
//                 value={form.endTime}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${
//                   errors.endTime ? "border-red-400" : "border-gray-300"
//                 }`}
//               />
//               {errors.endTime && (
//                 <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>
//               )}
//             </div>
//           </div>

//           {/* Row 4: Description */}
//           <div className="mb-7">
//             <label className="block text-sm font-semibold text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Enter event description"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition resize-none"
//             />
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-150"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold transition-colors duration-150 shadow-md"
//             >
//               {editingEvent ? "Update Event" : "Save Event"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }









// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// const EVENT_TYPES = ["Competition", "Workshop", "Bootcamp", "Seminar", "Health Camp", "Members Meet", "Festival", "Other"];

// const emptyForm = {
//   title: "",
//   type: "Competition",
//   date: "",
//   location: "",
//   startTime: "",
//   endTime: "",
//   description: "",
// };

// export default function AddEvent() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editingEvent = location.state?.event || null;

//   const [form, setForm] = useState(emptyForm);
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (editingEvent) {
//       setForm({
//         title: editingEvent.title || "",
//         type: editingEvent.type || "Competition",
//         date: editingEvent.date ? new Date(editingEvent.date).toISOString().split('T')[0] : "",
//         location: editingEvent.location || "",
//         startTime: editingEvent.startTime || "",
//         endTime: editingEvent.endTime || "",
//         description: editingEvent.description || "",
//       });
//     }
//   }, [editingEvent]);

//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!form.title.trim()) newErrors.title = "Event title is required.";
//     if (!form.type) newErrors.type = "Event type is required.";
//     if (!form.date) newErrors.date = "Date is required.";
//     if (!form.location.trim()) newErrors.location = "Location is required.";
//     if (!form.startTime) newErrors.startTime = "Start time is required.";
//     if (!form.endTime) newErrors.endTime = "End time is required.";

//     // Date validation: Today or Future only
//     if (form.date) {
//       const selectedDate = new Date(form.date);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       if (selectedDate < today) {
//         newErrors.date = "Event date cannot be in the past. Only today or future dates allowed.";
//       }
//     }

//     // Time validation: End time must be after start time
//     if (form.startTime && form.endTime && form.startTime >= form.endTime) {
//       newErrors.endTime = "End time must be after start time.";
//     }

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));

//     // Clear error when user types
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       toast.error(Object.values(validationErrors)[0]);
//       return;
//     }

//     setSaving(true);
//     try {
//       if (editingEvent) {
//         await api.fitnessEvents.update(editingEvent._id, form);
//         toast.success("Event updated successfully");
//       } else {
//         await api.fitnessEvents.create(form);
//         toast.success("Event created successfully");
//       }
//       setSubmitted(true);
//       setTimeout(() => navigate("/fitness/events"), 1200);
//     } catch (err) {
//       const msg = err.response?.data?.message || "Failed to save event";
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => navigate("/fitness/events");

//   const today = getTodayDate();

//   if (submitted) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
//           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <p className="text-lg font-semibold text-gray-800">
//             Event {editingEvent ? "updated" : "saved"} successfully!
//           </p>
//           <p className="text-sm text-gray-500">Redirecting to events list…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           {editingEvent ? "Edit Event" : "Add Event"}
//         </h1>
//       </div>

//       <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-4xl">
//         <form onSubmit={handleSave} noValidate>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//                 placeholder="Enter event title"
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.title ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Event Type</label>
//               <select
//                 name="type"
//                 value={form.type}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition"
//               >
//                 {EVENT_TYPES.map((t) => (
//                   <option key={t} value={t}>{t}</option>
//                 ))}
//               </select>
//               {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={form.date}
//                 onChange={handleChange}
//                 min={today}                    // ← Only today or future dates
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.date ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={form.location}
//                 onChange={handleChange}
//                 placeholder="Enter location"
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.location ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
//               <input
//                 type="time"
//                 name="startTime"
//                 value={form.startTime}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.startTime ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
//               <input
//                 type="time"
//                 name="endTime"
//                 value={form.endTime}
//                 onChange={handleChange}
//                 min={form.startTime || undefined}   // ← End time must be after start time
//                 className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.endTime ? "border-red-400" : "border-gray-300"}`}
//               />
//               {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>}
//             </div>
//           </div>

//           <div className="mb-7">
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Enter event description"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition resize-none"
//             />
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-150"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-6 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold transition-colors duration-150 shadow-md disabled:opacity-70"
//             >
//               {saving ? "Saving..." : editingEvent ? "Update Event" : "Save Event"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



























import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

const EVENT_TYPES = ["Competition", "Workshop", "Bootcamp", "Seminar", "Health Camp", "Members Meet", "Festival", "Other"];

const emptyForm = {
  title: "",
  type: "Competition",
  date: "",
  location: "",
  startTime: "",
  endTime: "",
  description: "",
};

export default function AddEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingEvent = location.state?.event || null;
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.title || "",
        type: editingEvent.type || "Competition",
        date: editingEvent.date ? new Date(editingEvent.date).toISOString().split('T')[0] : "",
        location: editingEvent.location || "",
        startTime: editingEvent.startTime || "",
        endTime: editingEvent.endTime || "",
        description: editingEvent.description || "",
      });
    }
  }, [editingEvent]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Event title is required.";
    if (!form.type) newErrors.type = "Event type is required.";
    if (!form.date) newErrors.date = "Date is required.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.startTime) newErrors.startTime = "Start time is required.";
    if (!form.endTime) newErrors.endTime = "End time is required.";

    // Date validation: Today or Future only
    if (form.date) {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Event date cannot be in the past. Only today or future dates allowed.";
      }
    }

    // Time validation: End time must be after start time
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      newErrors.endTime = "End time must be after start time.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      // Restrict year to maximum 4 digits while typing
      const parts = value.split('-');
      if (parts[0] && parts[0].length > 4) {
        parts[0] = parts[0].slice(0, 4);
      }
      const cleanedValue = parts.join('-');

      setForm((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }
    setSaving(true);
    try {
      if (editingEvent) {
        await api.fitnessEvents.update(editingEvent._id, form);
        toast.success("Event updated successfully");
      } else {
        await api.fitnessEvents.create(form);
        toast.success("Event created successfully");
      }
      setSubmitted(true);
      setTimeout(() => navigate("/fitness/events"), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save event";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/fitness/events");
  const today = getTodayDate();

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            Event {editingEvent ? "updated" : "saved"} successfully!
          </p>
          <p className="text-sm text-gray-500">Redirecting to events list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {editingEvent ? "Edit Event" : "Add Event"}
        </h1>
      </div>
      <div className="bg-white rounded-xl shadow p-6 sm:p-8 max-w-4xl">
        <form onSubmit={handleSave} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter event title"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.title ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Event Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
<<<<<<< HEAD
                onChange={handleChange}            
                min={today}                    // ← Only today or future dates
=======
                onChange={handleChange}
                min={today}
                max="9999-12-31"
>>>>>>> 25ec46e88f185fe6654fdad74ad00bd7c76dff4e
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.date ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.location ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.startTime ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                min={form.startTime || undefined}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition ${errors.endTime ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>}
            </div>
          </div>

          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter event description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e] bg-white transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#1a2a5e] hover:bg-[#152147] text-white rounded-lg text-sm font-semibold transition-colors duration-150 shadow-md disabled:opacity-70"
            >
              {saving ? "Saving..." : editingEvent ? "Update Event" : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}