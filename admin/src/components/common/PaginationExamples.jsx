/**
 * VÍ DỤ SỬ DỤNG COMPONENT PAGINATION
 *
 * File này chứa các ví dụ cụ thể về cách sử dụng component Pagination
 * ở các trang khác trong ứng dụng admin
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../common/Pagination";

// ========================================
// VÍ DỤ 1: QUẢN LÝ SẢN PHẨM (PRODUCTS)
// ========================================
const ProductManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 12;

  // Fetch products với phân trang
  const { data, isLoading } = useQuery({
    queryKey: ["products", currentPage, searchTerm],
    queryFn: () =>
      productService.getAllProducts({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      }),
    keepPreviousData: true,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
};

// ========================================
// VÍ DỤ 2: QUẢN LÝ KHÁCH HÀNG (CUSTOMERS)
// ========================================
const CustomerManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
  });
  const itemsPerPage = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["customers", currentPage, filters],
    queryFn: () =>
      customerService.getAllCustomers({
        page: currentPage,
        limit: itemsPerPage,
        role: filters.role !== "all" ? filters.role : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
      }),
    keepPreviousData: true,
  });

  const customers = data?.customers || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  };

  return (
    <div>
      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Customer Table */}
      <CustomerTable customers={customers} />

      {/* Pagination */}
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
};

// ========================================
// VÍ DỤ 3: QUẢN LÝ BLOG/BÀI VIẾT (POSTS)
// ========================================
const BlogManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("all");
  const itemsPerPage = 15;

  const { data, isLoading } = useQuery({
    queryKey: ["posts", currentPage, category],
    queryFn: () =>
      postService.getAllPosts({
        page: currentPage,
        limit: itemsPerPage,
        category: category !== "all" ? category : undefined,
      }),
    keepPreviousData: true,
  });

  const posts = data?.posts || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 15,
  };

  return (
    <div>
      <PostList posts={posts} />
      <Pagination pagination={pagination} onPageChange={setCurrentPage} />
    </div>
  );
};

// ========================================
// VÍ DỤ 4: QUẢN LÝ ĐÁNH GIÁ (REVIEWS)
// ========================================
const ReviewManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState("all");
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", currentPage, rating],
    queryFn: () =>
      reviewService.getAllReviews({
        page: currentPage,
        limit: itemsPerPage,
        rating: rating !== "all" ? rating : undefined,
      }),
    keepPreviousData: true,
  });

  const reviews = data?.reviews || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  return (
    <div>
      {/* Rating Filter */}
      <div className="mb-4">
        <select
          value={rating}
          onChange={(e) => {
            setRating(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="all">Tất cả đánh giá</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>

      {/* Review List */}
      <ReviewList reviews={reviews} />

      {/* Pagination */}
      <Pagination pagination={pagination} onPageChange={setCurrentPage} />
    </div>
  );
};

// ========================================
// VÍ DỤ 5: SỬ DỤNG VỚI MULTIPLE FILTERS
// ========================================
const AdvancedProductManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    brand: "all",
    priceRange: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const itemsPerPage = 16;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", currentPage, filters],
    queryFn: () =>
      productService.getAllProducts({
        page: currentPage,
        limit: itemsPerPage,
        ...filters,
      }),
    keepPreviousData: true,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 16,
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset về trang 1
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Advanced Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Tất cả danh mục</option>
          {/* Add categories */}
        </select>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange("brand", e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Tất cả thương hiệu</option>
          {/* Add brands */}
        </select>
        <select
          value={filters.priceRange}
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Tất cả giá</option>
          <option value="0-500000">Dưới 500k</option>
          <option value="500000-1000000">500k - 1tr</option>
          <option value="1000000-2000000">1tr - 2tr</option>
          <option value="2000000+">Trên 2tr</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="createdAt">Mới nhất</option>
          <option value="price">Giá</option>
          <option value="name">Tên</option>
          <option value="sales">Bán chạy</option>
        </select>
      </div>

      {/* Loading overlay */}
      {isFetching && (
        <div className="text-center py-4">
          <span className="text-gray-500">Đang tải...</span>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy sản phẩm</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
};

export {
  ProductManagement,
  CustomerManagement,
  BlogManagement,
  ReviewManagement,
  AdvancedProductManagement,
};
