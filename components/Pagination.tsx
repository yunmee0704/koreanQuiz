interface PaginationProps {
  page: number;
  totalLabel?: string;
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

export default function Pagination({
  page,
  totalLabel = "?",
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false
}: PaginationProps) {
  return (
    <nav className="mt-6 rounded-2xl bg-white p-4 shadow-sm" aria-label="Pagination">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={disablePrevious}
          className="min-h-11 rounded-xl border border-emerald-300 px-4 py-2 font-semibold text-emerald-900 disabled:opacity-40"
        >
          Previous
        </button>
        <p className="text-sm font-semibold text-emerald-900">
          Page {page} / {totalLabel}
        </p>
        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className="min-h-11 rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
