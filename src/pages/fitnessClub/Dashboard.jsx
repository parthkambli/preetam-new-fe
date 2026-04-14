import { useEffect, useState } from 'react';
import { api } from '../../services/apiClient';

export default function FitnessDashboard() {
  const [data, setData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    pendingFees: 0,
    pendingList: [],
  });

  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.dashboard.get();

        const dashboardData = res?.data?.data || res?.data || {};

        setData({
          totalMembers: dashboardData.totalMembers || 0,
          activeMembers: dashboardData.activeMembers || 0,
          monthlyRevenue: dashboardData.monthlyRevenue || 0,
          pendingFees: dashboardData.pendingFees || 0,
          pendingList: dashboardData.pendingList || [],
        });
      } catch (err) {
        console.log('Dashboard API Error:', err?.response?.data || err.message);
      }
    };

    const fetchTodaySchedules = async () => {
      try {
        const res = await api.dashboard.getTodaySchedules();

        const scheduleData = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const filteredSchedules = scheduleData
          .filter((item) => {
            if (!item?.scheduleDate) return false;
            const itemDate = new Date(item.scheduleDate).toISOString().split('T')[0];
            return itemDate === todayStr;
          })
          .sort((a, b) => (a?.time || '').localeCompare(b?.time || ''));

        setSchedules(filteredSchedules);
      } catch (err) {
        console.log('Today Schedule API Error:', err?.response?.data || err.message);
        setSchedules([]);
      }
    };

    fetchDashboard();
    fetchTodaySchedules();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Revenue</h3>
          <p className="text-4xl font-bold text-[#000359] mt-2">
            ₹{data.monthlyRevenue}
          </p>
        </div>

        {/* <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending Fees</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">
            ₹{data.pendingFees}
          </p>
        </div> */}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Today's Schedule Activities</h3>

        {schedules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {schedules.map((item, index) => (
  <div
    key={item._id || index}
    className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm"
  >
    <p className="text-lg font-semibold text-gray-800">
      {item.activityId?.name ||
        item.activity?.name ||
        item.activityName ||
        'Activity'}
    </p>

    <p className="text-base text-gray-700 mt-2">
      {item.startTime || item.time || '-'}
    </p>
  </div>
))}
          </div>
        ) : (
          <p className="text-gray-500">No schedules for today</p>
        )}
      </div>

      {/* <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Pending Fees Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Member Name</th>
                <th className="p-3 text-left">Plan</th>
                <th className="p-3 text-left">Due Amount</th>
                <th className="p-3 text-left">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {data.pendingList?.length > 0 ? (
                data.pendingList.map((item, index) => (
                  <tr className="border-t" key={item._id || index}>
                    <td className="p-3">
                      {item.memberId?.name || item.memberName || '-'}
                    </td>
                    <td className="p-3">{item.plan || '-'}</td>
                    <td className="p-3 text-red-600">₹{item.amount || 0}</td>
                    <td className="p-3">
                      {item.dueDate
                        ? new Date(item.dueDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No pending fees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}