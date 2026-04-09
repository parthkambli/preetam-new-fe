export default function ActivityStats({ stats = {} }) {
  const data = [
    {
      label: 'Activities',
      value: stats.totalActivities || 0,
    },
    {
      label: 'Bookings',
      value: stats.totalBookings || 0,
    },
    {
      label: 'Available Slots',
      value: stats.availableSlots || 0,
    },
    {
      label: 'Full Slots',
      value: stats.fullSlots || 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-xl font-semibold text-[#000359] mt-1">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}