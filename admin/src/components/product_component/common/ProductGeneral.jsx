const ProductGeneral = ({ handleChange, form }) => {
  return (
    <>
      <div className="p-5 w-full flex flex-col gap-3">
        <h3 className="font-bold text-xl ">Thông tin sản phẩm</h3>

        <div className="flex flex-row ">
          <label className="font-medium" htmlFor="barcode">
            Tên sản phẩm:
          </label>
          <input
            required
            onChange={handleChange}
            className="border-0 border-b border-b-gray-400 px-2 py-1 w-2/3 mx-3  focus:outline-none focus:border-pink-500 transition-all duration-200 rounded-none"
            type="text"
            name="name"
            defaultValue={form.name}
          />
        </div>
        <div className="flex flex-row ">
          <label className="font-medium" htmlFor="barcode">
            Mô tả ngắn:
          </label>
          <input
            required
            onChange={handleChange}
            className="border-0 border-b border-b-gray-400 px-2 py-1 w-2/3 mx-3  focus:outline-none focus:border-pink-500 transition-all duration-200 rounded-none"
            type="text"
            name="shortDescription"
            defaultValue={form.shortDescription}
          />
        </div>
        {/* <!-- Description and details --> */}
        <div>
          <div className="space-y-6">
            <textarea
              placeholder="Mô tả sản phẩm chi tiết"
              className="border px-4 py-2 border-gray-300 rounded-2xl w-full focus:border-pink-500 transition outline-none"
              type="textarea"
              defaultValue={form.longDescription}
              onChange={handleChange}
              name="longDescription"
              rows={3}
              required
            />
          </div>
        </div>

        <div className="flex flex-row gap-5">
          <div className="flex flex-col w-1/2">
            <label className="font-medium" htmlFor="basePrice">
              Giá bán cơ bản (₫):
            </label>
            <input
              required
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 mt-1 rounded-lg focus:outline-none focus:border-pink-500 transition-all duration-200"
              type="number"
              min="0"
              name="basePrice"
              defaultValue={form.basePrice || ""}
              placeholder="Ví dụ: 150000"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="font-medium" htmlFor="baseStock">
              Tồn kho cơ bản:
            </label>
            <input
              required
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 mt-1 rounded-lg focus:outline-none focus:border-pink-500 transition-all duration-200"
              type="number"
              min="0"
              name="baseStock"
              defaultValue={form.baseStock || ""}
              placeholder="Ví dụ: 100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 m-2">
          {/* Featured checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="isFeatured"
              className="rounded max-w-50 border-gray-300 focus:ring-indigo-200 focus:ring-2"
              type="checkbox"
              name="isFeatured"
              checked={!!form.isFeatured}
              onChange={handleChange}
            />
            <label
              htmlFor="isFeatured"
              className="font-medium text-gray-700 select-none"
            >
              Sản phẩm bán chạy
            </label>
          </div>

          {/* Active toggle: keep a checkbox for form semantics but also expose a button for quick toggle */}
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
        </div>
      </div>
    </>
  );
};

export default ProductGeneral;
