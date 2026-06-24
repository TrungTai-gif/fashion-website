import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShopContext } from "../../context/ShopContext";
import { orderService } from "../../services/ordersService";
import Spinner from "../common/Spinner";
import { useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaMapLocation } from "react-icons/fa6";
import ProductOrder from "./ProductOrder";
const OrderDetail = () => {
  const { currency, navigate } = useContext(ShopContext);
  const { getOrderById } = orderService();
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => navigate("/orders")}
      />
      {order && (
        <div className="relative w-full max-w-4xl max-h-[90vh] mt-10 rounded-2xl shadow-2xl border border-gray-300 bg-white flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-700">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Chi tiết đơn hàng
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                #{order._id?.slice(-8).toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => navigate("/orders")}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-6">
            {/* Customer & Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Thông tin khách hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Tên:</span>{" "}
                    {order.name || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {order.email || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">SĐT:</span>{" "}
                    {order.shippingAddress?.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Trạng thái đơn hàng
                </h3>
                <div className="space-y-2">
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "shipped"
                          ? "bg-purple-100 text-purple-700"
                          : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status === "delivered"
                        ? "Đã giao"
                        : order.status === "shipped"
                        ? "Đang giao"
                        : order.status === "confirmed"
                        ? "Đã xác nhận"
                        : order.status === "cancelled"
                        ? "Đã hủy"
                        : "Chờ xử lý"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Thanh toán:</span>{" "}
                    {order.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ngày đặt:</span>{" "}
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Sản phẩm ({order.items?.length || 0})
              </h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <ProductOrder key={index} item={item} />
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <FaMapLocation className="h-5 w-5 mr-2" />
                Địa chỉ giao hàng
              </h3>
              <p className="text-sm text-gray-700">
                {order.shippingAddress &&
                  `${order.shippingAddress?.phone || ""}, ${
                    order.shippingAddress?.address || ""
                  }, ${order.shippingAddress?.city || ""},  ${
                    order.shippingAddress?.district || ""
                  }`}
              </p>
              {order.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ghi chú:</span> {order.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Tổng quan đơn hàng
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    {(
                      order.totalAmount + order.coupon.discountAmount || 0
                    ).toLocaleString("vi-VN")}{" "}
                    {currency}
                  </span>
                </div>
                {order.shippingFee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium">
                      {order.shippingFee.toLocaleString("vi-VN")} {currency}
                    </span>
                  </div>
                )}
                {order.coupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá:</span>
                    <span className="font-medium">
                      -{order.coupon.discountAmount.toLocaleString("vi-VN")}{" "}
                      {currency}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-indigo-300">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-lg font-bold text-indigo-600">
                      {(order.totalAmount || 0).toLocaleString("vi-VN")}{" "}
                      {currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => navigate("/orders")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Đóng
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              In đơn hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
