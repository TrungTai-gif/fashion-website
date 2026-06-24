import React from "react";
import {
  FaBoxes,
  FaShoppingCart,
  FaDollarSign,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTimes,
} from "react-icons/fa";

const StatisticCards = ({ productStats, orderStats, revenueStats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const cards = [
    {
      title: "Tổng sản phẩm",
      value: productStats?.totalProducts || 0,
      icon: FaBoxes,
      color: "blue",
      subInfo: `${productStats?.outOfStockProducts || 0} hết hàng`,
    },
    {
      title: "Tổng đơn hàng",
      value: orderStats?.totalOrders || 0,
      icon: FaShoppingCart,
      color: "green",
      subInfo: `${orderStats?.pendingOrders || 0} chờ xử lý`,
    },
    {
      title: "Doanh thu tháng",
      value: formatCurrency(revenueStats?.total || 0),
      icon: FaDollarSign,
      color: "yellow",
      subInfo: `TB: ${formatCurrency(revenueStats?.avgDaily || 0)}/ngày`,
    },
    {
      title: "Cảnh báo tồn kho",
      value: productStats?.lowStockProducts?.length || 0,
      icon: FaExclamationTriangle,
      color: "red",
      subInfo: "Sản phẩm sắp hết",
    },
  ];

  const orderStatusCards = [
    {
      title: "Chờ xử lý",
      value: orderStats?.pendingOrders || 0,
      icon: FaClock,
      color: "yellow",
    },
    {
      title: "Hoàn thành",
      value: orderStats?.completedOrders || 0,
      icon: FaCheckCircle,
      color: "green",
    },
    {
      title: "Đã hủy",
      value: orderStats?.cancelledOrders || 0,
      icon: FaTimes,
      color: "red",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      yellow: "bg-yellow-500 text-white",
      red: "bg-red-500 text-white",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-lg ${getColorClasses(card.color)}`}
                >
                  <IconComponent size={24} />
                </div>
                <div className="flex-1 ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                  {card.subInfo && (
                    <p className="mt-1 text-xs text-gray-500">{card.subInfo}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Status Cards */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Trạng thái đơn hàng
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {orderStatusCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="flex items-center p-4 rounded-lg bg-gray-50"
              >
                <div
                  className={`p-2 rounded-lg ${getColorClasses(card.color)}`}
                >
                  <IconComponent size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Low Stock Products Alert */}
      {productStats?.lowStockProducts?.length > 0 && (
        <div className="p-6 bg-white border border-red-200 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="mr-2 text-red-500" />
            <h3 className="text-lg font-semibold text-red-800">
              Sản phẩm sắp hết hàng
            </h3>
          </div>
          <div className="space-y-3">
            {productStats.lowStockProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-red-50"
              >
                <div className="flex items-center">
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="object-cover w-10 h-10 mr-3 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.category?.name} • {product.brand?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {product.stock} còn lại
                  </span>
                  <p className="mt-1 text-sm text-gray-600">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticCards;
