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








// pages/school/Fees/Fees.jsx

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';
import FeesTabs    from './FeesTabs';
import AddPayments from './AddPayments';
import AllotFees   from './AllotFees';
import FeeTypes    from './FeeTypes';

export default function Fees() {
  const [activeTab, setActiveTab] = useState('add-payments');
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalAssigned: 0,
    totalCollected: 0,
  });

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const [allotRes, payRes] = await Promise.all([
        api.fees.getAllotments(),
        api.fees.getPayments(),
      ]);

      const allotments = allotRes.data || [];
      const payments   = payRes.data  || [];

      // Unique participants (by studentId)
      const uniqueStudents = new Set(
        allotments.map((a) => a.studentId?._id || a.studentId).filter(Boolean)
      );
      const totalAssigned  = allotments.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
      const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      setStats({
        totalParticipants: uniqueStudents.size,
        totalAssigned,
        totalCollected,
      });
    } catch (err) {
      // Stats are non-critical — fail silently, don't disrupt the page
      console.error('Failed to load fee stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Re-fetch stats whenever the user switches tabs (new payment/allotment may have been added)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchStats();
  };

  const fmt = (n) =>
    '₹ ' + Number(n).toLocaleString('en-IN');

  const statCards = [
    {
      value:      statsLoading ? '—' : stats.totalParticipants,
      label:      'Total Participants',
      border:     'border-gray-300',
      valueColor: 'text-gray-800',
    },
    {
      value:      statsLoading ? '—' : fmt(stats.totalAssigned),
      label:      'Total Fee Assigned (₹)',
      border:     'border-green-500',
      valueColor: 'text-gray-800',
    },
    {
      value:      statsLoading ? '—' : fmt(stats.totalCollected),
      label:      'Total Collected (₹)',
      border:     'border-red-400',
      valueColor: 'text-gray-800',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 font-sans">

      {/* Title + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-800">Fees</h1>
        <FeesTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg border-2 ${card.border} bg-white px-6 py-5`}
          >
            <p className={`text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'add-payments' && <AddPayments onSuccess={fetchStats} />}
      {activeTab === 'allot-fees'   && <AllotFees   onSuccess={fetchStats} />}
      {activeTab === 'fee-types'    && <FeeTypes />}
    </div>
  );
}