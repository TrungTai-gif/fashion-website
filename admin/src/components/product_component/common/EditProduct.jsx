import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ImageForm from "./ImageForm";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../../../../services/categoriesService";
import { brandsService } from "../../../../services/brandsService";

import { productHooks } from "../../hooks/productHooks";
import Spinner from "../Spinner";

const EditProduct = ({ product, setShowEditModal }) => {
  const { getAllCategories } = categoriesService();
  const { useUpdateProduct } = productHooks();

  const { getAllBrands } = brandsService();
  const [form, setForm] = useState({
    name: product.name,
    barcode: product.barcode,
    category: product.category,
    brand: product.brand,
    price: product.price,
    cost: product.cost,
    stock: product.stock,
    warrantyMonths: product.warrantyMonths,
    description: product.description,
    bestseller: product.bestseller,
    images: product.images,
  });
  const [imagePreviews, setImagePreviews] = useState(product.images);
  const maxImage = 9;

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });

  const { mutate, isPending } = useUpdateProduct();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.images.length === 0) {
      toast.error("Must have at least 1 image!");
      return;
    }

    mutate(
      { id: product._id, data: form },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast.success("Product updated!");
            setShowEditModal(false);
          } else {
            toast.error(res.message);
          }
        },
      }
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const remainingSlots = maxImage - form.images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...filesToAdd],
    }));
    setImagePreviews((prev) => [
      ...prev,
      ...filesToAdd.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <div
        className={` fixed  inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm`}
      >
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setShowEditModal(false)}
        />
        <div className="mb-10 relative w-full max-w-4xl h-[90vh] mt-10 rounded-2xl shadow-2xl border border-gray-300 bg-white flex flex-col overflow-hidden">
          <div className="flex flex-col flex-1 overflow-y-auto hide-scrollbar p-6">
            <h2 className="relative text-2xl text-left font-bold">
              Add new product
            </h2>
            <div
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              X
            </div>
            {isPending && (
              <div className="absolute top-[50%] left-[50%]">
                <Spinner />
              </div>
            )}
            <form onSubmit={handleSubmit} className="pt-2">
              {/* <!-- Image gallery --> */}

              <ImageForm
                maxImage={maxImage}
                imagePreviews={imagePreviews}
                onChange={handleImageChange}
                onRemove={handleRemoveImage}
              />

              {/* products code and name */}
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <label className="font-bold" htmlFor="barcode">
                    Barcode:
                  </label>
                  <input
                    onChange={handleChange}
                    required
                    className="border-0 border-b border-b-gray-400 px-2 py-1 w-1/3 mx-3 focus:outline-none focus:border-b-blue-500 transition-all duration-200 rounded-none"
                    type="text"
                    name="barcode"
                    defaultValue={form.barcode}
                  />
                </div>
                <div>
                  <label className="font-bold" htmlFor="barcode">
                    Product name:
                  </label>
                  <input
                    onChange={handleChange}
                    required
                    className="border-0 border-b border-b-gray-400 px-2 py-1 w-2/3 mx-3 focus:outline-none focus:border-b-blue-500 transition-all duration-200 rounded-none"
                    type="text"
                    name="name"
                    defaultValue={form.name}
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* <!-- Product info --> */}
                <div className="mx-5 flex flex-col w-full md:w-1/2 lg:border-r pr-4 lg:border-gray-300">
                  {/* <!-- Description and details --> */}
                  <div>
                    <div className="space-y-6">
                      <textarea
                        onChange={handleChange}
                        placeholder="Description"
                        className="border px-4 border-gray-300 rounded-2xl w-full "
                        type="textarea"
                        name="description"
                        rows={3}
                        required
                        defaultValue={form.description}
                      />
                    </div>
                  </div>
                  {/* category and brand */}
                  <div className="mt-5 flex-row flex justify-around">
                    <div className="flex flex-col gap-4 w-full md:flex-row md:gap-8 justify-around">
                      <div className="flex flex-col w-full md:w-1/2">
                        <label
                          htmlFor="category"
                          className="mb-1 font-bold text-gray-700"
                        >
                          Category
                        </label>

                        <select
                          onChange={handleChange}
                          name="category"
                          id="category"
                          value={form.category?._id ?? ""}
                          className=" max-w-80 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition w-full outline-none bg-white"
                        >
                          {categories &&
                            categories.map((category) => {
                              return (
                                <option key={category._id} value={category._id}>
                                  {category.name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                      <div className="flex flex-col w-full md:w-1/2">
                        <label
                          htmlFor="brand"
                          className="mb-1 font-bold text-gray-700 "
                        >
                          Brand
                        </label>

                        <select
                          onChange={handleChange}
                          id="brand"
                          name="brand"
                          value={form.brand?._id ?? ""}
                          className="max-w-80 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition w-full outline-none bg-white"
                        >
                          {brands &&
                            brands.map((brand) => {
                              return (
                                <option key={brand._id} value={brand._id}>
                                  {brand.name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- price --> */}
                <div className="mt-4 w-full  md:w-1/2 pl-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label
                        className="mb-1 font-medium text-gray-700"
                        htmlFor="price-sell"
                      >
                        Price sell ($)
                      </label>
                      <input
                        onChange={handleChange}
                        name="price"
                        id="price-sell"
                        className="max-w-50 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition w-full outline-none"
                        type="number"
                        required
                        placeholder="$1243"
                        defaultValue={form.price}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        className="mb-1 font-medium text-gray-700"
                        htmlFor="cost"
                      >
                        Cost ($)
                      </label>
                      <input
                        onChange={handleChange}
                        id="cost"
                        name="cost"
                        className="max-w-50 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition w-full outline-none"
                        type="number"
                        required
                        placeholder="$1243"
                        defaultValue={form.cost}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        className="mb-1 font-medium text-gray-700"
                        htmlFor="stock"
                      >
                        Stock
                      </label>
                      <input
                        onChange={handleChange}
                        id="stock"
                        name="stock"
                        className="max-w-50 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition w-full outline-none"
                        type="number"
                        required
                        placeholder="100"
                        defaultValue={form.stock}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        className="mb-1 font-medium text-gray-700"
                        htmlFor="warranty"
                      >
                        Warranty Months
                      </label>
                      <input
                        onChange={handleChange}
                        id="warranty"
                        name="warrantyMonths"
                        className="max-w-50 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition w-full outline-none"
                        type="number"
                        required
                        placeholder="13"
                        defaultValue={form.warrantyMonths}
                      />
                    </div>
                    <div className="flex items-center gap-2 col-span-1 md:col-span-2 mt-2">
                      <input
                        onChange={handleChange}
                        id="bestseller"
                        name="bestseller"
                        className="rounded max-w-50 border-gray-300 focus:ring-indigo-200 focus:ring-2"
                        type="checkbox"
                        defaultValue={form.bestseller}
                      />
                      <label
                        htmlFor="bestseller"
                        className="font-medium text-gray-700 select-none"
                      >
                        Bestseller
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-10 w-full items-center rounded-lg border border-indigo-600 bg-gradient-to-r from-indigo-500 to-indigo-700 px-8 py-3 text-base font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none transition-all duration-150"
                  >
                    Save product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
