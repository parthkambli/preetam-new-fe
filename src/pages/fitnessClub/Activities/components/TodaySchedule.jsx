import ActivityCard from './ActivityCard';
import EmptyState from './EmptyState';

export default function TodaySchedule({ slots = [], onSlotClick }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Today’s Schedule
        </h2>
      </div>

      {slots.length === 0 ? (
        <EmptyState message="No activities scheduled for today" />
      ) : (
        <div className="space-y-3">
          {slots.map((slot, index) => (
            <ActivityCard key={index} slot={slot} onClick={onSlotClick} />
          ))}
        </div>
      )}

    </div>
  );
}