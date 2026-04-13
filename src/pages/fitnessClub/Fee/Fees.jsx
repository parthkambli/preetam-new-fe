// // pages/school/Fees/Fees.jsx

// import { useState } from 'react';
// import FeesTabs    from './FeesTabs';
// import AddPayments from './AddPayments';
// import AllotFees   from './AllotFees';
// import FeeTypes    from './FeeTypes';

// const statCards = [
//   {
//     value: '80',
//     label: 'Total Participants',
//     border: 'border-gray-300',
//     valueColor: 'text-gray-800',
//   },
//   {
//     value: '₹ 3,42,400',
//     label: 'Total Fee Assigned (₹)',
//     border: 'border-green-500',
//     valueColor: 'text-gray-800',
//   },
//   {
//     value: '₹ 3,40,000',
//     label: 'Total Collected (₹)',
//     border: 'border-red-400',
//     valueColor: 'text-gray-800',
//   },
// ];

// export default function Fees() {
//   const [activeTab, setActiveTab] = useState('add-payments');

//   return (
//     <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 font-sans">

//       {/* Title + Tabs */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <h1 className="text-xl font-semibold text-gray-800">Fees</h1>
//         <FeesTabs activeTab={activeTab} onTabChange={setActiveTab} />
//       </div>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {statCards.map((card) => (
//           <div
//             key={card.label}
//             className={`rounded-lg border-2 ${card.border} bg-white px-6 py-5`}
//           >
//             <p className={`text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
//             <p className="text-xs text-gray-500 mt-1">{card.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Tab Content */}
//       {activeTab === 'add-payments' && <AddPayments />}
//       {activeTab === 'allot-fees'   && <AllotFees />}
//       {activeTab === 'fee-types'    && <FeeTypes />}
//     </div>
//   );
// }





import { useEffect, useState } from 'react';
import FitnessFeesTabs from './Feestabs';
import AddPayments from './AddPayments';
import AllotFees from './AllotFees';
import FitnessFeeTypes from './Feetypes';
import { api } from '../../../services/apiClient';

export default function FitnessFees() {
  const [activeTab, setActiveTab] = useState('allot-fees');

  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAssigned: 0,
    totalCollected: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.fitnessFees.getStats();

        console.log("STATS:", res.data); // debug once

        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Stats error:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 font-sans">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-800">
          Fitness Fees / Membership
        </h1>
        <FitnessFeesTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* ✅ REAL DATA CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="rounded-lg border-2 border-gray-300 bg-white px-6 py-5">
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalMembers}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Members</p>
        </div>

        <div className="rounded-lg border-2 border-green-500 bg-white px-6 py-5">
          <p className="text-2xl font-bold text-gray-800">
            ₹ {stats.totalAssigned}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total Fee Assigned (₹)
          </p>
        </div>

        <div className="rounded-lg border-2 border-red-400 bg-white px-6 py-5">
          <p className="text-2xl font-bold text-gray-800">
            ₹ {stats.totalCollected}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total Collected (₹)
          </p>
        </div>

      </div>

      {activeTab === 'add-payments' && <AddPayments />}
      {activeTab === 'allot-fees' && <AllotFees />}
      {activeTab === 'fee-types' && <FitnessFeeTypes />}

    </div>
  );
}