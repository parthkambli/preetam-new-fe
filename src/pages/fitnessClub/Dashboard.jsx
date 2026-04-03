export default function FitnessDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Members</h3>
          <p className="text-4xl font-bold text-[#000359] mt-2">320</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active Members</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">275</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Revenue</h3>
          <p className="text-4xl font-bold text-[#000359] mt-2">₹4,80,000</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending Fees</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">₹45,000</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
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
              <tr className="border-t">
                <td className="p-3">Ramesh Patil</td>
                <td className="p-3">Monthly Gym</td>
                <td className="p-3 text-red-600">₹2,000</td>
                <td className="p-3">15 Jan 2026</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Suman Desai</td>
                <td className="p-3">Yoga + Zumba</td>
                <td className="p-3 text-red-600">₹3,500</td>
                <td className="p-3">18 Jan 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}