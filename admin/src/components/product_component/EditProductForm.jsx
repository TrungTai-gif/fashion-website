import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { productService } from "@services/productService";
import ImageForm from "./common/ImageForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Spinner from "../common/Spinner";
import ProductGeneral from "./common/ProductGeneral";
import ProductCategory from "./common/ProductCategory";

import { IoMdClose } from "react-icons/io";
import { uploadService } from "@/services/uploadService";

const EditProductForm = ({ product, onClose }) => {
  const { updateProduct } = productService();
  const { uploadImages } = uploadService();
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    gender: "",
    shortDescription: "",
    longDescription: "",
    isFeatured: null,
    isActive: null,
    image: null,
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name || "",
      category: product.category._id || "",
      brand: product.brand._id || "",
      isActive: product.isActive,
      shortDescription: product.shortDescription || "",
      longDescription: product.longDescription || "",
      isFeatured: product.isFeatured,
      gender: product.gender,
      image: product.image,
    });

    const initialImages = [];
    if (product.image) initialImages.push(product.image);
    setImages(initialImages);
  }, [product]);
  const queryClient = useQueryClient();

  const updateMutate = useMutation({
    mutationFn: updateProduct,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Cập nhật sản phẩm thành công!");
        queryClient.invalidateQueries(["products"]);
        onClose?.();
      } else {
        toast.error(res.message);
      }
    },
    onError: (err) => toast.error(err.message),
  });
  const uploadMutate = useMutation({
    mutationFn: uploadImages,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image && images.length === 0) {
      toast.error("Phải có ít nhất 1 hình ảnh!");
      return;
    }

    let imageUrls = [];

    if (images && images.length > 0) {
      const formDataForImages = new FormData();

      images.forEach((img) => {
        if (img instanceof File) {
          formDataForImages.append("images", img);
        }
      });
      if ([...formDataForImages.entries()].length > 0) {
        try {
          imageUrls = await uploadMutate.mutateAsync(formDataForImages);
        } catch (error) {
          toast.error("Lỗi upload hình ảnh!");
          console.error(error);
          return;
        }
      }
    }

    const productData = {
      name: form.name,
      shortDescription: form.shortDescription,
      longDescription: form.longDescription,
      brand: form.brand,
      category: form.category,
      gender: form.gender,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      image: imageUrls.length > 0 ? imageUrls[0] : form.image,
    };
    updateMutate.mutate({ id: product._id, data: productData });
  };

  return (
    <>
      {(uploadMutate.isPending || updateMutate.isPending) && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 z-30">
          <Spinner />
        </div>
      )}
      {/* Modal chính */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
        <div className="overflow-y-scroll max-h-150 relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-pink-500 to-pink-400 text-white">
            <h2 className="text-lg font-semibold">Cập nhật sản phẩm</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <IoMdClose size={22} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-5 space-y-6">
            <ProductGeneral handleChange={handleChange} form={form} />

            <div className="flex flex-col sm:flex-row gap-5 justify-between">
              <ImageForm maxI={1} images={images} setImages={setImages} />
              <ProductCategory handleChange={handleChange} form={form} />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow"
              >
                {updateMutate.isPending || uploadMutate.isPending ? (
                  <Spinner />
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProductForm;
