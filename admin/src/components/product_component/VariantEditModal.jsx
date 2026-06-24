import { useState, useEffect } from "react";
import { X, DollarSign, Package, Calendar } from "lucide-react";
import ImageForm from "./common/ImageForm";
import { variantsService } from "@/services/variantService";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { uploadService } from "@services/uploadService";
import Spinner from "../common/Spinner";

export default function VariantEditModal({ variant, onClose, onSaved }) {
  const { uploadImages } = uploadService();
  const [form, setForm] = useState({
    price: "",
    cost: "",
    stock: "",
    image: "",
  });
  const [images, setImages] = useState([]);
  const { create, update } = variantsService();

  useEffect(() => {
    if (variant) {
      setForm({
        price: variant.price,
        cost: variant.cost,
        stock: variant.stock,
        isActive: variant.isActive,
        image: variant.image,
      });
      setImages([variant.image]);
    }
  }, [variant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Mutation cho thêm mới
  const { mutate: createVariant, isPending: createLoading } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success("Tạo biến thể thành công!");
      onSaved?.();
      onClose?.();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Tạo biến thể thất bại!");
    },
  });

  // Mutation cho cập nhật
  const updateMutate = useMutation({
    mutationFn: update,
    onSuccess: () => {
      toast.success("Cập nhật biến thể thành công!");
      onSaved?.();
      onClose?.();
    },
    onError: (err) => {
      console.error(err);
      toast.error("cập nhật biến thể thất bại!");
    },
  });
  //upload image
  const uploadMutate = useMutation({
    mutationFn: uploadImages,
  });
  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product", productId);
    formData.append("size", form.size);

    for (let key of ["color", "price", "cost", "stock", "sku"]) {
      if (form[key] !== undefined && form[key] !== "") {
        formData.append(key, form[key]);
      }
    }

    images.forEach((f) => {
      if (f instanceof File) {
        formData.append("images", f);
      }
    });

    createVariant(formData);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (images.length < 1) {
      toast.warning("Cần ít nhất 1 hình ảnh!");
      return;
    }

    let imageUrls = []; // Giữ ảnh cũ mặc định (dạng array)

    // Kiểm tra xem có ảnh mới (File) không
    const hasNewImage = images.some((img) => img instanceof File);

    if (hasNewImage) {
      // Chỉ upload khi có ảnh mới
      const formDataForImages = new FormData();
      images.forEach((img) => {
        if (img instanceof File) {
          formDataForImages.append("images", img);
        }
      });

      try {
        const uploadedUrls = await uploadMutate.mutateAsync(formDataForImages);
        if (uploadedUrls && uploadedUrls.length > 0) {
          imageUrls = uploadedUrls; // Sử dụng ảnh mới (array)
        }
      } catch (error) {
        toast.error("Lỗi upload hình ảnh!");
        console.error(error);
        return;
      }
    } else {
      // Giữ ảnh cũ dạng array
      imageUrls = Array.isArray(form.image) ? form.image : [form.image];
    }

    const variantData = {
      product: variant.product,
      price: Number(form.price), // Đảm bảo là number
      cost: Number(form.cost), // Đảm bảo là number
      stock: Number(form.stock), // Đảm bảo là number
      isActive: Boolean(form.isActive), // Đảm bảo là boolean
      image: imageUrls[0], // Đảm bảo là array
    };

    updateMutate.mutate({ id: variant._id, data: variantData });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg max-h-150 overflow-y-scroll">
        <div className="flex justify-between items-center text-white p-2 bg-indigo-800 border-b">
          <h3 className="text-lg font-semibold">Chỉnh sửa biến thể</h3>
          <button onClick={onClose} className="hover:scale-110 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6  flex-col   ">
          <div className="flex flex-col">
            <div className=" text-gray-500 text-base">{variant.sku}</div>
            <div className=" p-2 ">
              <h4 className="font-bold text-gray-700">
                {variant.attributes[1].value}
              </h4>
              <h4 className="text-red-600">
                Size: {variant.attributes[0].value}
              </h4>
            </div>
          </div>
          <div className="sm:flex-row flex flex-col gap-2">
            <div className="flex w-1/2 flex-col gap-2 ">
              {/* Ảnh */}
              <div className="w-full">
                <ImageForm images={images} setImages={setImages} maxI={1} />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {/* Status Toggle */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="isActive"
                  className="font-medium text-gray-700 select-none"
                >
                  Trạng thái
                </label>
                <input
                  id="isActive"
                  className="sr-only"
                  type="checkbox"
                  name="isActive"
                  checked={!!form.isActive}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "isActive",
                        type: "checkbox",
                        checked: !form.isActive,
                      },
                    })
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    form.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {form.isActive ? "Đang bán" : "Ngưng bán"}
                </button>
              </div>
              {/* Price Input */}
              <div className="space-y-2 flex gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign size={18} className="text-green-600" />
                  Giá bán
                </label>
                <div className="flex relative">
                  <input
                    name="price"
                    required
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Nhập giá bán"
                    className="border-1 border-gray-300 rounded-xl w-full px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₫
                  </span>
                </div>
              </div>
              {/* Cost Input */}
              <div className="space-y-2 flex gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign size={18} className="text-orange-600" />
                  Giá vốn
                </label>
                <div className="relative flex">
                  <input
                    name="cost"
                    type="number"
                    required
                    value={form.cost}
                    onChange={handleChange}
                    placeholder="Nhập giá vốn"
                    className="border-1 border-gray-300 rounded-xl w-full px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₫
                  </span>
                </div>
              </div>
              {/* Stock Input */}
              <div className="space-y-2 flex gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Package size={16} />
                  Tồn kho
                </label>
                <div className="relative flex">
                  <input
                    name="stock"
                    type="number"
                    required
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Nhập giá vốn"
                    className="border-1 border-gray-300 rounded-xl w-full px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₫
                  </span>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-2 p-1  rounded-lg ">
                <Calendar size={18} className="text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Ngày tạo</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(variant.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {(createLoading || updateMutate.isPending) && <Spinner />}
          </div>
          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-2 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
