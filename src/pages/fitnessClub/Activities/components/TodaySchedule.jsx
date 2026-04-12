import { useState } from 'react';
import ActivityCard from './ActivityCard';
import EmptyState from './EmptyState';

export default function TodaySchedule({ slots = [], onSlotClick }) {
  const [openGroups, setOpenGroups] = useState({});

  // ✅ GROUP BY ACTIVITY
  const grouped = slots.reduce((acc, slot) => {
    if (!acc[slot.activity]) acc[slot.activity] = [];
    acc[slot.activity].push(slot);
    return acc;
  }, {});

  const toggleGroup = (activity) => {
    setOpenGroups(prev => ({
      ...prev,
      [activity]: !prev[activity],
    }));
  };

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

          {Object.entries(grouped).map(([activity, activitySlots]) => {
            const isOpen = openGroups[activity];

            return (
              <div key={activity} className="border rounded-lg">

                {/* HEADER */}
                <div
                  onClick={() => toggleGroup(activity)}
                  className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {activity}
                  </span>

                  <span className="text-xs text-gray-500">
                    {activitySlots.length} slots
                  </span>
                </div>

                {/* SLOTS */}
                {isOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    {activitySlots.map((slot) => (
                      <ActivityCard
                        key={slot.slotId}
                        slot={slot}
                        onClick={onSlotClick}
                      />
                    ))}
                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}