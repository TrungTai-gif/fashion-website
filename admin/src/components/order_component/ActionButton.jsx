import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import { orderService } from "../../services/ordersService";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import { Link } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import Spinner from "../common/Spinner";

const ActionButton = ({ order_id }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();
  const { deleteOrder } = orderService();

  const { mutate: mutateDelete, isPending } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: (res) => {
      if (res?.success) {
        queryClient.invalidateQueries(["orders"]);
        toast.success("Xóa đơn hàng thành công!");
      }
      setShowConfirm(false);
    },
    onError: () => {
      toast.error("Xóa đơn hàng thất bại!");
      setShowConfirm(false);
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (order_id) {
      mutateDelete(order_id);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <>
          <DeleteConfirmModal
            title="Xóa đơn hàng"
            message={`Bạn có chắc chắn muốn xóa đơn hàng #${order_id
              ?.slice(-8)
              .toUpperCase()} không?`}
            onClose={() => setShowConfirm(false)}
            onConfirm={confirmDelete}
          />{" "}
        </>
      )}

      <div className="relative flex items-center justify-end">
        <div className="group/action relative">
          <button className="p-2 rounded-full hover:bg-gray-100 transition w-10 h-10 flex items-center justify-center">
            <IoMdMore className="w-6 h-6" />
          </button>
          {isPending && <Spinner />}
          <div
            id="dropdownDivider"
            className="z-20 absolute right-0 top-8 min-w-[9rem] bg-white border border-gray-200 rounded-lg shadow-lg group-hover/action:block hidden animate-fadeIn"
          >
            <ul className="py-2 text-sm text-gray-700">
              <li className="cursor-pointer">
                <Link to={`/orders/${order_id}`}>
                  <span className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition rounded">
                    Xem chi tiết
                  </span>
                </Link>
              </li>

              <li onClick={handleDelete} className="cursor-pointer">
                <span className="block px-4 py-2 hover:bg-red-50 hover:text-red-600 transition rounded">
                  Xóa đơn hàng
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionButton;
