// import { useEffect, useState } from 'react';
// import { api } from '../../services/apiClient';

// export default function FitnessDashboard() {
//   const [data, setData] = useState({
//     totalMembers: 0,
//     activeMembers: 0,
//     monthlyRevenue: 0,
//     pendingFees: 0,
//     pendingList: [],
//   });

//   const [schedules, setSchedules] = useState([]);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
// const today = new Date();

// // First day of current month
// const fromDate = new Date(today.getFullYear(), today.getMonth(), 1)
//   .toISOString()
//   .split('T')[0];

// // Today (or use end of month if you want projection)
// const toDate = today.toISOString().split('T')[0];

// const res = await api.dashboard.get({
//   fromDate,
//   toDate,
// });
//         const dashboardData = res?.data?.data || res?.data || {};

//         setData({
//           totalMembers: dashboardData.totalMembers || 0,
//           activeMembers: dashboardData.activeMembers || 0,
//           monthlyRevenue: dashboardData.monthlyRevenue || 0,
//           pendingFees: dashboardData.pendingFees || 0,
//           pendingList: dashboardData.pendingList || [],
//         });
//       } catch (err) {
//         console.log('Dashboard API Error:', err?.response?.data || err.message);
//       }
//     };

//     const fetchTodaySchedules = async () => {
//       try {
//         const res = await api.dashboard.getTodaySchedules();

//         const scheduleData = Array.isArray(res?.data)
//           ? res.data
//           : Array.isArray(res?.data?.data)
//           ? res.data.data
//           : [];

//         const today = new Date();
//         const todayStr = today.toISOString().split('T')[0];

//         const filteredSchedules = scheduleData
//           .filter((item) => {
//             if (!item?.scheduleDate) return false;
//             const itemDate = new Date(item.scheduleDate).toISOString().split('T')[0];
//             return itemDate === todayStr;
//           })
//           .sort((a, b) => (a?.time || '').localeCompare(b?.time || ''));

//         setSchedules(filteredSchedules);
//       } catch (err) {
//         console.log('Today Schedule API Error:', err?.response?.data || err.message);
//         setSchedules([]);
//       }
//     };

//     fetchDashboard();
//     fetchTodaySchedules();
//   }, []);

//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Total Members</h3>
//           <p className="text-4xl font-bold text-[#000359] mt-2">
//             {data.totalMembers}
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Active Members</h3>
//           <p className="text-4xl font-bold text-green-600 mt-2">
//             {data.activeMembers}
//           </p>
//         </div>

//         {/* <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Monthly Revenue</h3>
//           <p className="text-4xl font-bold text-[#000359] mt-2">
//             ₹{data.monthlyRevenue}
//           </p>
//         </div> */}

//         {/* <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Pending Fees</h3>
//           <p className="text-4xl font-bold text-red-600 mt-2">
//             ₹{data.pendingFees}
//           </p>
//         </div> */}
//       </div>

//       <div className="bg-white p-6 rounded-xl shadow">
//         <h3 className="text-xl font-bold mb-4">Today's Schedule Activities</h3>

//         {schedules.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//          {schedules.map((item, index) => (
//   <div
//     key={item._id || index}
//     className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm"
//   >
//     <p className="text-lg font-semibold text-gray-800">
//       {item.activityId?.name ||
//         item.activity?.name ||
//         item.activityName ||
//         'Activity'}
//     </p>

//     <p className="text-base text-gray-700 mt-2">
//       {item.startTime || item.time || '-'}
//     </p>
//   </div>
// ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No schedules for today</p>
//         )}
//       </div>

//       {/* <div className="bg-white p-6 rounded-xl shadow">
//         <h3 className="text-xl font-bold mb-4">Pending Fees Summary</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-3 text-left">Member Name</th>
//                 <th className="p-3 text-left">Plan</th>
//                 <th className="p-3 text-left">Due Amount</th>
//                 <th className="p-3 text-left">Due Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.pendingList?.length > 0 ? (
//                 data.pendingList.map((item, index) => (
//                   <tr className="border-t" key={item._id || index}>
//                     <td className="p-3">
//                       {item.memberId?.name || item.memberName || '-'}
//                     </td>
//                     <td className="p-3">{item.plan || '-'}</td>
//                     <td className="p-3 text-red-600">₹{item.amount || 0}</td>
//                     <td className="p-3">
//                       {item.dueDate
//                         ? new Date(item.dueDate).toLocaleDateString('en-GB', {
//                             day: '2-digit',
//                             month: 'short',
//                             year: 'numeric',
//                           })
//                         : '-'}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr className="border-t">
//                   <td colSpan="4" className="p-3 text-center text-gray-500">
//                     No pending fees found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div> */}
//     </div>
//   );
// }






















///// working code 

// import { useEffect, useState } from 'react';
// import { api } from '../../services/apiClient';

// export default function FitnessDashboard() {
//   const [data, setData] = useState({
//     totalMembers: 0,
//     activeMembers: 0,
//     monthlyRevenue: 0,
//     pendingFees: 0,
//     pendingList: [],
//   });

//   const [schedules, setSchedules] = useState([]);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const today = new Date();

//         const fromDate = new Date(today.getFullYear(), today.getMonth(), 1)
//           .toISOString()
//           .split('T')[0];

//         const toDate = today.toISOString().split('T')[0];

//         const res = await api.dashboard.get({
//           fromDate,
//           toDate,
//         });

//         const dashboardData = res?.data?.data || res?.data || {};

