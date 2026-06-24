import { useQuery } from "@tanstack/react-query";

import { categoriesService } from "@services/categoriesService";

import { brandsService } from "@services/brandsService";
const ProductCategory = ({ handleChange, form }) => {
  const { getAllCategories } = categoriesService();
  const { getAllBrands } = brandsService();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });
  // support form.category / form.brand being either an object ({ _id }) or an id string
  const selectedCategory =
    form?.category?._id ??
    (typeof form?.category === "string" ? form.category : "");
  const selectedBrand =
    form?.brand?._id ?? (typeof form?.brand === "string" ? form.brand : "");

  return (
    <>
      <div className="flex flex-col ">
        {/* category and brand */}

        <div className="flex flex-col gap-4 w-full justify-around">
          <div className="flex flex-col w-full">
            <label className="font-medium w-32" htmlFor="gender">
              Giới tính:
            </label>
            <select
              name="gender"
              onChange={handleChange}
              value={form.gender || ""}
              className="border border-gray-300 rounded-md px-2 py-1 w-2/3 focus:outline-none focus:border-pink-500 transition-all duration-200"
              required
            >
              <option value="" disabled>
                -- Chọn giới tính --
              </option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div className="flex flex-col w-full ">
            <label htmlFor="category" className="mb-1 font-bold text-gray-700">
              Danh mục sản phẩm
            </label>
            <select
              onChange={handleChange}
              name="category"
              id="category"
              value={selectedCategory}
              className="max-w-60 rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-400  transition w-full outline-none bg-white"
              required
            >
              <option value="">Chọn danh mục</option>
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
          <div className="flex flex-col w-full">
            <label htmlFor="brand" className="mb-1 font-bold text-gray-700 ">
              Thương hiệu
            </label>
            <select
              id="brand"
              name="brand"
              className="max-w-60 rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500  transition w-full outline-none bg-white"
              onChange={handleChange}
              value={selectedBrand}
              required
            >
              <option value="">Chọn thương hiệu</option>
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
    </>
  );
};

export default ProductCategory;
