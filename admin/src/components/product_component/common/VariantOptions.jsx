import { useState, useEffect } from "react";

export default function VariantOptions({ handleChange, form }) {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const [selectedSize, setSelectedSize] = useState(form.size || sizes[0]);

  useEffect(() => {
    handleChange({
      target: {
        name: "size",
        value: selectedSize,
      },
    });
  }, [selectedSize]);

  return (
    <div className="p-3 shadow-sm border flex justify-between flex-wrap sm:flex-row border-gray-300">
      {/* Size Section */}
      <div>
        <h3 className="font-semibold">Size</h3>
        <p className="text-sm text-gray-400 mb-2">Pick One Size</p>
        <div className="flex gap-3 flex-wrap">
          {sizes.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-2 py-1 rounded-md border transition-all
                ${
                  selectedSize === size
                    ? "bg-pink-300 border-pink-400 text-black"
                    : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
