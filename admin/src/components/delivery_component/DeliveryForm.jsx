import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryService } from "../../services/deliveryService";

const DeliveryForm = ({ editingRate, onClose }) => {
  const queryClient = useQueryClient();
  const { createDelivery, updateDelivery } = deliveryService();

  const [formData, setFormData] = useState({
    name: "",
    type: "standard",
    description: "",
    baseFee: "",
    extraFee: "",
    freeShippingMinAmount: "",
    deliveryDays: "",
    maxDeliveryDays: "",
    isActive: true,
    notes: "",
  });

  // Load dữ liệu khi edit
  useEffect(() => {
    if (editingRate) {
      setFormData({
        name: editingRate.name || "",
        type: editingRate.type || "standard",
        description: editingRate.description || "",
        baseFee: editingRate.baseFee || "",
        extraFee: editingRate.extraFee || "",
        freeShippingMinAmount: editingRate.freeShippingMinAmount || "",
        deliveryDays: editingRate.deliveryDays || "",
        maxDeliveryDays: editingRate.maxDeliveryDays || "",
        isActive:
          editingRate.isActive !== undefined ? editingRate.isActive : true,
        notes: editingRate.notes || "",
      });
    }
  }, [editingRate]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries(["deliveries"]);
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDelivery(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["deliveries"]);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      baseFee: Number(formData.baseFee),
      extraFee: Number(formData.extraFee),
      freeShippingMinAmount: Number(formData.freeShippingMinAmount),
      deliveryDays: Number(formData.deliveryDays),
      maxDeliveryDays: Number(formData.maxDeliveryDays),
      isActive: formData.isActive,
      notes: formData.notes,
    };

    if (editingRate) {
      updateMutation.mutate({ id: editingRate._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-black/10">
        <div className="relative w-full max-w-3xl max-h-screen p-6 overflow-y-auto bg-white rounded-lg">
          <h2 className="mb-4 text-xl font-bold">
            {editingRate ? "Chỉnh sửa " : "Thêm phương thức mới"}
          </h2>
          <p
            onClick={onClose}
            className="absolute text-2xl text-gray-600 top-1 right-2 hover:cursor-pointer hover:scale-110 hover:text-red-500"
          >
            x
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Tên phương thức *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                  placeholder="Ví dụ: Giao hàng tiêu chuẩn"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Loại giao hàng *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                >
                  <option value="standard">Tiêu chuẩn</option>
                  <option value="express">Nhanh</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                rows={2}
                placeholder="Mô tả về phương thức giao hàng..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Phí vận chuyển cơ bản (VNĐ) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.baseFee}
                  onChange={(e) =>
                    setFormData({ ...formData, baseFee: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                  placeholder="30000"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Phí express thêm (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.extraFee}
                  onChange={(e) =>
                    setFormData({ ...formData, extraFee: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                  placeholder="20000"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Chỉ áp dụng cho loại Express
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Miễn phí từ (VNĐ) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.freeShippingMinAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      freeShippingMinAmount: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Số ngày tối thiểu *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.deliveryDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryDays: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg t"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Số ngày tối đa *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxDeliveryDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDeliveryDays: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                  placeholder="7"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Ghi chú
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                rows={2}
                placeholder="Ghi chú thêm về phương thức giao hàng..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Đang xử lý..."
                  : editingRate
                  ? "Cập nhật"
                  : "Tạo mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeliveryForm;
