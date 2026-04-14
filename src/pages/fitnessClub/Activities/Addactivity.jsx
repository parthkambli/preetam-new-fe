// pages/fitnessClub/Activities/AddActivity.jsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "../../../services/apiClient";

export default function AddActivity({ onCancel, onSaved, editData }) {
  const [activityName, setActivityName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [staffList, setStaffList] = useState([]);

  const [slots, setSlots] = useState([
    { startTime: "", endTime: "", staffId: "" }
  ]);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (editData) {
      setActivityName(editData.name || "");
      setCapacity(editData.capacity || "");
      setSlots(
        editData.slots?.map((slot) => ({
          startTime: slot.startTime || "",
          endTime: slot.endTime || "",
          staffId: slot.staffId || "",
        })) || [{ startTime: "", endTime: "", staffId: "" }]
      );
    }
  }, [editData]);

  const fetchStaff = async () => {
    try {
      const res = await api.fitnessStaff.getAll();
      setStaffList(res.data?.data?.staff || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => {
    setSlots([
      ...slots,
      { startTime: "", endTime: "", staffId: "" }
    ]);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!activityName.trim()) return setError("Activity name required");
    if (!capacity || Number(capacity) <= 0)
      return setError("Valid capacity required");

    for (let slot of slots) {
      if (!slot.startTime || !slot.endTime || !slot.staffId) {
        return setError("Fill all slot fields");
      }
    }

    try {
      setSaving(true);
      const payload = {
        name: activityName.trim(),
        capacity: Number(capacity),
        slots
      };

      if (editData) {
        await api.fitnessActivities.update(editData._id, payload);
        toast.success("Updated");
      } else {
        await api.fitnessActivities.create(payload);
        toast.success("Added");
        setActivityName("");
        setCapacity("");
        setSlots([{ startTime: "", endTime: "", staffId: "" }]);
      }

      onSaved?.();
    } catch (err) {
      const msg = err?.response?.data?.message || "Error";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800">
          {editData ? "Edit Activity" : "Add Activity"}
        </h2>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Activity Name"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            className="input"
          />

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="input"
          />
        </div>

        {/* Slots */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Time Slots
            </h3>

            <button
              onClick={addSlot}
              className="text-sm text-[#000359] font-medium hover:underline"
            >
              + Add Slot
            </button>
          </div>

          {slots.map((slot, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
            >
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  handleSlotChange(index, "startTime", e.target.value)
                }
                className="input"
              />

              <span className="text-gray-400">→</span>

              <input
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  handleSlotChange(index, "endTime", e.target.value)
                }
                className="input"
              />

              <select
                value={slot.staffId}
                onChange={(e) =>
                  handleSlotChange(index, "staffId", e.target.value)
                }
                className="input"
              >
                <option value="">Instructor</option>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.fullName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => removeSlot(index)}
                className="text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-[#000359] text-white rounded-lg"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Reusable input style */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: #000359;
          box-shadow: 0 0 0 2px rgba(0, 3, 89, 0.1);
        }
      `}</style>
    </div>
  );
}











// _________________ DO NOT Delete ___________
// ____________Members Only Check box ______________


// // pages/fitnessClub/Activities/AddActivity.jsx
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { api } from "../../../services/apiClient";

// export default function AddActivity({ onCancel, onSaved, editData }) {
//   const [activityName, setActivityName] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [staffList, setStaffList] = useState([]);

//   const [slots, setSlots] = useState([
//     { startTime: "", endTime: "", staffId: "", membersOnly: true }
//   ]);

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   useEffect(() => {
//     if (editData) {
//       setActivityName(editData.name || "");
//       setCapacity(editData.capacity || "");
//       setSlots(
//         editData.slots?.map((slot) => ({
//           startTime: slot.startTime || "",
//           endTime: slot.endTime || "",
//           staffId: slot.staffId || "",
//           membersOnly: slot.membersOnly ?? true
//         })) || [{ startTime: "", endTime: "", staffId: "", membersOnly: true }]
//       );
//     }
//   }, [editData]);

//   const fetchStaff = async () => {
//     try {
//       const res = await api.fitnessStaff.getAll();
//       setStaffList(res.data?.data?.staff || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSlotChange = (index, field, value) => {
//     const updated = [...slots];
//     updated[index][field] = value;
//     setSlots(updated);
//   };

//   const addSlot = () => {
//     setSlots([
//       ...slots,
//       { startTime: "", endTime: "", staffId: "", membersOnly: true }
//     ]);
//   };

//   const removeSlot = (index) => {
//     setSlots(slots.filter((_, i) => i !== index));
//   };

//   const handleSave = async () => {
//     if (!activityName.trim()) return setError("Activity name required");
//     if (!capacity || Number(capacity) <= 0)
//       return setError("Valid capacity required");

//     for (let slot of slots) {
//       if (!slot.startTime || !slot.endTime || !slot.staffId) {
//         return setError("Fill all slot fields");
//       }
//     }

//     try {
//       setSaving(true);
//       const payload = {
//         name: activityName.trim(),
//         capacity: Number(capacity),
//         slots
//       };

//       if (editData) {
//         await api.fitnessActivities.update(editData._id, payload);
//         toast.success("Updated");
//       } else {
//         await api.fitnessActivities.create(payload);
//         toast.success("Added");
//         setActivityName("");
//         setCapacity("");
//         setSlots([
//           { startTime: "", endTime: "", staffId: "", membersOnly: true }
//         ]);
//       }

//       onSaved?.();
//     } catch (err) {
//       const msg = err?.response?.data?.message || "Error";
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

//         {/* Header */}
//         <h2 className="text-lg font-semibold text-gray-800">
//           {editData ? "Edit Activity" : "Add Activity"}
//         </h2>

//         {/* Inputs */}
//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="text"
//             placeholder="Activity Name"
//             value={activityName}
//             onChange={(e) => setActivityName(e.target.value)}
//             className="input"
//           />

//           <input
//             type="number"
//             placeholder="Capacity"
//             value={capacity}
//             onChange={(e) => setCapacity(e.target.value)}
//             className="input"
//           />
//         </div>

//         {/* Slots */}
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">
//               Time Slots
//             </h3>

//             <button
//               onClick={addSlot}
//               className="text-sm text-[#000359] font-medium hover:underline"
//             >
//               + Add Slot
//             </button>
//           </div>

//           {slots.map((slot, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
//             >
//               <input
//                 type="time"
//                 value={slot.startTime}
//                 onChange={(e) =>
//                   handleSlotChange(index, "startTime", e.target.value)
//                 }
//                 className="input"
//               />

//               <span className="text-gray-400">→</span>

//               <input
//                 type="time"
//                 value={slot.endTime}
//                 onChange={(e) =>
//                   handleSlotChange(index, "endTime", e.target.value)
//                 }
//                 className="input"
//               />

//               <select
//                 value={slot.staffId}
//                 onChange={(e) =>
//                   handleSlotChange(index, "staffId", e.target.value)
//                 }
//                 className="input"
//               >
//                 <option value="">Instructor</option>
//                 {staffList.map((s) => (
//                   <option key={s._id} value={s._id}>
//                     {s.fullName}
//                   </option>
//                 ))}
//               </select>

//               <label className="flex items-center gap-2 text-xs text-gray-600">
//   <input
//     type="checkbox"
//     checked={slot.membersOnly}
//     onChange={(e) =>
//       handleSlotChange(index, "membersOnly", e.target.checked)
//     }
//     className="w-4 h-4 accent-[#000359]"
//   />
//   Members only
// </label>

//               <button
//                 onClick={() => removeSlot(index)}
//                 className="text-gray-400 hover:text-red-500"
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>

//         {error && (
//           <p className="text-red-500 text-sm text-center">{error}</p>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 text-sm border rounded-lg"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="px-5 py-2 text-sm bg-[#000359] text-white rounded-lg"
//           >
//             {saving ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>

//       {/* Reusable input style */}
//       <style jsx>{`
//         .input {
//           width: 100%;
//           padding: 8px 10px;
//           border-radius: 8px;
//           border: 1px solid #e5e7eb;
//           font-size: 14px;
//           outline: none;
//         }
//         .input:focus {
//           border-color: #000359;
//           box-shadow: 0 0 0 2px rgba(0, 3, 89, 0.1);
//         }
//       `}</style>
//     </div>
//   );
// }








