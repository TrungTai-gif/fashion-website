import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { statisticService } from "../../services/statisticServices";
import StatisticCards from "./StatisticCards";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import RevenueChart from "./RevenueChart";

const DashboardPage = () => {
  const { getOverallStatistics, getRevenue, getOrdersByDays } =
    statisticService();

  const [selectedPeriod, setSelectedPeriod] = useState(7);

  // Fetch overall statistics
  const {
    data: overallData,
    isLoading: isLoadingOverall,
    error: overallError,
  } = useQuery({
    queryKey: ["overallStatistics"],
    queryFn: getOverallStatistics,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Fetch revenue data for chart
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["revenue", selectedPeriod],
    queryFn: () => getRevenue(selectedPeriod),
    enabled: !!selectedPeriod,
  });

  // Fetch orders data for chart
  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["ordersByDays", selectedPeriod],
    queryFn: () => getOrdersByDays(selectedPeriod),
    enabled: !!selectedPeriod,
  });

  useEffect(() => {
    if (overallError) {
      toast.error("Không thể tải dữ liệu thống kê");
    }
  }, [overallError]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (isLoadingOverall) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <Spinner />
          <span className="font-medium text-gray-700">
            Đang tải dữ liệu thống kê...
          </span>
        </div>
      </div>
    );
  }

  const statistics = overallData?.data;

  return (
    <div className="min-h-screen p-5 bg-gray-50 rounded-2xl">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900"> TỔNG QUAN</h1>
        </div>

        {/* Statistics Cards */}
        <StatisticCards
          productStats={statistics?.products}
          orderStats={statistics?.orders}
          revenueStats={statistics?.revenue}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
          {/* Revenue Chart */}
          {/* <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Doanh thu</h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md"
              >
                <option value={7}>7 ngày</option>
                <option value={14}>14 ngày</option>
                <option value={30}>30 ngày</option>
              </select>
            </div>

            {isLoadingRevenue ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-2">
                {revenueData?.data?.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-600">
                      {formatDate(day.date)}
                    </span>
                    <div className="text-right">
                      <span className="font-semibold text-green-600">
                        {formatCurrency(day.revenue)}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({day.orders} đơn)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}
          <RevenueChart />

          {/* Orders Chart */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Đơn hàng</h3>
              <span className="text-sm text-gray-500">
                {selectedPeriod} ngày gần nhất
              </span>
            </div>

            {isLoadingOrders ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-2">
                {ordersData?.data?.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-600">
                      {formatDate(day.date)}
                    </span>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded">
                        {day.totalOrders} tổng
                      </span>
                      <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded">
                        {day.delivered} hoàn thành
                      </span>
                      <span className="px-2 py-1 text-sm text-yellow-800 bg-yellow-100 rounded">
                        {day.pending} chờ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="p-6 mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Tóm tắt hoạt động gần đây
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 text-center rounded-lg bg-blue-50">
              <p className="text-2xl font-bold text-blue-600">
                {revenueData?.data?.slice(-1)[0]?.orders || 0}
              </p>
              <p className="text-sm text-gray-600">Đơn hàng hôm nay</p>
            </div>
            <div className="p-4 text-center rounded-lg bg-green-50">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueData?.data?.slice(-1)[0]?.revenue || 0)}
              </p>
              <p className="text-sm text-gray-600">Doanh thu hôm nay</p>
            </div>
            <div className="p-4 text-center rounded-lg bg-yellow-50">
              <p className="text-2xl font-bold text-yellow-600">
                {statistics?.products?.lowStockProducts?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Sản phẩm cần nhập thêm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
