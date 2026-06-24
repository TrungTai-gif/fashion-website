import { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";

const OrderLine = ({ order }) => {
  const { currency } = useContext(ShopContext);

  return (
    <div className="border rounded-lg shadow-sm p-4 mb-6 bg-white">
      {/* Header: Mã đơn + ngày + trạng thái */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 mb-3">
        <div>
          <p className="text-sm text-gray-600">
            Mã đơn:{" "}
            <span className="font-mono font-semibold text-gray-800">
              #{order._id?.slice(-8).toUpperCase()}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Ngày đặt:{" "}
            <span className="text-gray-800">
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </p>
        </div>

        <div className="mt-2 sm:mt-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              order.status === "delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : order.status === "shipped"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status === "pending" && "Chờ xử lý"}
            {order.status === "confirmed" && "Đã xác nhận"}
            {order.status === "shipped" && "Đang giao"}
            {order.status === "delivered" && "Đã giao"}
            {order.status === "cancelled" && "Đã hủy"}
            {!order.status && "Chờ xử lý"}
          </span>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="divide-y">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center py-3 gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md border"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">
                SL: {item.quantity} × {currency}
                {item.price.toLocaleString()}
              </p>
            </div>
            <div className="font-semibold text-gray-800">
              {currency}
              {(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      {/* Footer: Thông tin thanh toán & địa chỉ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-t pt-4 mt-4">
        {/* Cột trái: Thông tin thanh toán */}
        <div className="space-y-2 mr-10 text-sm">
          <h4 className="font-semibold text-gray-900 mb-3">
            Thông tin thanh toán
          </h4>

          {order.coupon && (
            <div className="flex justify-between items-center bg-green-50 p-2 rounded">
              <span className="text-gray-700">Mã giảm giá:</span>
              <span className="font-semibold text-green-700">
                {/* {order.coupon.code} (-{currency} */}
                {order.coupon?.discountAmount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-700">Phí vận chuyển:</span>
            <span className="font-medium text-gray-900">
              {currency}
              {(order.shippingFee || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700">Hình thức thanh toán:</span>
            <span className="font-medium text-gray-900 uppercase">
              {order.paymentMethod || "COD"}
            </span>
          </div>

          {order.notes && (
            <div className="pt-2 border-t">
              <span className="text-gray-700">Ghi chú:</span>
              <p className="italic text-gray-600 mt-1">{order.notes}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-base font-semibold text-gray-900">
              Tổng tiền:
            </span>
            <span className="text-lg font-bold text-indigo-600">
              {currency}
              {order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Cột phải: Địa chỉ giao hàng */}
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold text-gray-900 mb-3">
            Địa chỉ giao hàng
          </h4>

          <div className="space-y-1.5 text-gray-700">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium text-gray-900">
                {order.shippingAddress?.fullName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{order.shippingAddress?.phone}</span>
            </div>

            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-gray-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="flex-1">
                {order.shippingAddress?.address}
                {order.shippingAddress?.ward &&
                  `, ${order.shippingAddress.ward}`}
                {order.shippingAddress?.district &&
                  `, ${order.shippingAddress.district}`}
                {order.shippingAddress?.province &&
                  `, ${order.shippingAddress.province}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderLine;
