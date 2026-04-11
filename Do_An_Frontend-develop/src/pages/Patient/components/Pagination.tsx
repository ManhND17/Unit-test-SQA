import { ChevronLeft, ChevronRight } from 'lucide-react';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = [];
    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        1
      </button>
    );
    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <span
          key="ellipsis-1"
          className="w-8 h-8 flex items-center justify-center"
        >
          ...
        </span>
      );
    }
    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === i ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {i}
          </button>
        );
      }
    }
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span
          key="ellipsis-2"
          className="w-8 h-8 flex items-center justify-center"
        >
          ...
        </span>
      );
    }
    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Trước</span>
      </button>
      <div className="flex items-center space-x-1">{renderPageNumbers()}</div>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <span>Sau</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
export default Pagination;
