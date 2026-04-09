export default function EmptyState({
  message = "No data available",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">

      <p className="text-sm text-gray-500 mb-3">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm bg-[#000359] text-white rounded-md hover:bg-[#000280] transition"
        >
          {actionLabel}
        </button>
      )}

    </div>
  );
}