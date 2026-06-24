import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { productService } from "@services/productService";
import ImageForm from "./common/ImageForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShopContext } from "../../context/ShopContext";
import Spinner from "../common/Spinner";
import ProductGeneral from "./common/ProductGeneral";

import ProductCategory from "./common/ProductCategory";
import { IoMdReturnLeft } from "react-icons/io";
import { uploadService } from "@/services/uploadService";
import ProductAttributes from "./common/ProductAttributes";

const AddProductForm = () => {
  const { createProduct } = productService();
  const { uploadImages } = uploadService();
  const { navigate } = useContext(ShopContext);

  const [form, setForm] = useState({
    name: "",
    gender: "",
    category: "",
    brand: "",
    shortDescription: "",
    longDescription: "",
    isFeatured: false,
    isActive: true,
    attributes: [],
    basePrice: 0,
    baseStock: 0,
  });
  const [image, setImage] = useState([]);

  const queryClient = useQueryClient();
  const addProduct = useMutation({
    mutationFn: createProduct,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Product added!");
        queryClient.invalidateQueries("products");
        navigate("/products");
      } else {
        toast.error(res.message);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
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

    if (!image || image.length === 0) {
      toast.error("Phải có ít nhất 1 ảnh sản phẩm!");
      return;
    }

    const formDataForImages = new FormData();
    if (Array.isArray(image)) {
      image.forEach((img) => formDataForImages.append("images", img));
    } else if (image instanceof File) {
      formDataForImages.append("images", image);
    }

    const imageUrls = await uploadMutate.mutateAsync(formDataForImages);

    const productData = {
      name: form.name,
      shortDescription: form.shortDescription,
      longDescription: form.longDescription,
      brand: form.brand,
      category: form.category,
      gender: form.gender,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      attributes: form.attributes || [],
      image: imageUrls?.[0],
      basePrice: Number(form.basePrice) || 0,
      baseStock: Number(form.baseStock) || 0,
    };

    addProduct.mutate({ data: productData });
  };

  return (
    <>
      {(uploadMutate.isPending || addProduct.isPending) && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 z-30">
          <Spinner />
        </div>
      )}

      <div className="relative w-full mb-20  rounded-2xl shadow-2xl border border-gray-300 bg-white flex flex-col overflow-hidden">
        <div
          onClick={() => navigate("/products")}
          className="absolute top-2 left-2 cursor-pointer hover:scale-110"
        >
          <IoMdReturnLeft className="" size={20} />
        </div>
        <div className="flex flex-1 p-6">
          <form
            onSubmit={handleSubmit}
            className="pt-2 flex flex-col sm:flex-row gap-3 w-full max-w-3xl m-auto pb-10"
          >
            <div className="flex flex-col w-full ">
              <ProductGeneral handleChange={handleChange} form={form} />
              <div className="flex flex-col sm:flex-row items_center justify-between px-10">
                <ImageForm maxI={1} images={image} setImages={setImage} />
                {addProduct.isPending && <Spinner />}
                <ProductCategory handleChange={handleChange} form={form} />
              </div>
              <ProductAttributes form={form} setForm={setForm} />

              <div className="flex max-w-64 flex-row gap-2 px-5">
                <button
                  type="submit"
                  className="mt-10  w-full items-center py-1  rounded-lg border focus:border-pink-400 bg-gradient-to-r   text-base font-semibold text-white shadow-lg  hover:bg-pink-600 bg-pink-500 focus:ring-2  focus:ring-offset-2 focus:outline-none transition-all duration-150"
                >
                  Thêm mới
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/products");
                  }}
                  className="mt-10 w-full items-center  rounded-lg border    text-base font-semibold text-white shadow-lg  hover:bg-gray-500 bg-gray-400 focus:ring-2  focus:ring-offset-2 focus:outline-none transition-all duration-150"
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductForm;
