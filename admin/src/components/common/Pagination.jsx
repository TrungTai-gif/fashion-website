import React from "react";
/**
 * Component Pagination tái sử dụng
 * @param {Object} pagination - Thông tin phân trang từ API
 * @param {number} pagination.page - Trang hiện tại
 * @param {number} pagination.totalPages - Tổng số trang
 * @param {number} pagination.total - Tổng số items
 * @param {number} pagination.limit - Số items mỗi trang
 * @param {Function} onPageChange - Callback khi đổi trang
 */
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  // Tạo danh sách các trang cần hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang <= 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic phức tạp hơn cho nhiều trang
      if (page <= 3) {
        // Nếu ở đầu, hiển thị: 1 2 3 4 5
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
      } else if (page >= totalPages - 2) {
        // Nếu ở cuối, hiển thị: n-4 n-3 n-2 n-1 n
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa, hiển thị: current-2 current-1 current current+1 current+2
        for (let i = page - 2; i <= page + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200">
      {/* Thông tin hiển thị */}
      <div className="text-sm text-gray-700">
        Hiển thị <span className="font-medium">{startIndex}</span> -{" "}
        <span className="font-medium">{endIndex}</span> trong tổng số{" "}
        <span className="font-medium">{total}</span> kết quả
      </div>

      {/* Các nút phân trang */}
      <div className="flex gap-2">
        {/* Nút đầu tiên */}
        {page > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            title="Trang đầu"
          >
            «
          </button>
        )}

        {/* Nút Trước */}
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={`px-3 py-1 rounded-lg transition ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          Trước
        </button>

        {/* Các số trang */}
        <div className="flex gap-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-lg transition ${
                page === page
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Nút Sau */}
        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-3 py-1 rounded-lg transition ${
            page === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          Sau
        </button>

        {/* Nút cuối cùng */}
        {page < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            title="Trang cuối"
          >
            »
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
