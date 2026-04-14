// components/layout/fees/FeesTabs.jsx

const TABS = [
  { key: 'add-payments', label: 'Transaction Report.' },
  // { key: 'allot-fees',   label: 'Allot Fees'   },
  { key: 'fee-types',    label: 'Fee Types'    },
];

export default function FeesTabs({ activeTab = 'add-payments', onTabChange }) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
      <div
        className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap"
        role="tablist"
        aria-label="Fees navigation"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange?.(tab.key)}
              className={[
                'relative px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all duration-150 outline-none',
                'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1',
                isActive
                  ? 'bg-[#1a73e8] text-white shadow-md'
                  : 'bg-[#000359] text-white hover:bg-[#0a0f6b] hover:-translate-y-px hover:shadow-md',
              ].join(' ')}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-white/60 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}