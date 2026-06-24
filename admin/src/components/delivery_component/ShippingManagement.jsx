import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaTruck,
} from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryService } from "../../services/deliveryService";
import { toast } from "react-toastify";
import DeliveryForm from "./DeliveryForm";
import Swal from "sweetalert2";

const ShippingManagement = () => {
  const queryClient = useQueryClient();
  const { getAllDeliveries, deleteDelivery } = deliveryService();

  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);

  const {
    data: deliveriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deliveries"],
    queryFn: () => getAllDeliveries({}),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries(["deliveries"]);
      toast.success("Xóa thành công");
    },
  });

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa phương thức giao hàng này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-600">
          Có lỗi xảy ra khi tải dữ liệu
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex flex-row items-center justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center p-1 text-white transition-colors bg-indigo-500 rounded-lg hover:bg-indigo-600"
        >
          <FaPlus /> Thêm phương thức
        </button>
      </div>

      {/* Shipping Rates Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deliveriesData.length === 0 ? (
          <div className="col-span-full">
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FaTruck className="mb-4 text-6xl text-gray-300" />
              <p className="text-lg font-medium">Không có dữ liệu</p>
              <p className="text-sm">Nhấn "Thêm phương thức" để tạo mới</p>
            </div>
          </div>
        ) : (
          deliveriesData.map((rate) => (
            <div
              key={rate._id}
              className={`relative p-6 transition-all border rounded-lg shadow-md hover:shadow-lg  bg-white`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-lg ${
                      rate.type === "express" ? "bg-orange-100" : "bg-blue-100"
                    }`}
                  >
                    <MdLocalShipping
                      className={`text-2xl ${
                        rate.type === "express"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {rate.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        rate.type === "express"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {rate.type === "express" ? "⚡ Nhanh" : " Tiêu chuẩn"}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
              </div>

              {/* Description */}
              {rate.description && (
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                  {rate.description}
                </p>
              )}

              {/* Pricing Info */}
              <div className="pb-4 mb-4 space-y-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phí cơ bản:</span>
                  <span className="text-lg font-bold ">
                    {rate.baseFee?.toLocaleString()}đ
                  </span>
                </div>

                {rate.extraFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phí express:</span>
                    <span className="text-sm font-semibold text-orange-600">
                      +{rate.extraFee?.toLocaleString()}đ
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Miễn phí từ:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {rate.freeShippingMinAmount?.toLocaleString()}đ
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thời gian giao:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {rate.deliveryTimeRange ||
                      `${rate.deliveryDays}-${rate.maxDeliveryDays} ngày`}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {rate.notes && (
                <div className="p-3 mb-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold"> Ghi chú:</span>{" "}
                    {rate.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* <button
                  onClick={() => handleEdit(rate)}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <FaEdit /> Chỉnh sửa
                </button> */}
                <button
                  onClick={() => handleDelete(rate._id)}
                  className="absolute flex items-center justify-center p-1 text-sm font-medium text-gray-600 transition-colors rounded-lg top-1 right-1 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <DeliveryForm
          editingRate={editingRate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ShippingManagement;
