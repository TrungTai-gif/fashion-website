import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { brandsService } from "../../services/brandsService";
import { uploadService } from "../../services/uploadService";
import Spinner from "../common/Spinner";
import LogoUpload from "./LogoUpload";
import { useMutation } from "@tanstack/react-query";

const BrandModal = ({ setShowModal, editing, brand, refetch }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);

  const { createBrand, updateBrand } = brandsService();
  const { uploadImages } = uploadService();

  useEffect(() => {
    if (brand) {
      setName(brand.name);
      setDescription(brand.description);
      setLogo(brand.image);
    }
  }, [brand]);

  const uploadMutate = useMutation({
    mutationFn: uploadImages,
  });

  const addBrandMutate = useMutation({
    mutationFn: createBrand,
    onSuccess: (res) => {
      toast.success("Brand added!");
      setShowModal(false);
      refetch();
    },
    onError: (err) => {
      toast.error(err?.message || "Có lỗi xảy ra!");
    },
  });

  const handleAddBrand = async () => {
    checkData;
    const formData = new FormData();

    if (logo instanceof File) {
      formData.append("images", logo);
    }

    // 1. Upload hình ảnh trước
    const imageUrls = await uploadMutate.mutateAsync(formData);

    addBrandMutate.mutate({
      name: name,
      image: imageUrls[0],
      description: description,
    });
  };

  const checkData = () => {
    if (name.trim() === "") {
      toast.error("Tên thương hiệu không được để trống!");
      return;
    }
    if (description.trim() === "") {
      toast.error("Hãy mô tả một chút về thương hiệu này!");
      return;
    }
    if (logo == null) {
      toast.error("Hãy chọn một hình ảnh!");
      return;
    }
  };

  const handleEditBrand = async () => {
    checkData;

    // Create FormData to handle file upload
    const formData = new FormData();

    if (logo instanceof File) {
      formData.append("image", logo);
    }

    const res = await updateBrand(brand._id, formData);
    if (res && res.success) {
      toast.success("Brand updated!");
      refetch();
      setShowModal(false);
    } else {
      toast.error(res?.message || "Có lỗi xảy ra!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) return handleEditBrand();
    handleAddBrand();
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {(addBrandMutate.isPending || uploadImages.isPending) && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <Spinner />
          </div>
        )}
        <h3 className="text-lg font-bold text-indigo-700">
          {editing ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
        </h3>

        {/* Logo Upload Section */}
        <LogoUpload logo={logo} setLogo={setLogo} size="w-24 h-24" />

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên thương hiệu *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên thương hiệu"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả về thương hiệu..."
            rows={3}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={addBrandMutate.isPending}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!description.trim() || !logo || !name.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {addBrandMutate.isPending && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  className="opacity-75"
                />
              </svg>
            )}
            {editing ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;
