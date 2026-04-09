export default function ActivityCard({ slot, onClick }) {
  const isFull = slot.booked >= slot.capacity;

  return (
    <div
  onClick={() => onClick && onClick(slot)}
  className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
>

      {/* LEFT: Activity + Time */}
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {slot.activity}
        </p>
        <p className="text-xs text-gray-500">
          {slot.time}
        </p>
      </div>

      {/* RIGHT: Booking Status */}
      <div className="text-sm font-medium">
        <span
          className={
            isFull
              ? 'text-red-500'
              : slot.booked >= slot.capacity - 2
              ? 'text-yellow-500'
              : 'text-green-600'
          }
        >
          {isFull
            ? 'Full'
            : `${slot.booked}/${slot.capacity}`}
        </span>
      </div>

    </div>
  );
}