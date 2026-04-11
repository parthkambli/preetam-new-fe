import ActivityCard from './ActivityCard';
import EmptyState from './EmptyState';

export default function TodaySchedule({ slots = [], onSlotClick }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Selected Day Schedule
        </h2>
      </div>

      {slots.length === 0 ? (
        <EmptyState message="No activities scheduled for selected date" />
      ) : (
        <div className="space-y-3">
          {slots.map((slot, index) => {
            const showTitle =
              index === 0 ||
              slots[index - 1].activity !== slot.activity;

            return (
              <div key={slot.slotId}>
                
                {showTitle && (
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    {slot.activity}
                  </h3>
                )}

                <ActivityCard
                  slot={slot}
                  onClick={onSlotClick}
                />

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}