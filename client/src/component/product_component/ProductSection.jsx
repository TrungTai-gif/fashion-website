import { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { GrPrevious } from "react-icons/gr";
import ProductItem from "./ProductItem";

const ProductSection = ({ products = [] }) => {
  const itemsPerPage = 16; // số sp mỗi trang
  const [currentPage, setCurrentPage] = useState(1);

  // tính tổng số trang
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // cắt danh sách sản phẩm theo trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="mt-5 mb-20">
      {/* Product list */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        {currentProducts.map((product, index) => (
          <ProductItem key={product._id || index} product={product} />
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            <GrPrevious />
          </button>
          <span className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            <GrPrevious className="rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSection;
