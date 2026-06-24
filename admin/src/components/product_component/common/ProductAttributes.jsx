export default function ProductAttributes({ form, setForm }) {
  const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"];
  const COLOR_OPTIONS = ["Black", "White", "Red", "Blue", "Green"];

  // xóa attribute đã có
  const handleRemoveAttribute = (index) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const setAttributeValuesByName = (attrName, values) => {
    setForm((prev) => {
      const attrs = [...(prev.attributes || [])];
      const idx = attrs.findIndex(
        (a) => (a.name || "").toLowerCase() === attrName.toLowerCase()
      );

      if (values && values.length > 0) {
        if (idx === -1) {
          attrs.push({ name: attrName, values });
        } else {
          attrs[idx] = { ...attrs[idx], values };
        }
      } else {
        if (idx !== -1) attrs.splice(idx, 1);
      }

      return { ...prev, attributes: attrs };
    });
  };

  const toggleSize = (size) => {
    const sizeAttr = (form.attributes || []).find(
      (a) => (a.name || "").toLowerCase() === "size"
    );
    const current = sizeAttr?.values || [];
    const exists = current.includes(size);
    const next = exists
      ? current.filter((s) => s !== size)
      : [...current, size];
    setAttributeValuesByName("Size", next);
  };

  const toggleColor = (color) => {
    const colorAttr = (form.attributes || []).find(
      (a) => (a.name || "").toLowerCase() === "color"
    );
    const current = colorAttr?.values || [];
    const exists = current.includes(color);
    const next = exists
      ? current.filter((c) => c !== color)
      : [...current, color];
    setAttributeValuesByName("Color", next);
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-semibold text-lg mb-2">Thuộc tính sản phẩm</h3>

      {/* Fixed Size options */}
      <div className=" rounded p-3 mb-3">
        <p className="font-medium mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((s) => {
            const selected = (form.attributes || [])
              .find((a) => (a.name || "").toLowerCase() === "size")
              ?.values?.includes(s);
            return (
              <label
                key={s}
                className={`px-2 py-1 border rounded cursor-pointer ${
                  selected ? "bg-pink-500 text-white" : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => toggleSize(s)}
                  className="mr-1"
                />
                {s}
              </label>
            );
          })}
        </div>
      </div>

      {/* Fixed Color options */}
      <div className=" rounded p-3 mb-3">
        <p className="font-medium mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((c) => {
            const selected = (form.attributes || [])
              .find((a) => (a.name || "").toLowerCase() === "color")
              ?.values?.includes(c);
            return (
              <label
                key={c}
                className={`px-2 py-1 shadow-2xl rounded cursor-pointer ${
                  selected ? "bg-indigo-700 text-white" : "bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => toggleColor(c)}
                  className="mr-1"
                />
                {c}
              </label>
            );
          })}
        </div>
      </div>

      {/* Danh sách attribute đã thêm */}
      <h3>Thuộc tính đã thêm</h3>
      {form.attributes?.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {form.attributes.map((attr, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between shadow p-2 rounded-md"
            >
              <div>
                <p className="font-medium">{attr.name}</p>
                <p className="text-sm text-gray-500">
                  {attr.values.join(", ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAttribute(index)}
                className="text-red-500 text-sm hover:underline mt-2 sm:mt-0"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm mb-3">Chưa có thuộc tính nào.</p>
      )}
    </div>
  );
}
