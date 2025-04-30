"use client";

interface PaginationProps {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (pagination.totalPages <= 1) return null;

  // Show limited page numbers (e.g., 1 2 3 ... 10)
  const getPageNumbers = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    // Always show first page
    pages.push(1);
    
    // Show current page and nearby pages
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    
    // Always show last page if different from first
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500">
        Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
        {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
        {pagination.totalItems} orders
      </div>
      <div className="flex space-x-2">
        {pagination.currentPage > 1 && (
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Previous
          </button>
        )}
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-4 py-2">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 border rounded-md ${
                page === pagination.currentPage
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        {pagination.currentPage < pagination.totalPages && (
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}