import { useState } from "react";
import { orderService } from "../../services/ordersService";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../common/Spinner";
import OrderFeature from "./OrderFeature";
import OrderTable from "./OrderTable";
import Pagination from "../common/Pagination";

const OrderManagement = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { getAllOrder } = orderService();

  // Fetch orders với params phân trang
  const { data, isLoading } = useQuery({
    queryKey: ["orders", currentPage, statusFilter],
    queryFn: () =>
      getAllOrder({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter,
      }),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
    refetchInterval: 5000, // Tự động cập nhật mỗi 5 giây
  });

  // Lấy dữ liệu từ response
  const orders = data?.orders || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white mb-20">
      <OrderFeature
        data={orders}
        handleStatusFilterChange={handleStatusFilterChange}
        statusFilter={statusFilter}
      />

      <OrderTable displayed={orders} />

      {/* Phân trang */}

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
};

export default OrderManagement;
