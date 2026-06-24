import DeleteConfirmModal from "../common/DeleteConfirmModal";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../common/Spinner";
import { orderService } from "../../services/ordersService";

import { toast } from "react-toastify";
import ActionButton from "./ActionButton";

const OrderTable = ({ displayed }) => {
  const { updateOrderStatus } = orderService();
  const [showConfirm, setShowConfirm] = useState(false);
  const [order_id, setOrder_id] = useState("");
  const queryClient = useQueryClient();

  const { mutate: mutateStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries(["orders"]);
        toast.success("Cập nhật trạng thái thành công!");
      }
    },
    onError: () => {
      toast.error("Cập nhật trạng thái thất bại!");
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    mutateStatus({ id: orderId, status: newStatus });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipping: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="overflow-x-auto rounded-t-xl border border-gray-300 shadow-md bg-white">
      {isUpdating && (
        <div className="fixed z-40 inset-0 flex justify-center items-center bg-black/20">
          <Spinner />
        </div>
      )}

      {/* Xác nhận xóa đơn hàng */}
      {showConfirm && (
        <DeleteConfirmModal
          title="Xóa đơn hàng"
          message="Bạn có thực sự muốn xóa đơn hàng này không?"
          onClose={() => {
            setShowConfirm(false);
            setOrder_id("");
          }}
          onConfirm={() => mutateDelete({ id: order_id })}
        />
      )}

      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-200 text-black">
          <tr>
            <th className="p-3 text-left">Mã đơn hàng</th>
            <th className="p-3 text-left">Khách hàng</th>
            <th className="p-3 text-left">Tổng tiền</th>
            <th className="p-3 text-left">Trạng thái</th>
            <th className="p-3 text-left">Phương thức TT</th>
            <th className="p-3 text-left">Ngày đặt</th>
            <th className="p-3 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((order) => (
            <tr
              key={order._id}
              className="hover:bg-blue-50 transition duration-150"
            >
              {/* Mã đơn hàng */}
              <td className="px-2 py-2 border font-medium text-gray-900">
                #{order._id?.slice(-8).toUpperCase()}
              </td>

              {/* Thông tin khách hàng */}
              <td className="px-2 py-2 border">
                <div>
                  <p className="font-medium">
                    {order.userId?.name ||
                      order.shippingAddress?.fullName ||
                      "N?A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.email || order.shippingAddress?.phone || ""}
                  </p>
                </div>
              </td>

              {/* Tổng tiền */}
              <td className="px-2 py-2 border font-semibold text-gray-900">
                {formatCurrency(order.totalAmount || 0)}
              </td>

              {/* Trạng thái với dropdown */}
              <td className="px-2 py-2 border">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer border-0 focus:outline-none focus:ring-1 focus:ring-indigo-400 ${getStatusColor(
                    order.status
                  )}`}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipped">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                  {/* enum: [ "pending", "confirmed", "processing", "shipped",
                  "delivered", "cancelled", ], */}
                </select>
              </td>

              {/* Phương thức thanh toán */}
              <td className="px-2 py-2 border">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {order.paymentMethod}
                </span>
              </td>

              {/* Ngày đặt hàng */}
              <td className="px-2 py-2 border border-gray-400">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                <br />
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString("vi-VN")}
                </span>
              </td>

              {/* Nút thao tác */}
              <td className=" text-center border border-gray-400 gap-2">
                <ActionButton order_id={order._id} />
              </td>
            </tr>
          ))}

          {displayed.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500">
                Không tìm thấy đơn hàng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
