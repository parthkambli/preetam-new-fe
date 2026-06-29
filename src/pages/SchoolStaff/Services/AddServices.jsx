import { useState, useEffect } from "react";
import { api } from '../../../services/apiClient';

export default function AddServices({ onCancel, onSaved, editData }) {
  const [serviceName, setServiceName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [oneDayFee, setOneDayFee] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      setServiceName(editData.serviceName || "");
      setCapacity(editData.capacity || "");
      setOneDayFee(editData.oneDayFee || "");
    } else {
      setServiceName("");
      setCapacity("");
      setOneDayFee("");
    }
  }, [editData]);

  const handleSave = async () => {
    try {
      if (!serviceName.trim()) {
        return setError("Service name required");
      }

      if (!capacity || Number(capacity) <= 0) {
        return setError("Valid capacity required");
      }

      if (!oneDayFee || Number(oneDayFee) <= 0) {
        return setError("Valid fee amount required");
      }

      setError("");
      setSaving(true);

      const payload = {
        serviceName: serviceName.trim(),
        capacity: Number(capacity),
        oneDayFee: Number(oneDayFee),
      };

      let response;

      if (editData?._id) {
        response = await api.schoolStaffPanel.updateService(
          editData._id,
          payload
        );
      } else {
        response = await api.schoolStaffPanel.createService(
          payload
        );
      }

      if (!editData) {
        setServiceName("");
        setCapacity("");
        setOneDayFee("");
      }

      onSaved?.(response?.data?.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to save service"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {editData ? "Edit Service" : "Add Service"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="input"
          />

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="input"
            min="1"
          />

          <input
            type="number"
            placeholder="Fee Amount"
            value={oneDayFee}
            onChange={(e) => setOneDayFee(e.target.value)}
            className="input"
            min="0"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-[#000359] text-white rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

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


// import { useState, useEffect } from "react";

// export default function AddServices({ onCancel, onSaved, editData }) {
//   const [activityName, setActivityName] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [feeAmount, setFeeAmount] = useState("");
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (editData) {
//       setActivityName(editData.name || "");
//       setCapacity(editData.capacity || "");
//       setFeeAmount(editData.feeAmount || "");
//     }
//   }, [editData]);

//   const handleSave = () => {
//     if (!activityName.trim()) {
//       return setError("Service name required");
//     }

//     if (!capacity || Number(capacity) <= 0) {
//       return setError("Valid capacity required");
//     }

//     if (!feeAmount || Number(feeAmount) <= 0) {
//       return setError("Valid fee amount required");
//     }

//     setError("");
//     setSaving(true);

//     // Simulate save delay
//     setTimeout(() => {
//       setSaving(false);

//       if (!editData) {
//         setActivityName("");
//         setCapacity("");
//         setFeeAmount("");
//       }

//       onSaved?.({
//         name: activityName,
//         capacity: Number(capacity),
//         feeAmount: Number(feeAmount),
//       });
//     }, 500);
//   };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
//         <h2 className="text-lg font-semibold text-gray-800">
//           {editData ? "Edit Service" : "Add Service"}
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <input
//             type="text"
//             placeholder="Service Name"
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
//             min="1"
//           />

//           <input
//             type="number"
//             placeholder="Fee Amount"
//             value={feeAmount}
//             onChange={(e) => setFeeAmount(e.target.value)}
//             className="input"
//             min="0"
//           />
//         </div>

//         {error && (
//           <p className="text-red-500 text-sm text-center">{error}</p>
//         )}

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="px-5 py-2 text-sm bg-[#000359] text-white rounded-lg disabled:opacity-50"
//           >
//             {saving ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>

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
















// // Activity api removed and using service dummy data----------------------------------
// import { useState, useEffect } from "react";
// import Select from "react-select";

// const DUMMY_FEE_TYPES = [
//   { _id: 'fee1', description: 'Standard Fee' },
//   { _id: 'fee2', description: 'Premium Fee' },
// ];

// const DUMMY_STAFF = [
//   { _id: 'st1', fullName: 'Rahul Sharma', role: 'Coach' },
//   { _id: 'st2', fullName: 'Priya Mehta', role: 'Instructor' },
//   { _id: 'st3', fullName: 'Anita Joshi', role: 'Instructor' },
//   { _id: 'st4', fullName: 'Vikram Singh', role: 'Coach' },
// ];

// export default function AddServices({ onCancel, onSaved, editData }) {
//   const [activityName, setActivityName] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);

//   const [selectedFeeType, setSelectedFeeType] = useState(null);

//   const [slots, setSlots] = useState([
//     { startTime: "", endTime: "", staffId: "", staffName: "" }
//   ]);

//   useEffect(() => {
//     if (editData) {
//       setActivityName(editData.name || "");
//       setCapacity(editData.capacity || "");
//       setSlots(
//         editData.slots?.map((slot) => ({
//           _id: slot._id,
//           startTime: slot.startTime || "",
//           endTime: slot.endTime || "",
//           staffId:
//             typeof slot.staffId === "object"
//               ? slot.staffId._id
//               : slot.staffId || "",
//           staffName:
//             typeof slot.staffId === "object"
//               ? `${slot.staffId.fullName} (${slot.staffId.role || "Staff"})`
//               : "",
//         })) || [{ startTime: "", endTime: "", staffId: "", staffName: "" }]
//       );
//       setSelectedFeeType(
//         editData.feeTypeId
//           ? { value: editData.feeTypeId._id, label: editData.feeTypeId.description }
//           : null
//       );
//     }
//   }, [editData]);

//   const staffOptions = DUMMY_STAFF.map((s) => ({
//     value: s._id,
//     label: `${s.fullName} (${s.role})`,
//   }));

//   const feeTypeOptions = DUMMY_FEE_TYPES.map((fee) => ({
//     value: fee._id,
//     label: fee.description,
//   }));

//   const handleSlotChange = (index, field, value) => {
//     const updated = [...slots];
//     updated[index][field] = value;
//     setSlots(updated);
//   };

//   const addSlot = () => {
//     setSlots([...slots, { startTime: "", endTime: "", staffId: "", staffName: "" }]);
//   };

//   const removeSlot = (index) => {
//     setSlots(slots.filter((_, i) => i !== index));
//   };

//   const handleSave = () => {
//     if (!activityName.trim()) return setError("Activity name required");
//     if (!capacity || Number(capacity) <= 0) return setError("Valid capacity required");
//     if (!selectedFeeType) return setError("Fee type required");
//     for (let slot of slots) {
//       if (!slot.startTime || !slot.endTime || !slot.staffId) {
//         return setError("Fill all slot fields");
//       }
//     }

//     setError("");
//     setSaving(true);

//     // Simulate save delay
//     setTimeout(() => {
//       setSaving(false);
//       if (!editData) {
//         setActivityName("");
//         setCapacity("");
//         setSelectedFeeType(null);
//         setSlots([{ startTime: "", endTime: "", staffId: "", staffName: "" }]);
//       }
//       onSaved?.();
//     }, 500);
//   };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

//         <h2 className="text-lg font-semibold text-gray-800">
//           {editData ? "Edit Service" : "Add Service"}
//         </h2>

//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="text"
//             placeholder="Service Name"
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

//         <div>
//           <label className="block text-sm font-medium text-gray-600 mb-2">
//             Fee Type
//           </label>
//           <Select
//             options={feeTypeOptions}
//             value={selectedFeeType}
//             onChange={setSelectedFeeType}
//             placeholder="Select Fee Type"
//             classNamePrefix="react-select"
//             className="text-sm"
//           />
//         </div>

//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium text-gray-600">Time Slots</h3>
//             <button
//               onClick={addSlot}
//               className="text-sm text-[#000359] font-medium hover:underline"
//             >
//               + Add Slot
//             </button>
//           </div>

//           {slots.map((slot, index) => (
//             <div
//               key={slot._id || index}
//               className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
//             >
//               <input
//                 type="time"
//                 value={slot.startTime}
//                 onChange={(e) => handleSlotChange(index, "startTime", e.target.value)}
//                 className="input"
//               />
//               <span className="text-gray-400">→</span>
//               <input
//                 type="time"
//                 value={slot.endTime}
//                 onChange={(e) => handleSlotChange(index, "endTime", e.target.value)}
//                 className="input"
//               />
//               <Select
//                 options={staffOptions}
//                 value={
//                   slot.staffId
//                     ? { value: slot.staffId, label: slot.staffName }
//                     : null
//                 }
//                 onChange={(selected) => {
//                   const updated = [...slots];
//                   updated[index].staffId = selected ? selected.value : "";
//                   updated[index].staffName = selected ? selected.label : "";
//                   setSlots(updated);
//                 }}
//                 placeholder="Select Instructor"
//                 isClearable
//                 className="w-full"
//                 classNamePrefix="react-select"
//               />
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