import { useState, useRef, useEffect } from "react";
import { format, addDays, isToday, isSameDay } from "date-fns";

export default function DateStrip({ selectedDate, setSelectedDate }) {
  const scrollRef = useRef(null);
  const selectedRef = useRef(null);
  const [anchorOffset, setAnchorOffset] = useState(0);

  const today = new Date();

  const days = Array.from({ length: 45 }, (_, i) => {
    const date = addDays(today, i - 14 + anchorOffset);
    return {
      date,
      isSelected: isSameDay(date, selectedDate),
      isToday: isToday(date),
    };
  });

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [anchorOffset, selectedDate]);

  // Month label: derive from visible center pill
  const centerDate = days[22].date;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-sm font-medium text-gray-700">
          {format(centerDate, "MMMM yyyy")}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setAnchorOffset((o) => o - 7)}
            className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-base"
          >
            ‹
          </button>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setAnchorOffset(0);
            }}
            className="px-2 h-7 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => setAnchorOffset((o) => o + 7)}
            className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-base"
          >
            ›
          </button>
        </div>
      </div>

      {/* Scrollable Strip */}
      <div
        ref={scrollRef}
        className="overflow-x-auto flex gap-1.5 px-3 pb-3 pt-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {days.map(({ date, isSelected, isToday: todayFlag }, i) => (
          <button
            key={i}
            ref={isSelected ? selectedRef : null}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center w-[54px] flex-shrink-0 py-2.5 rounded-xl border transition-all
              ${
                isSelected
                  ? "bg-blue-600 border-transparent"
                  : todayFlag
                  ? "border-gray-300"
                  : "border-transparent hover:bg-gray-50 hover:border-gray-100"
              }`}
          >
            <span
              className={`text-[11px] font-medium uppercase tracking-wide
              ${isSelected ? "text-blue-100" : "text-gray-400"}`}
            >
              {format(date, "EEE")}
            </span>
            <span
              className={`text-xl font-medium leading-snug
              ${
                isSelected
                  ? "text-white"
                  : todayFlag
                  ? "text-blue-600"
                  : "text-gray-800"
              }`}
            >
              {format(date, "d")}
            </span>
            <div
              className={`w-1 h-1 rounded-full mt-1
              ${
                todayFlag
                  ? isSelected
                    ? "bg-blue-200"
                    : "bg-blue-500"
                  : "invisible"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}