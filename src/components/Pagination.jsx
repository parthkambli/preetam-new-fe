import React from "react";

export default function Pagination({
  page = 1,
  limit = 10,
  totalPages = 1,
  totalCount = 0,
  setPage,
  setLimit,
}) {
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleFirst = () => {
    setPage(1);
  };

  const handleLast = () => {
    setPage(totalPages);
  };

  const handlePageInput = (e) => {
    let value = Number(e.target.value);

    if (!value || value < 1) value = 1;
    if (value > totalPages) value = totalPages;

    setPage(value);
  };

  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="font-medium text-gray-600">Rows per page</span>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border border-[#1a2a5e]/30 px-2 py-1.5 rounded-lg bg-[#1a2a5e]/5 text-[#1a2a5e] text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]/30 focus:border-[#1a2a5e] transition"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <span className="hidden sm:inline-block w-px h-4 bg-gray-200" />

        <span className="text-gray-400 text-xs">
          Showing <span className="font-semibold text-gray-700">{startItem}–{endItem}</span> of{" "}
          <span className="font-semibold text-gray-700">{totalCount}</span> results
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleFirst}
          disabled={page === 1}
          title="First page"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2a5e] text-white border border-[#1a2a5e] hover:bg-[#152147] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold shadow-sm"
        >
          «
        </button>

        <button
          onClick={handlePrev}
          disabled={page === 1}
          title="Previous page"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2a5e] text-white border border-[#1a2a5e] hover:bg-[#152147] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold shadow-sm"
        >
          ‹
        </button>

        <div className="flex items-center gap-1.5 border border-[#1a2a5e]/20 bg-[#1a2a5e]/5 px-3 py-1.5 rounded-lg mx-1">
          <span className="text-xs text-[#1a2a5e]/60 font-medium">Page</span>
          <input
            type="number"
            value={page}
            onChange={handlePageInput}
            min={1}
            max={totalPages}
            className="w-10 text-center text-sm font-bold text-[#1a2a5e] bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs text-[#1a2a5e]/40">/</span>
          <span className="text-xs font-semibold text-[#1a2a5e]/70">{totalPages}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          title="Next page"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2a5e] text-white border border-[#1a2a5e] hover:bg-[#152147] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold shadow-sm"
        >
          ›
        </button>

        <button
          onClick={handleLast}
          disabled={page === totalPages}
          title="Last page"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2a5e] text-white border border-[#1a2a5e] hover:bg-[#152147] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold shadow-sm"
        >
          »
        </button>
      </div>
    </div>
  );
}