//         setData({
//           totalMembers: dashboardData.totalMembers || 0,
//           activeMembers: dashboardData.activeMembers || 0,
//           monthlyRevenue: dashboardData.monthlyRevenue || 0,
//           pendingFees: dashboardData.pendingFees || 0,
//           pendingList: dashboardData.pendingList || [],
//         });
//       } catch (err) {
//         console.log('Dashboard API Error:', err?.response?.data || err.message);
//       }
//     };

//     const fetchTodaySchedules = async () => {
//       try {
//         // Book Activity bookings se data lao
//         const res = await api.fitnessActivities.getBookings();

//         const bookingData =
//           res?.data?.data ||
//           res?.data?.bookings ||
//           res?.data ||
//           [];

//         const today = new Date().toISOString().split('T')[0];

//         const filteredSchedules = Array.isArray(bookingData)
//           ? bookingData
//               .filter((item) => {
//                 if (!item?.date) return false;

//                 // item.date expected format: YYYY-MM-DD
//                 const itemDate = String(item.date).split('T')[0];
//                 return itemDate === today;
//               })
//               .sort((a, b) =>
//                 String(a?.slotTime || '').localeCompare(String(b?.slotTime || ''))
//               )
//           : [];

//         setSchedules(filteredSchedules);
//       } catch (err) {
//         console.log(
//           'Today Booking Activity Error:',
//           err?.response?.data || err.message
//         );
//         setSchedules([]);
//       }
//     };

//     fetchDashboard();
//     fetchTodaySchedules();
//   }, []);

//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Total Members</h3>
//           <p className="text-4xl font-bold text-[#000359] mt-2">
//             {data.totalMembers}
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold text-gray-700">Active Members</h3>
//           <p className="text-4xl font-bold text-green-600 mt-2">
//             {data.activeMembers}
//           </p>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-xl shadow">
//         <h3 className="text-xl font-bold mb-4">Today's Schedule Activities</h3>

//         {schedules.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {schedules.map((item, index) => (
//               <div
//                 key={item._id || index}
//                 className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm"
//               >
//                 <p className="text-lg font-semibold text-gray-800">
//                   {item.activityName || 'Activity'}
//                 </p>

//                 <p className="text-sm text-gray-600 mt-2">
//                   Member: <span className="font-medium">{item.customerName || '-'}</span>
//                 </p>

//                 <p className="text-sm text-gray-600 mt-1">
//                   Slot: <span className="font-medium">{item.slotTime || '-'}</span>
//                 </p>

//                 <p className="text-sm text-gray-600 mt-1">
//                   Date: <span className="font-medium">{item.date || '-'}</span>
//                 </p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No schedules for today</p>
//         )}
//       </div>
//     </div>
//   );
// }







///////




import { useEffect, useState } from 'react';
import { api } from '../../services/apiClient';

export default function FitnessDashboard() {
  const [data, setData] = useState({
    totalMembers: 0,
    activeMembers: 0,
  });

  const [schedules, setSchedules] = useState([]);

  const formatLocalDate = (value) => {
    if (!value) return '';

    // Agar already YYYY-MM-DD hai to wahi return karo
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const today = new Date();

        const fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const fromDateStr = formatLocalDate(fromDate);
        const toDateStr = formatLocalDate(today);

        const res = await api.dashboard.get({
          fromDate: fromDateStr,
          toDate: toDateStr,
        });

        const dashboardData = res?.data?.data || res?.data || {};

        setData({
          totalMembers: dashboardData.totalMembers || 0,
          activeMembers: dashboardData.activeMembers || 0,
        });
      } catch (err) {
        console.log('Dashboard API Error:', err?.response?.data || err.message);
      }
    };

    const fetchTodaySchedules = async () => {
      try {
        const res = await api.fitnessActivities.getBookings();

        const bookingData =
          res?.data?.data ||
          res?.data?.bookings ||
          res?.data ||
          [];

        const todayStr = formatLocalDate(new Date());

        console.log('All booking data:', bookingData);
        console.log('Today local date:', todayStr);

        const filteredSchedules = Array.isArray(bookingData)
          ? bookingData
              .filter((item) => {
                const itemDate = formatLocalDate(item?.date);
                console.log('Booking item date:', item?.date, '=>', itemDate);

                return itemDate === todayStr;
              })
              .sort((a, b) =>
                String(a?.slotTime || '').localeCompare(String(b?.slotTime || ''))
              )
          : [];

        console.log('Filtered today bookings:', filteredSchedules);

        setSchedules(filteredSchedules);
      } catch (err) {
        console.log(
          'Today Booking Error:',
          err?.response?.data || err.message
        );
        setSchedules([]);
      }
    };

    fetchDashboard();
    fetchTodaySchedules();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Members</h3>
          <p className="text-4xl font-bold text-[#000359] mt-2">
            {data.totalMembers}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active Members</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {data.activeMembers}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Today's Schedule Activities</h3>

        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#000359' }}>
                <th className="text-left px-5 py-3 text-white font-semibold">
                  Member Name
                </th>
                <th className="text-left px-5 py-3 text-white font-semibold">
                  Activity
                </th>
                <th className="text-left px-5 py-3 text-white font-semibold">
                  Slot Time
                </th>
                <th className="text-left px-5 py-3 text-white font-semibold">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {schedules.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">
                    No schedules for today
                  </td>
                </tr>
              )}

              {schedules.map((item, index) => (
                <tr
                  key={item._id || index}
                  className={`transition-colors hover:bg-blue-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-5 py-4 font-semibold text-gray-800">
                    {item.customerName || '-'}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.activityName || '-'}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.slotTime || '-'}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatLocalDate(item.date) || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
