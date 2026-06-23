
// Activity wala duplicate he ------------------------------------------------
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
// import { api } from '../../../services/apiClient';

// export default function ServiceManager({ onEdit }) {
//   const [activities, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchServices = async () => {
//     try {
//       const res = await api.fitnessServices.getAll();
//       setServices(res.data.data || []);
//     } catch (err) {
//       toast.error('Failed to load activities');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       'Delete this activity? This will remove all slots.'
//     );

//     if (!confirmDelete) return;

//     try {
//       await api.fitnessServices.delete(id);
//       toast.success('Service deleted');
//       fetchServices();
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message || 'Delete failed'
//       );
//     }
//   };
// return (
//   <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
    
//     <table className="w-full text-sm">
      
//       {/* HEADER */}
//       <thead>
//         <tr className="bg-[#000359] text-white">
//           <th className="px-6 py-3 text-left font-medium">Service</th>
//           <th className="px-6 py-3 text-left font-medium">Slots</th>
//           <th className="px-6 py-3 text-left font-medium">Capacity</th>
//           <th className="px-6 py-3 text-left font-medium">Action</th>
//         </tr>
//       </thead>

//       {/* BODY */}
//       <tbody className="divide-y">
//         {loading ? (
//           <tr>
//             <td colSpan={4} className="text-center py-10 text-gray-400">
//               Loading...
//             </td>
//           </tr>
//         ) : activities.length === 0 ? (
//           <tr>
//             <td colSpan={4} className="text-center py-10 text-gray-400">
//               No activities found
//             </td>
//           </tr>
//         ) : (
//           activities.map((a) => (
//             <tr
//               key={a._id}
//               className="hover:bg-gray-50 transition"
//             >
//               {/* Service */}
//               <td className="px-6 py-4 font-medium text-gray-800">
//                 {a.name}
//               </td>

//               {/* Slots */}
//               <td className="px-6 py-4">
//                 <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
//                   {a.slots?.length || 0}
//                 </span>
//               </td>

//               {/* Capacity */}
//               <td className="px-6 py-4">
//                 <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
//                   {a.capacity || 0}
//                 </span>
//               </td>

//               {/* Actions */}
//               <td className="px-6 py-4">
//                 <div className="flex gap-2">
                  
//                   <button
//                     onClick={() => onEdit(a)}
//                     className="px-3 py-1.5 text-xs rounded-md bg-[#000359] text-white hover:opacity-90"
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleDelete(a._id)}
//                     className="px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-600 hover:bg-red-200"
//                   >
//                     Delete
//                   </button>

//                 </div>
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>

//     </table>
//   </div>
// );
// }












// nnew uii --->
// // Activity api removed and using service dummy data----------------------------------
// import { useState } from 'react';

// const DUMMY_SERVICES = [
//   {
//     _id: 'svc1',
//     name: 'Swimming',
//     capacity: 20,
//     slots: [
//       { _id: 'slot1', startTime: '08:00', endTime: '09:00', staffId: { _id: 'st1', fullName: 'Rahul Sharma', role: 'Coach' } },
//       { _id: 'slot2', startTime: '10:00', endTime: '11:00', staffId: { _id: 'st2', fullName: 'Priya Mehta', role: 'Instructor' } },
//       { _id: 'slot3', startTime: '14:00', endTime: '15:00', staffId: { _id: 'st1', fullName: 'Rahul Sharma', role: 'Coach' } },
//     ],
//     feeTypeId: { _id: 'fee1', description: 'Standard Fee' },
//   },
//   {
//     _id: 'svc2',
//     name: 'Yoga',
//     capacity: 15,
//     slots: [
//       { _id: 'slot4', startTime: '07:00', endTime: '08:00', staffId: { _id: 'st3', fullName: 'Anita Joshi', role: 'Instructor' } },
//       { _id: 'slot5', startTime: '17:00', endTime: '18:00', staffId: { _id: 'st3', fullName: 'Anita Joshi', role: 'Instructor' } },
//     ],
//     feeTypeId: { _id: 'fee2', description: 'Premium Fee' },
//   },
//   {
//     _id: 'svc3',
//     name: 'Basketball',
//     capacity: 30,
//     slots: [
//       { _id: 'slot6', startTime: '09:00', endTime: '10:30', staffId: { _id: 'st4', fullName: 'Vikram Singh', role: 'Coach' } },
//       { _id: 'slot7', startTime: '15:00', endTime: '16:30', staffId: { _id: 'st4', fullName: 'Vikram Singh', role: 'Coach' } },
//     ],
//     feeTypeId: { _id: 'fee1', description: 'Standard Fee' },
//   },
// ];

