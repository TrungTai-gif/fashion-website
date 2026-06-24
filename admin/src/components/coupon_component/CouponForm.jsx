import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "../../services/couponService";
import { toast } from "react-toastify";

const CouponForm = ({ editingCoupon, onClose }) => {
  const queryClient = useQueryClient();
  const { createCoupon, updateCoupon } = couponService();

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percentage",
    discountValue: "",
    maxDiscountAmount: "",
    conditions: {
      minOrderAmount: "",
      maxOrderAmount: "",
      newUserOnly: false,
    },
    validFrom: "",
    validTo: "",
    usageLimit: {
      totalUsageLimit: "",
      perUserLimit: 1,
    },
    isActive: true,
    notes: "",
  });

  // Load dữ liệu khi edit
  useEffect(() => {
    if (editingCoupon) {
      setFormData({
        code: editingCoupon.code || "",
        description: editingCoupon.description || "",
        type: editingCoupon.type || "percentage",
        discountValue: editingCoupon.discountValue || "",
        maxDiscountAmount: editingCoupon.maxDiscountAmount || "",
        conditions: {
          minOrderAmount: editingCoupon.conditions?.minOrderAmount || "",
          maxOrderAmount: editingCoupon.conditions?.maxOrderAmount || "",
          newUserOnly: editingCoupon.conditions?.newUserOnly || false,
        },
        validFrom: editingCoupon.validFrom
          ? new Date(editingCoupon.validFrom).toISOString().split("T")[0]
          : "",
        validTo: editingCoupon.validTo
          ? new Date(editingCoupon.validTo).toISOString().split("T")[0]
          : "",
        usageLimit: {
          totalUsageLimit: editingCoupon.usageLimit?.totalUsageLimit || "",
          perUserLimit: editingCoupon.usageLimit?.perUserLimit || 1,
        },
        isActive:
          editingCoupon.isActive !== undefined ? editingCoupon.isActive : true,
        notes: editingCoupon.notes || "",
      });
    }
  }, [editingCoupon]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      type: formData.type,
      discountValue: Number(formData.discountValue),
      maxDiscountAmount: formData.maxDiscountAmount
        ? Number(formData.maxDiscountAmount)
        : null,
      conditions: {
        minOrderAmount: Number(formData.conditions.minOrderAmount) || 0,
        maxOrderAmount: formData.conditions.maxOrderAmount
          ? Number(formData.conditions.maxOrderAmount)
          : null,
        newUserOnly: formData.conditions.newUserOnly,
      },
      validFrom: new Date(formData.validFrom).toISOString(),
      validTo: new Date(formData.validTo).toISOString(),
      usageLimit: {
        totalUsageLimit: formData.usageLimit.totalUsageLimit
          ? Number(formData.usageLimit.totalUsageLimit)
          : null,
        perUserLimit: Number(formData.usageLimit.perUserLimit) || 1,
      },
      isActive: formData.isActive,
      notes: formData.notes,
    };

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-black/10">
        <div className="relative w-full max-w-3xl mx-4 overflow-y-auto bg-white shadow-2xl rounded-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-2 bg-blue-600 border-b border-gray-200">
            <h2 className="text-xl font-bold text-white">
              {editingCoupon ? "Chỉnh sửa Coupon" : "Thêm Coupon mới"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white transition-colors hover:bg-white/20 rounded-lg p-1.5"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              {/* Basic Information */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Mã Coupon *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ví dụ: WELCOME10"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Loại giảm giá *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="percentage">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định (VNĐ)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Mô tả *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={3}
                  placeholder="Mô tả về coupon..."
                />
              </div>

              {/* Discount Settings */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Cài đặt giảm giá
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Giá trị giảm *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountValue: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={
                        formData.type === "percentage" ? "10" : "50000"
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Đơn hàng tối thiểu
                    </label>
                    <input
                      type="number"
                      value={formData.conditions.minOrderAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          conditions: {
                            ...formData.conditions,
                            minOrderAmount: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="100000"
                    />
                  </div>

                  {formData.type === "percentage" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Giảm tối đa
                      </label>
                      <input
                        type="number"
                        value={formData.maxDiscountAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxDiscountAmount: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="50000"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Validity Period */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Thời gian hiệu lực
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.validFrom}
                      onChange={(e) =>
                        setFormData({ ...formData, validFrom: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Ngày kết thúc *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.validTo}
                      onChange={(e) =>
                        setFormData({ ...formData, validTo: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Usage Limits */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Giới hạn sử dụng
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Tổng số lượt sử dụng
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit.totalUsageLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usageLimit: {
                            ...formData.usageLimit,
                            totalUsageLimit: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="1000 (để trống = không giới hạn)"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Giới hạn mỗi người *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.usageLimit.perUserLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usageLimit: {
                            ...formData.usageLimit,
                            perUserLimit: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={2}
                  placeholder="Ghi chú thêm về coupon..."
                />
              </div>

              {/* Conditions */}
              <div className="p-4 space-y-3 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">
                  Điều kiện áp dụng
                </h3>
                <div className="flex items-center p-3 transition-colors bg-white border border-gray-200 rounded-lg hover:border-blue-300">
                  <input
                    type="checkbox"
                    id="newUserOnly"
                    checked={formData.conditions.newUserOnly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        conditions: {
                          ...formData.conditions,
                          newUserOnly: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="newUserOnly"
                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Chỉ áp dụng cho khách hàng mới
                  </label>
                </div>

                <div className="flex items-center p-3 transition-colors bg-white border border-gray-200 rounded-lg hover:border-blue-300">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded "
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Kích hoạt coupon ngay
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang xử lý...
                  </span>
                ) : editingCoupon ? (
                  "Cập nhật Coupon"
                ) : (
                  "Tạo Coupon"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CouponForm;
