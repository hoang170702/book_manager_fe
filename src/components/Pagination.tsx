import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800
          disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page, idx) =>
        typeof page === 'string' ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
              ${currentPage === page
                ? 'gradient-primary text-white shadow-md shadow-primary-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800'
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800
          disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
