import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MdLocalOffer, MdPercent, MdDateRange } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "../../services/couponService";
import { toast } from "react-toastify";
import CouponForm from "./CouponForm";
import Swal from "sweetalert2";

const CouponManagement = () => {
  const queryClient = useQueryClient();
  const { getAllCoupons, deleteCoupon } = couponService();

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Fetch coupons
  const {
    data: couponsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => getAllCoupons({}),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      toast.success("Xóa coupon thành công");
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa coupon này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    deleteMutation.mutate(id);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setShowModal(false);
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

  const coupons = couponsData?.data || [];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MdLocalOffer className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Coupon</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <FaPlus /> Thêm Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      {coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <MdLocalOffer className="mb-4 text-6xl text-gray-300" />
          <p className="text-lg font-medium">Không có coupon nào</p>
          <p className="text-sm">Nhấn "Thêm Coupon" để tạo coupon mới</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="relative overflow-hidden transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg"
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    coupon.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {coupon.isActive ? "Hoạt động" : "Tạm dừng"}
                </span>
              </div>

              {/* Header Section */}
              <div className="p-5 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center px-3 py-1 mb-2 text-sm font-bold text-blue-600 bg-white rounded-full">
                      {coupon.code}
                    </div>
                    <p className="text-sm font-medium text-white/90 line-clamp-2">
                      {coupon.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Discount Value Section */}
              <div className="px-5 py-4 text-center bg-gradient-to-b from-blue-50 to-white">
                <div className="flex items-center justify-center gap-2">
                  {coupon.type === "percentage" ? (
                    <>
                      <span className="text-4xl font-bold text-blue-600">
                        {coupon.discountValue}
                      </span>
                      <MdPercent className="text-3xl text-blue-600" />
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-blue-600">
                        {coupon.discountValue?.toLocaleString()}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        đ
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-gray-600">
                  {coupon.type === "percentage"
                    ? "Giảm theo phần trăm"
                    : "Giảm cố định"}
                </p>
              </div>

              {/* Details Section */}
              <div className="px-5 py-4 space-y-3">
                {/* Conditions */}
                <div>
                  <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                    Điều kiện
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Đơn tối thiểu:</span>
                      <span className="font-semibold text-gray-900">
                        {coupon.conditions?.minOrderAmount?.toLocaleString() ||
                          0}
                        đ
                      </span>
                    </div>
                    {coupon.maxDiscountAmount && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Giảm tối đa:</span>
                        <span className="font-semibold text-gray-900">
                          {coupon.maxDiscountAmount.toLocaleString()}đ
                        </span>
                      </div>
                    )}
                    {coupon.conditions?.newUserOnly && (
                      <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                        Chỉ khách hàng mới
                      </div>
                    )}
                  </div>
                </div>

                {/* Validity Period */}
                <div>
                  <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                    Thời gian hiệu lực
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MdDateRange className="text-lg text-gray-400" />
                    <div>
                      <div className="font-medium">
                        {new Date(coupon.validFrom).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-xs text-gray-500">
                        đến{" "}
                        {new Date(coupon.validTo).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div>
                  <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                    Tình trạng sử dụng
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Đã sử dụng:</span>
                      <span className="font-semibold text-gray-900">
                        {coupon.usage?.totalUsed || 0}/
                        {coupon.usageLimit?.totalUsageLimit || "∞"}
                      </span>
                    </div>
                    {coupon.usageLimit?.totalUsageLimit && (
                      <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div
                          className="h-full transition-all bg-blue-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              ((coupon.usage?.totalUsed || 0) /
                                coupon.usageLimit.totalUsageLimit) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Giới hạn/người:</span>
                      <span className="font-medium">
                        {coupon.usageLimit?.perUserLimit || 1} lần
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {coupon.notes && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs italic text-gray-600 line-clamp-2">
                      {coupon.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div className="flex gap-2 px-5 py-4 bg-gray-50">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-blue-700 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200"
                >
                  <FaEdit />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-red-700 transition-colors bg-red-100 rounded-lg hover:bg-red-200"
                >
                  <FaTrash />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CouponForm editingCoupon={editingCoupon} onClose={resetForm} />
      )}
    </div>
  );
};

export default CouponManagement;