// export default function ServiceManager({ onEdit }) {
//   const [activities, setServices] = useState(DUMMY_SERVICES);

//   const handleDelete = (id) => {
//     const confirmDelete = window.confirm(
//       'Delete this activity? This will remove all slots.'
//     );
//     if (!confirmDelete) return;
//     setServices((prev) => prev.filter((a) => a._id !== id));
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="bg-[#000359] text-white">
//             <th className="px-6 py-3 text-left font-medium">Service</th>
//             <th className="px-6 py-3 text-left font-medium">Slots</th>
//             <th className="px-6 py-3 text-left font-medium">Capacity</th>
//             <th className="px-6 py-3 text-left font-medium">Action</th>
//           </tr>
//         </thead>

//         <tbody className="divide-y">
//           {activities.length === 0 ? (
//             <tr>
//               <td colSpan={4} className="text-center py-10 text-gray-400">
//                 No activities found
//               </td>
//             </tr>
//           ) : (
//             activities.map((a) => (
//               <tr key={a._id} className="hover:bg-gray-50 transition">
//                 <td className="px-6 py-4 font-medium text-gray-800">{a.name}</td>
//                 <td className="px-6 py-4">
//                   <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
//                     {a.slots?.length || 0}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
//                     {a.capacity || 0}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => onEdit(a)}
//                       className="px-3 py-1.5 text-xs rounded-md bg-[#000359] text-white hover:opacity-90"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(a._id)}
//                       className="px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-600 hover:bg-red-200"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// <-- ui

import { useEffect, useState } from "react";
import { api } from '../../../services/apiClient';
export default function ServiceManager({ onEdit }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const res = await api.schoolStaffPanel.getServices();

      setServices(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this service?"
    );

    if (!confirmDelete) return;

    try {
      await api.schoolStaffPanel.deleteService(id);
      fetchServices();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to delete service"
      );
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      await api.schoolStaffPanel.toggleServiceStatus(
        service._id,
        !service.isActive
      );

      fetchServices();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#000359] text-white">
  <th className="px-6 py-3 text-left font-medium">
    Service
  </th>

  <th className="px-6 py-3 text-left font-medium">
    Capacity
  </th>

  <th className="px-6 py-3 text-left font-medium">
    Fee / Day
  </th>

  <th className="px-6 py-3 text-left font-medium">
    Status
  </th>

  <th className="px-6 py-3 text-left font-medium">
    Action
  </th>
</tr>
        </thead>

        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-10 text-gray-400"
              >
                Loading...
              </td>
            </tr>
          ) : services.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-10 text-gray-400"
              >
                No services found
              </td>
            </tr>
          ) : (
            services.map((service) => (
              <tr
                key={service._id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {service.serviceName}
                </td>

                <td className="px-6 py-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    {service.capacity || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
  ₹{service.oneDayFee}
</td>

                <td className="px-6 py-4">
  <button
    onClick={() => handleToggleStatus(service)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      service.isActive
        ? "bg-green-500"
        : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        service.isActive
          ? "translate-x-6"
          : "translate-x-1"
      }`}
    />
  </button>
</td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(service)}
                      className="px-3 py-1.5 text-xs rounded-md bg-[#000359] text-white hover:opacity-90"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(service._id)
                      }
                      className="px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}